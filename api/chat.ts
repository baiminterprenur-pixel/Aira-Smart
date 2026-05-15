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
  // ✅ API KEY OPENROUTER
  // =========================================================

  const apiKey = process.env.OPENROUTER_API_KEY;

  // =========================================================
  // ❌ JIKA API KEY TIDAK ADA
  // =========================================================

  if (!apiKey) {
    return res.status(500).json({
      reply: "Maaf, saya belum bisa menjawab saat ini."
    });
  }

  // =========================================================
  // ✅ UBAH PESAN MENJADI HURUF KECIL
  // =========================================================

  const lowerMsg = message.toLowerCase();

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
  // ✏️ TAMBAHKAN JAWABAN SENDIRI DI SINI
  // =========================================================

  const customResponses = [

    // =====================================================
    // 👋 SAPAAN
    // =====================================================

    {
      keywords: [
        "hai selamat malam",
        "hai selamat pagi",
        "hai selamat siang",
        "hai selamat sore",
        "hai",
        "halo",
        "aira"
      ],

      reply: `
Iya, ada yang bisa saya bantu?
`
    },

    // =====================================================
    // 📄 SURAT
    // =====================================================

    {
      keywords: [
        "aira aku mau buat surat nih",
        "buat surat",
        "mau buat surat"
      ],

      reply: `
Oke, silakan isi datamu di link berikut ya:

https://LINK-SURAT-KAMU-DI-SINI.com
`
    },

    // =====================================================
    // ✏️ TEMPLATE TAMBAHAN
    // =====================================================

    {
      keywords: [
        "ISI KEYWORD DI SINI"
      ],

      reply: `
ISI JAWABAN DI SINI
`
    }

    // =====================================================
    // ✏️ TAMBAH TEMPLATE BARU DI BAWAH SINI
    // =====================================================

  ];

  // =========================================================
  // 🔎 JAWABAN KHUSUS PENGEMBANG
  // =========================================================

  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        "Saya dikembangkan oleh Sabtu Ibrahim, yang akrab disapa Baim, seorang perangkat Desa Mekar Sari, Kecamatan Keluang, dengan semangat menghadirkan inovasi dan kemudahan melalui teknologi. 🚀"
    });
  }

  // =========================================================
  // 🔎 JAWABAN KHUSUS MASUKAN
  // =========================================================

  if (feedbackKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        'Terimakasih atas masukannya. Untuk memberi masukan ke Desa Mekar Sari, silakan klik link berikut:<br><br><a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">📝 Form Masukan Desa Mekar Sari</a>'
    });
  }

  // =========================================================
  // 🔎 JAWABAN KHUSUS BANTUAN
  // =========================================================

  if (bantuanKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        'Kepada Bapak/Ibu yang ingin mengajukan bantuan, silakan klik link berikut:<br><br><a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">📋 Form Pengajuan Bantuan Desa Mekar Sari</a>'
    });
  }

  // =========================================================
  // 🔥 AUTO CUSTOM RESPONSES
  // =========================================================

  for (const item of customResponses) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) {
      return res.status(200).json({
        reply: item.reply
      });
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

          const resp = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
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
                      "Kamu adalah Aira, AI desa yang ramah. Jawablah dengan bahasa sederhana, mudah dimengerti, dan tidak terlalu panjang. Pastikan menggunakan bahasa Indonesia yang baik dan benar."
                  },

                  {
                    role: "user",
                    content: message
                  }
                ]
              })
            }
          );

          const data = await resp.json();

          // =================================================
          // ❌ JIKA MODEL ERROR
          // =================================================

          if (!resp.ok) {
            console.error(`Model ${model} error:`, data?.error?.message);
            return "";
          }

          // =================================================
          // ✅ AMBIL JAWABAN AI
          // =================================================

          return data?.choices?.[0]?.message?.content?.trim() || "";

        } catch (err) {

          console.error(`Fetch error dari model ${model}:`, err);

          return "";
        }
      })
    );

    // =======================================================
    // ✅ GABUNGKAN SEMUA JAWABAN MODEL
    // =======================================================

    const combined = responses.filter(Boolean).join(" ");

    // =======================================================
    // ✅ PECAH PER KALIMAT
    // =======================================================

    const sentences = combined.split(/(?<=[.!?])\s+/);

    // =======================================================
    // ✅ HAPUS KALIMAT DUPLIKAT
    // =======================================================

    const uniqueSentences = [];

    const seenKeys = new Set();

    for (const s of sentences) {

      const key = s
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();

      const mainKey = key
        .split(" ")
        .slice(0, 2)
        .join(" ");

      if (mainKey && !seenKeys.has(mainKey)) {

        seenKeys.add(mainKey);

        uniqueSentences.push(s);
      }
    }

    // =======================================================
    // ✅ FINAL BALASAN
    // =======================================================

    const finalReply =
      uniqueSentences.slice(0, 3).join(" ") ||
      "Maaf, saat ini saya belum bisa menjawab. Silakan coba lagi beberapa saat.";

    return res.status(200).json({
      reply: finalReply
    });

  } catch (err) {

    console.error("ERROR utama:", err);

    return res.status(500).json({
      reply: "Server sedang mengalami gangguan."
    });
  }
}
