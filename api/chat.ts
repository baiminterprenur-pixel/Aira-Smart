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
    "ajukan bantuan","minta bantuan","pengajuan bantuan","bantuan desa","form bantuan","mengajukan bantuan"
  ];

  // =========================================================
  // 🔥 CUSTOM RESPONSES
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
        "buat surat domisili","mau buat surat domisili","bisa bantu buat surat domisili","aku mau bikin surat domisili",
        "cara buat surat domisili","minta buatkan surat domisili","buat surat keterangan domisili","surat domisili dong",
        "mau urus surat domisili","tolong buat surat domisili","saya ingin membuat surat domisili","saya mau buat surat domisili",
        "bantu bikin surat domisili","pengajuan surat domisili","permohonan surat domisili","surat domisili penduduk",
        "buatkan surat domisili saya","mau bikin surat keterangan domisili","aku ingin buat surat domisili","bisa bikin surat domisili ga",
        "mau minta surat domisili","urus domisili","bikin domisili","surat domisili","domisili","buat surat domisili sekarang",
        "aku perlu surat domisili","mau buat surat tempat tinggal","buat surat tempat tinggal","surat keterangan tempat tinggal",
        "mau bikin surat tempat tinggal","izin buat surat domisili","minta surat keterangan tempat tinggal","bantu urus domisili",
        "saya perlu surat domisili","surat domisili warga","buat surat domisili online","pengurusan surat domisili",
        "mau cetak surat domisili","pengajuan domisili","buatkan domisili penduduk","surat domisili pribadi",
        "surat domisili untuk kerja","surat domisili untuk sekolah","surat domisili untuk bank","surat domisili usaha",
        "buat surat domisili usaha","mau bikin surat domisili usaha","surat keterangan domisili usaha","skdu","buat skdu","mau buat skdu"
      ],
      reply: `Oke, silakan isi datamu jika ingin buat surat domisili di link berikut:<br><br><a href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" target="_blank" rel="noopener noreferrer">📄 Form Surat Domisili Desa Mekar Sari</a>`
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
      reply: 'Terimakasih atas masukannya. Untuk memberi masukan ke Desa Mekar Sari, silakan klik link berikut:<br><br><a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">📝 Form Masukan Desa Mekar Sari</a>'
    });
  }

  if (bantuanKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: 'Kepada Bapak/Ibu yang ingin mengajukan bantuan, silakan klik link berikut:<br><br><a href="https://docs.google.com/forms/d/e/1FAIpQLSdlDBHYsLwSpQcHNhCJQXn_NUGGhtvQAP76Lm8HOkCIvIFYpA/viewform?usp=header" target="_blank" rel="noopener noreferrer">📋 Form Pengajuan Bantuan Desa Mekar Sari</a>'
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
    if (matched) return res.status(200).json({ reply: item.reply });
  }

  // =========================================================
  // 🤖 DEFAULT AI RESPONSE
  // =========================================================
  const models = ["poolside/laguna-xs.2:free","inclusionai/ring-2.6-1t:free","google/gemma-4-31b-it:free"];
  try {
    const responses = await Promise.all(models.map(async (model) => {
      try {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "Kamu adalah Aira, AI desa yang ramah. Jawablah dengan bahasa sederhana, mudah dimengerti, dan tidak terlalu panjang. Pastikan menggunakan bahasa Indonesia yang baik dan benar." },
              { role: "user", content: message }
            ]
          })
        });
        const data = await resp.json();
        if (!resp.ok) { console.error(`Model ${model} error:`, data?.error?.message); return ""; }
        return data?.choices?.[0]?.message?.content?.trim() || "";
      } catch (err) {
        console.error(`Fetch error dari model ${model}:`, err);
        return "";
      }
    }));

    const combined = responses.filter(Boolean).join(" ");
    const sentences = combined.split(/(?<=[.!?])\s+/);
    const uniqueSentences = [];
    const seenKeys = new Set();

    for (const s of sentences) {
      const key = s.toLowerCase().replace(/[^\w\s]/g, "").trim();
      const mainKey = key.split(" ").slice(0, 2).join(" ");
      if (mainKey && !seenKeys.has(mainKey)) {
        seenKeys.add(mainKey);
        uniqueSentences.push(s);
      }
    }

    const finalReply = uniqueSentences.slice(0, 3).join(" ") || "Maaf, saat ini saya belum bisa menjawab. Silakan coba lagi beberapa saat.";
    return res.status(200).json({ reply: finalReply });
  } catch (err) {
    console.error("ERROR utama:", err);
    return res.status(500).json({ reply: "Server sedang mengalami gangguan." });
  }
}
