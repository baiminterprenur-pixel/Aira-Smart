export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen/qwen3.6-flash",
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah Aira, AI desa Indonesia yang ramah dan membantu masyarakat."
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

    const reply =
      data.choices?.[0]?.message?.content ||
      "Maaf terjadi kesalahan.";

    res.status(200).json({
      reply
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error"
    });
  }
}
