export default async function handler(req, res) {
  // =========================================================
  // ✅ HANYA IZINKAN METHOD POST
  // =========================================================
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // =========================================================
  // ✅ AMBIL PESAN USER
  // =========================================================
  const { message } = req.body;

  // =========================================================
  // ✅ API KEY OPENROUTER
  // =========================================================
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ reply: "Maaf, saya belum bisa menjawab saat ini." });
  }

  // =========================================================
  // ✅ UBAH PESAN MENJADI HURUF KECIL
  // =========================================================
  const lowerMsg = (message || "").toLowerCase();

  // =========================================================
  // 🔎 KEYWORDS KHUSUS
  // =========================================================
  const developerKeywords = [
    "siapa pengembang","siapa yang buat kamu","siapa penciptamu","siapa yang bikin kamu",
    "siapa yang ciptakan kamu","siapa yang program kamu","pengembangmu siapa","dibuat oleh siapa","developer kamu"
  ];

  const feedbackKeywords = [
    "beri masukan","memberi masukan","kasih masukan","saran untuk desa",
    "kritik desa","feedback desa","masukan ke desa mekar sari"
  ];

  const bantuanKeywords = [
    "ajukan bantuan","minta bantuan","pengajuan bantuan","bantuan desa",
    "form bantuan","mengajukan bantuan"
  ];

  // =========================================================
  // 🔥 CUSTOM RESPONSES (termasuk sapaan)
  // =========================================================
  const customResponses = [
    // 👋 SAPAAN
    {
      keywords: ["hai selamat malam","hai selamat pagi","hai selamat siang","hai selamat sore","hai","halo","aira"],
      reply: `Iya, ada yang bisa saya bantu?`
    },

    // 📄 SURAT DOMISILI
    {
      keywords: [
        "aira aku mau buat surat domisili nih","buat surat domisili","mau buat surat domisili",
        "surat domisili","domisili","skdu","buat skdu"
      ],
      reply: `
Oke, silakan isi datamu jika ingin buat surat domisili di link berikut ya :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Domisili
</a>
`
    },

    // 📄 SURAT KETERANGAN USAHA
    {
      keywords: [
        "buat surat keterangan usaha","mau buat surat keterangan usaha","surat keterangan usaha",
        "sku","buat sku","mau buat sku","surat usaha"
      ],
      reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Usaha di link berikut ya :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfwKiGjCUQaAbebp0khcr0eKGYHKwNdnmKfYmMaq_6NLE6yfw/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Usaha
</a>
`
    },

    // 📄 SURAT KETERANGAN TIDAK MAMPU
    {
      keywords: [
        "buat surat keterangan tidak mampu","mau buat surat keterangan tidak mampu","surat keterangan tidak mampu",
        "sktm","buat sktm","mau buat sktm","surat tidak mampu","surat keterangan miskin"
      ],
      reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Tidak mampu di link berikut ya :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvH39BgqzMZAU8q9qodU1SXsktu8xgVUvA4LLovsb5Wosg/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Tidak mampu
</a>
`
    }

  ];

  // =========================================================
  // 🔎 JAWABAN KHUSUS
  // =========================================================
  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: "Saya dikembangkan oleh Sabtu Ibrahim, yang akrab disapa Baim, seorang perangkat Desa Mekar Sari, Kecamatan Keluang, dengan semangat menghadirkan inovasi dan kemudahan melalui teknologi. 🚀"
    });
  }

  if (feedbackKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: `
Terimakasih atas masukannya. Silakan isi form berikut:<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Feedback Desa
</a>
`
    });
  }

  if (bantuanKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: `
Silakan isi form bantuan berikut:<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Bantuan Desa
</a>
`
    });
  }

  // =========================================================
  // 🔥 AUTO CUSTOM RESPONSES
  // =========================================================
  for (const item of customResponses) {
    const matched = item.keywords.some((kw) => {
      const words = kw.toLowerCase().split(" ").filter(Boolean);
      if (words.length === 1) return lowerMsg.includes(words[0]);
      const matchedWords = words.filter((word) => lowerMsg.includes(word));
      return matchedWords.length >= Math.ceil(words.length * 0.6);
    });

    if (matched) {
      return res.status(200).json({ reply: item.reply });
    }
  }

  // =========================================================
  // 🤖 DEFAULT AI RESPONSE
  // =========================================================
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
                  content: "Kamu adalah Aira, AI desa yang ramah. Jawablah menggunakan bahasa Indonesia yang sederhana, sopan, mudah dimengerti, dan tidak terlalu panjang."
                },
                { role: "user", content: message }
              ]
            })
          });

          const data = await resp.json();
          if (!resp.ok) {
            console.error(`Model ${model} error:`, data);
            return "";
          }
          return data?.choices?.[0]?.message?.content?.trim() || "";
        } catch (err) {
          console.error(`Fetch error model ${model}:`, err);
          return "";
        }
      })
    );

    const combined = responses.filter(Boolean).join(" ");
    return res.status(200).json({ reply: combined || "Maaf, saya belum bisa menjawab sekarang." });

  } catch (err) {
    console.error("ERROR UTAMA:", err);
    return res.status(500).json({ reply: "Server sedang mengalami gangguan." });
  }
}
