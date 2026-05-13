export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aira-smart.vercel.app",
        "X-Title": "Aira AI Desa"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-flash",
        messages: [
          {
            role: "system",
            content: "Kamu adalah Aira, asisten AI desa yang ramah dan membantu masyarakat."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Maaf, aku tidak bisa menjawab sekarang.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({
      reply: "Server AI sedang error."
    });
  }
}
