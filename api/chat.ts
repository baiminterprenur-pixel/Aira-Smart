export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      reply: "❌ API KEY belum terbaca di Vercel (ENV undefined)"
    });
  }

  try {
    // 🔹 Daftar model yang mau dipanggil
    const models = [
      "openai/Laguna XS.2",
      "openai/Laguna M.1",
      "openai/CoBuddy",
      "openai/Ring-2.6-1T"
    ];

    // 🔹 Panggil semua model paralel
    const responses = await Promise.all(
      models.map(async (m) => {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: m,
            messages: [
              { role: "system", content: `Kamu adalah ${m}, AI yang menjawab sesuai gaya masing-masing.` },
              { role: "user", content: message }
            ]
          })
        });
        return resp.json();
      })
    );

    // 🔹 Ambil jawaban dari tiap model
    const replies = responses.map(r => r?.choices?.[0]?.message?.content || "❌ Tidak ada jawaban");

    // 🔹 Kirim semua jawaban ke Aira untuk kesimpulan
    const summaryResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/Laguna XS.2", // Aira pakai Laguna XS.2
        messages: [
          { role: "system", content: "Kamu adalah Aira, AI desa yang ramah dan membantu. Tugasmu: tarik kesimpulan dari jawaban beberapa AI lain." },
          { role: "user", content: `Ini jawaban dari 3 AI lain:\n\n${replies.join("\n\n")} \n\nTolong buat kesimpulan ringkas dan jelas.` }
        ]
      })
    });

    const summaryData = await summaryResp.json();
    const finalReply = summaryData?.choices?.[0]?.message?.content || "❌ Aira tidak merespon";

    return res.status(200).json({
      replies,       // jawaban mentah dari semua AI
      conclusion: finalReply // kesimpulan dari Aira
    });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}
