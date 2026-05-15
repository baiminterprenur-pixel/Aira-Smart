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

  const lowerMsg = message.toLowerCase();

  // 🔎 Kata kunci khusus
  const developerKeywords = [
    "siapa pengembang",
    "siapa yang buat kamu",
    "siapa penciptamu",
    "siapa yang bikin kamu",
    "siapa yang ciptakan kamu",
    "siapa yang program kamu",
    "pengembangmu siapa",
    "dibuat oleh siapa",
    "developer kamu"
  ];

  const feedbackKeywords = [
    "beri masukan",
    "memberi masukan",
    "kasih masukan",
    "saran untuk desa",
    "kritik desa",
    "feedback desa",
    "masukan ke desa mekar sari"
  ];

  const bantuanKeywords = [
    "ajukan bantuan",
    "minta bantuan",
    "pengajuan bantuan",
    "bantuan desa",
    "form bantuan",
    "mengajukan bantuan"
  ];

  // 🔎 Cek developer
  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        "Saya dikembangkan oleh **Sabtu Ibrahim alias Baim**, perangkat Desa Mekar Sari Kecamatan Keluang. 🚀"
    });
  }

  // 🔎 Cek masukan
  if (feedbackKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        "Untuk memberi masukan ke Desa Mekar Sari, silakan isi formulir berikut: https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header"
    });
  }

  // 🔎 Cek bantuan
  if (bantuanKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        "Untuk mengajukan bantuan, silakan isi formulir berikut: https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header"
    });
  }

  const models = [
    "poolside/laguna-xs.2:free",
    "inclusionai/ring-2.6-1t:free",
    "google/gemma-4-31b-it:free"
  ];

  try {
    const responses = await Promise.all(
      models.map(async (model) => {
        try {
          const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "Kamu adalah Aira, AI desa yang ramah. Jawablah dengan bahasa sederhana, mudah dimengerti, dan tidak terlalu panjang."
                },
                { role: "user", content: message }
              ]
            })
          });

          const data = await resp.json();
          if (!resp.ok) {
            console.error(`Model ${model} error:`, data?.error?.message);
            return "";
          }
          return data?.choices?.[0]?.message?.content?.trim() || "";
        } catch (err) {
          console.error(`Fetch error dari model ${model}:`, err);
          return "";
        }
      })
    );

    const combined = responses.filter(Boolean).join(" ");
    const sentences = combined.split(/(?<=[.!?])\s+/);

    const uniqueSentences = [];
    const seenKeys = new Set();

    for (const s of sentences) {
      const key = s.toLowerCase().replace(/[^\w\s]/g, "").trim();
      const mainKey = key.split(" ").slice(0, 2).join(" ");
      if (mainKey && !seenKeys.has(mainKey)) {
        seenKeys.add(mainKey);
        uniqueSentences.push(s);
      }
    }

    const finalReply =
      uniqueSentences.slice(0, 3).join(" ") ||
      "❌ Maaf, belum ada balasan dari AI.";

    return res.status(200).json({ reply: finalReply });
  } catch (err) {
    console.error("ERROR utama:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}
