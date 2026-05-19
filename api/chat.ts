  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.app",
        "X-Title": "Aira BUMDes AI"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",

        messages: [
          {
            role: "system",
            content: `
Kamu adalah Aira, AI resmi BUMDes Sari Mandiri Desa Mekar Sari.

Aturan:
- Bahasa Indonesia
- Jawaban Jelas dan Mudah di Mengerti
- Ramah dan sopan
- Fokus pada layanan Bumdes Sari Mandiri Desa Mekar Sari & UMKM
- Jika tidak tahu, katakan dengan jujur
            `
          },
          {
            role: "user",
            content: message
          }
        ],

        temperature: 0.7,
        max_tokens: 500
      })
    }
  );

  const data = await response.json();

  if (!response.ok || !data?.choices?.[0]) {
    console.error(data);

    return res.status(500).json({
      reply: "Maaf, AI sedang sibuk. Coba beberapa saat lagi."
    });
  }

  const aiReply = data.choices[0].message.content;

  return res.status(200).json({
    reply: aiReply || "Saya belum bisa menjawab itu."
  });
