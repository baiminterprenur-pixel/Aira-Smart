import allSurat from "../modules/surat";

interface SuratIntent {
  keywords: string[];
  reply: string;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Pesan tidak boleh kosong." });
  }

  const lowerMsg = message.toLowerCase();
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ reply: "Maaf, sistem AI belum dikonfigurasi." });
  }

  const developerKeywords = [
    "siapa pengembang","siapa yang buat kamu","siapa penciptamu","siapa yang bikin kamu",
    "siapa yang ciptakan kamu","siapa yang program kamu","pengembangmu siapa","dibuat oleh siapa","developer kamu"
  ];
  const feedbackKeywords = [
    "beri masukan","memberi masukan","kasih masukan","saran untuk desa","kritik desa","feedback desa","masukan ke desa mekar sari"
  ];
  const bantuanKeywords = [
    "ajukan bantuan","minta bantuan","pengajuan bantuan","bantuan desa","form bantuan","mengajukan bantuan"
  ];

  const customResponses = [
    {
      keywords: ["buat surat domisili","mau buat surat domisili","surat domisili","domisili","skdu","buat skdu"],
      reply: `
      Oke, silakan isi datamu jika ingin membuat Surat Domisili di link berikut ya :<br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" target="_blank" rel="noopener noreferrer">📄 Form Surat Domisili</a>
      `
    },
    {
      keywords: ["buat surat keterangan usaha","buatkan surat keterangan usaha","mau buat surat keterangan usaha","surat keterangan usaha","sku","buat sku","mau buat sku","surat usaha"],
      reply: `
      Oke, silakan isi datamu jika ingin membuat Surat Keterangan Usaha di link berikut ya :<br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfwKiGjCUQaAbebp0khcr0eKGYHKwNdnmKfYmMaq_6NLE6yfw/viewform?usp=header" target="_blank" rel="noopener noreferrer">📄 Form Surat Keterangan Usaha</a>
      `
    },
    {
      keywords: ["hai selamat malam","hai selamat pagi","hai selamat siang","hai selamat sore","hai","halo"],
      reply: `Halo 👋 Ada yang bisa saya bantu?`
    }
  ];

  // 🔎 Jawaban khusus
  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: "Saya dikembangkan oleh Sabtu Ibrahim, yang akrab disapa Baim, seorang perangkat Desa Mekar Sari, Kecamatan Keluang, dengan semangat menghadirkan inovasi dan kemudahan melalui teknologi. 🚀"
    });
  }

  if (feedbackKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: `
      Terimakasih atas masukannya 🙏<br><br>
      Silakan isi form berikut ya:<br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">📄 Form Feedback Desa</a>
      `
    });
  }

  if (bantuanKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: `
      Silakan isi form bantuan berikut ya:<br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSe4S_TwmGhtrXz4x9o3vuV9hSfqWgyAVGAT0iC_dORMbWr-Ug/viewform?usp=header" target="_blank" rel="noopener noreferrer">📄 Form Bantuan Desa</a>
      `
    });
  }

  // 📂 AUTO MODULE SURAT
  const suratList: SuratIntent[] = Object.values(allSurat || {}) as SuratIntent[];
  for (const intent of suratList) {
    if (!intent?.keywords || !intent?.reply) continue;
    const matched = intent.keywords.some((kw) => lowerMsg.includes(kw.toLowerCase()));
    if (matched) {
      return res.status(200).json({ reply: intent.reply });
    }
  }

  // 🔥 AUTO CUSTOM RESPONSES
  for (const item of customResponses) {
    const matched = item.keywords.some((kw) => lowerMsg.includes(kw.toLowerCase()));
    if (matched) {
      return res.status(200).json({ reply: item.reply });
    }
  }

  // 🤖 DEFAULT AI RESPONSE
  const models = ["google/gemma-3-27b-it:free","deepseek/deepseek-chat:free","mistralai/mistral-7b-instruct:free"];

  try {
    for (const model of models) {
      try {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "Kamu adalah Aira, AI desa yang ramah. Jawablah menggunakan bahasa Indonesia yang sederhana, sopan, mudah dimengerti, dan tidak terlalu panjang." },
              { role: "user", content: message }
            ]
          })
        });

        const data = await resp.json();
        if (!resp.ok) {
          console.error(`Model ${model} error:`, data);
          continue;
        }
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return res.status(200).json({ reply });
        }
      } catch (err) {
        console.error(`Fetch error model ${model}:`, err);
      }
    }
    return res.status(200).json({ reply: "Maaf, saya belum bisa menjawab sekarang." });
  } catch (err) {
    console.error("ERROR UTAMA:", err);
    return res.status(500).json({ reply: "Server sedang mengalami gangguan." });
  }
}
