export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // 🔥 DEBUG PENTING (INI POIN NOMOR 3)
  console.log("ENV CHECK OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      reply: "API KEY belum terbaca di server (ENV undefined)"
    });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Kamu adalah Aira, AI desa yang ramah dan membantu."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI tidak merespon";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      reply: "Server error"
    });
  }
}
