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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // ✅ Model ID resmi Laguna XS.2 (free)
        model: "poolside/laguna-xs.2:free",
        messages: [
          {
            role: "system",
            content: "Kamu adalah Aira, AI desa yang ramah. Jawablah dengan bahasa sederhana, mudah dimengerti, dan tidak terlalu panjang."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("DEBUG DATA:", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: data?.error?.message || "OpenRouter error (auth atau model problem)"
      });
    }

    if (!data?.choices || !data.choices[0]?.message?.content) {
      return res.status(200).json({ reply: "❌ Maaf, belum ada balasan dari AI." });
    }

    const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}
