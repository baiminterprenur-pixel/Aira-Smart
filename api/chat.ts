export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // 🔑 Ambil API key dari ENV
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      reply: "❌ API KEY belum terbaca di Vercel (ENV undefined)"
    });
  }

  // 🔑 Validasi header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return res.status(401).json({ error: "Missing or invalid Authentication header" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Kamu adalah Aira, AI desa yang ramah dan membantu." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        reply: data?.error?.message || "OpenRouter error (auth atau model problem)"
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "AI tidak merespon";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}
