export default async function handler(req, res) {

  // =========================================================
  // ✅ HANYA IZINKAN METHOD POST
  // =========================================================
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  // =========================================================
  // ✅ AMBIL PESAN USER
  // =========================================================
  const { message } = req.body;

  // =========================================================
  // ✅ VALIDASI PESAN
  // =========================================================
  if (!message || typeof message !== "string") {
    return res.status(400).json({
      reply: "Pesan tidak valid."
    });
  }

  // =========================================================
  // ✅ API KEY OPENROUTER
  // =========================================================
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      reply: "API Key belum disetting."
    });
  }

  // =========================================================
  // ✅ UBAH PESAN MENJADI HURUF KECIL
  // =========================================================
  const lowerMsg = message.toLowerCase().trim();

  // =========================================================
  // 🔎 KEYWORDS KHUSUS
  // =========================================================
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

  // =========================================================
  // 🔥 CUSTOM RESPONSES
  // =========================================================
  const customResponses = [

    // 👋 SAPAAN
    {
      keywords: [
        "hai",
        "halo",
        "aira",
        "selamat pagi",
        "selamat siang",
        "selamat sore",
        "selamat malam"
      ],

      reply: `
Halo 👋<br><br>
Ada yang bisa saya bantu?
`
    },

    // 📄 SURAT DOMISILI
    {
      keywords: [
        "buat surat domisili",
        "mau buat surat domisili",
        "surat domisili",
        "domisili",
        "skdu",
        "buat skdu"
      ],

      reply: `
Oke, silakan isi data pada link berikut untuk membuat Surat Domisili :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Domisili
</a>
`
    },

    // 📄 SURAT KETERANGAN USAHA
    {
      keywords: [
        "buat surat keterangan usaha",
        "mau buat surat keterangan usaha",
        "surat keterangan usaha",
        "sku",
        "buat sku",
        "surat usaha"
      ],

      reply: `
Oke, silakan isi data pada link berikut untuk membuat Surat Keterangan Usaha :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfwKiGjCUQaAbebp0khcr0eKGYHKwNdnmKfYmMaq_6NLE6yfw/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Usaha
</a>
`
    },

    // 📄 SURAT KETERANGAN TIDAK MAMPU
    {
      keywords: [
        "buat surat keterangan tidak mampu",
        "mau buat surat keterangan tidak mampu",
        "surat keterangan tidak mampu",
        "sktm",
        "buat sktm",
        "surat miskin",
        "surat tidak mampu"
      ],

      reply: `
Oke, silakan isi data pada link berikut untuk membuat Surat Keterangan Tidak Mampu :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvH39BgqzMZAU8q9qodU1SXsktu8xgVUvA4LLovsb5Wosg/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Tidak Mampu
</a>
`
    }

  ];

  // =========================================================
  // 🔎 JAWABAN KHUSUS
  // =========================================================

  // 👨‍💻 Developer
  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {

    return res.status(200).json({
      reply:
        "Saya dikembangkan oleh Sabtu Ibrahim (Baim), perangkat Desa Mekar Sari, Kecamatan Keluang 🚀"
    });

  }

  // 💬 Feedback
  if (feedbackKeywords.some((kw) => lowerMsg.includes(kw))) {

    return res.status(200).json({
      reply: `
Terimakasih atas masukannya 🙏<br><br>

Silakan isi form berikut :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Feedback Desa
</a>
`
    });

  }

  // 🆘 Bantuan
  if (bantuanKeywords.some((kw) => lowerMsg.includes(kw))) {

    return res.status(200).json({
      reply: `
Silakan isi form bantuan berikut :<br><br>

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

    const matched = item.keywords.some((kw) =>
      lowerMsg.includes(kw.toLowerCase())
    );

    if (matched) {
      return res.status(200).json({
        reply: item.reply
      });
    }

  }

  // =========================================================
  // 🤖 DEFAULT AI RESPONSE
  // =========================================================
  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          // ✅ MODEL GRATIS MIRIP CHATGPT
          model: "openai/gpt-oss-20b:free",

          messages: [
            {
              role: "system",
              content: `
Kamu adalah Aira, AI Desa Mekar Sari yang ramah dan membantu masyarakat.

Aturan:
- Gunakan bahasa Indonesia sederhana
- Jawaban singkat dan jelas
- Sopan dan ramah
- Jangan terlalu panjang
- Jika berkaitan dengan surat desa arahkan dengan baik
`
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

    // =========================================================
    // ❌ ERROR RESPONSE API
    // =========================================================
    if (!response.ok) {

      console.error("OPENROUTER ERROR:", data);

      return res.status(500).json({
        reply: "Maaf, AI sedang sibuk. Silakan coba lagi."
      });

    }

    // =========================================================
    // ✅ HASIL AI
    // =========================================================
    const aiReply =
      data?.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({
      reply:
        aiReply ||
        "Maaf, saya belum bisa menjawab saat ini."
    });

  } catch (err) {

    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      reply: "Server sedang mengalami gangguan."
    });

  }

}
