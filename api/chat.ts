import allSurat from "../modules/surat";

// Tambahkan interface untuk intent surat
interface SuratIntent {
  keywords: string[];
  reply: string;
}
  // =========================================================
  // ✅ AMBIL PESAN USER
  // =========================================================
  export default async function handler(req, res) {
  // =========================================================
  // ✅ AMBIL PESAN USER
  // =========================================================
  const { message } = req.body;

  // =========================================================
  // ✅ VALIDASI PESAN
  // =========================================================
  if (!message || !message.trim()) {
    return res.status(400).json({
      reply: "Pesan tidak boleh kosong."
    });
  }

  // =========================================================
  // ✅ UBAH KE HURUF KECIL
  // =========================================================
  const lowerMsg = message.toLowerCase();

  // =========================================================
  // ✅ API KEY OPENROUTER
  // =========================================================
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      reply: "Maaf, sistem AI belum dikonfigurasi."
    });
  }

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
Oke, silakan isi datamu jika ingin membuat Surat Domisili di link berikut ya :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Domisili
</a>
`
  },

  // 📄 SURAT KETERANGAN USAHA
  {
    keywords: [
      "buat surat keterangan usaha",
      "buatkan surat keterangan usaha",
      "mau buat surat keterangan usaha",
      "surat keterangan usaha",
      "sku",
      "buat sku",
      "mau buat sku",
      "surat usaha"
    ],

    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Usaha di link berikut ya :<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSfwKiGjCUQaAbebp0khcr0eKGYHKwNdnmKfYmMaq_6NLE6yfw/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Usaha
</a>
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
Oke, silakan isi datamu jika ingin membuat Surat Domisili di link berikut ya :<br><br>
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
      "mau buat sku",
      "surat usaha"
    ],
    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Usaha di link berikut ya :<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSfwKiGjCUQaAbebp0khcr0eKGYHKwNdnmKfYmMaq_6NLE6yfw/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Usaha
</a>
`
  },

  // 📄 SKTM SEKOLAH
  {
    keywords: [
      "sktm sekolah",
      "surat keterangan tidak mampu sekolah",
      "sktm pendidikan",
      "sktm kuliah"
    ],
    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Tidak Mampu di link berikut ya :<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSfZwvH39BgqzMZAU8q9qodU1SXsktu8xgVUvA4LLovsb5Wosg/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form SKTM Sekolah
</a>
`
  },

  // 📄 SKTM UMUM
  {
    keywords: [
      "sktm umum",
      "surat keterangan tidak mampu umum"
    ],
    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Tidak Mampu Umum di link berikut ya :<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSeJp-_Hfej7yC_MP1vwtzcnmpDwFOm-valtb5bs0eI9Hkfs8A/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Tidak Mampu Umum
</a>
`
  },

  // 📄 SURAT KETERANGAN PINDAH
  {
    keywords: [
      "buat surat keterangan pindah",
      "mau buat surat keterangan pindah",
      "surat keterangan pindah",
      "skpk",
      "buat skpk",
      "mau buat skpk",
      "surat pindah"
    ],
    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Pindah di link berikut ya :<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSdemKtISdr-g7JGgcuVGUySyypmA2Njjmg-lT-2eRzMaikDVA/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Pindah
</a>
`
  },

  // 📄 SURAT KETERANGAN PINDAH DATANG
  {
    keywords: [
      "buat surat keterangan pindah datang",
      "mau buat surat keterangan pindah datang",
      "surat keterangan pindah datang",
      "skpd",
      "buat skpd",
      "mau buat skpd",
      "surat pindah datang"
    ],
    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Pindah Datang di link berikut ya :<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSeAjswrbwP-6XZyrXVxJEMZiB7lPXxjGd4ja71M8AbtKfQVHQ/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Pindah Datang
</a>
`
  },

  // 📄 SURAT KETERANGAN BELUM NIKAH
  {
    keywords: [
      "buat surat keterangan belum nikah",
      "mau buat surat keterangan belum nikah",
      "surat keterangan belum nikah",
      "buat surat keterangan belum menikah",
      "mau buat surat keterangan belum menikah",
      "surat keterangan belum menikah",
      "skbn",
      "buat skbn",
      "mau buat skbn",
      "surat belum nikah"
    ],
    reply: `
Oke, silakan isi datamu jika ingin membuat Surat Keterangan Belum Nikah di link berikut ya :<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSfbTBRQr_Pd-o5UjcKcSH3cyeWDFQTKaaWJjQXGuS8oIBLWeg/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Surat Keterangan Belum Nikah
</a>
`
  },

  // 👋 SAPAAN
  {
    keywords: [
      "hai selamat malam",
      "hai selamat pagi",
      "hai selamat siang",
      "hai selamat sore",
      "hai",
      "halo"
    ],
    reply: `Halo 👋 Ada yang bisa saya bantu?`
  }
];

  // =========================================================
  // 🔎 JAWABAN KHUSUS
  // =========================================================

  // 👨💻 Developer
  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply:
        "Saya dikembangkan oleh Sabtu Ibrahim, yang akrab disapa Baim, seorang perangkat Desa Mekar Sari, Kecamatan Keluang, dengan semangat menghadirkan inovasi dan kemudahan melalui teknologi. 🚀"
    });
  }

  // 📝 Feedback
  if (feedbackKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: `
Terimakasih atas masukannya 🙏<br><br>

Silakan isi form berikut ya:<br><br>

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
Silakan isi form bantuan berikut ya:<br><br>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSe4S_TwmGhtrXz4x9o3vuV9hSfqWgyAVGAT0iC_dORMbWr-Ug/viewform?usp=header" target="_blank" rel="noopener noreferrer">
📄 Form Bantuan Desa
</a>
`
    });
  }
// =========================================================
// 📂 AUTO MODULE SURAT
// =========================================================
const suratList: SuratIntent[] = Object.values(allSurat || {}) as SuratIntent[];

for (const intent of suratList) {

  if (!intent?.keywords || !intent?.reply) continue;

  const matched = intent.keywords.some((kw) =>
    lowerMsg.includes(kw.toLowerCase())
  );

  if (matched) {
    return res.status(200).json({
      reply: intent.reply
    });
  }
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
  const models = [
"google/gemma-3-27b-it:free",
"deepseek/deepseek-chat:free",
"mistralai/mistral-7b-instruct:free"
  ];

  // =========================================================
  // 🔥 AI FALLBACK SYSTEM
  // =========================================================
  try {

    for (const model of models) {

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
                    "Kamu adalah Aira, AI desa yang ramah. Jawablah menggunakan bahasa Indonesia yang sederhana, sopan, mudah dimengerti, dan tidak terlalu panjang."
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

        // ❌ Jika model gagal
        if (!resp.ok) {
          console.error(`Model ${model} error:`, data);
          continue;
        }

        // ✅ Ambil jawaban AI
        const reply =
          data?.choices?.[0]?.message?.content?.trim();

        // ✅ Jika ada jawaban → kirim
        if (reply) {
          return res.status(200).json({
            reply
          });
        }

      } catch (err) {

        console.error(`Fetch error model ${model}:`, err);

      }

    }

    // ❌ Semua model gagal
    return res.status(200).json({
      reply: "Maaf, saya belum bisa menjawab sekarang."
    });

  } catch (err) {

    console.error("ERROR UTAMA:", err);

    return res.status(500).json({
      reply: "Server sedang mengalami gangguan."
    });

  }

}
