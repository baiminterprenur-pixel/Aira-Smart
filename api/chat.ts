export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Pesan tidak boleh kosong." });
  }

  const lowerMsg = message.toLowerCase();
  const cleanMsg = lowerMsg.replace(/[^\w\s]/gi, "").replace(/\s+/g, " ").trim();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ reply: "Maaf, sistem AI belum dikonfigurasi." });
  }

  const developerKeywords = ["siapa pengembang","siapa yang buat kamu","siapa penciptamu","siapa yang bikin kamu","siapa yang ciptakan kamu","siapa yang program kamu","pengembangmu siapa","dibuat oleh siapa","developer kamu"];
  const feedbackKeywords = ["beri masukan","memberi masukan","kasih masukan","saran untuk desa","kritik desa","feedback desa","masukan ke desa mekar sari"];
  const bantuanKeywords = ["ajukan bantuan","minta bantuan","pengajuan bantuan","bantuan desa","form bantuan","mengajukan bantuan"];

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
  Oke, silakan isi datamu jika ingin membuat Surat Domisili.<br><br>

  <a 
    href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" 
    target="_blank"
    style="
      display:inline-block;
      background:#16a34a;
      color:white;
      padding:10px 16px;
      border-radius:8px;
      text-decoration:none;
      font-weight:bold;
    "
  >
    📄 Isi Form Surat Domisili
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
  Oke, silakan isi datamu jika ingin membuat Surat Keterangan Usaha.<br><br>

  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfwKiGjCUQaAbebp0khcr0eKGYHKwNdnmKfYmMaq_6NLE6yfw/viewform?usp=header"
    target="_blank"
    style="
      display:inline-block;
      background:#16a34a;
      color:white;
      padding:10px 16px;
      border-radius:8px;
      text-decoration:none;
      font-weight:bold;
    "
  >
    📄 Isi Form Surat Keterangan Usaha
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
  Oke, silakan isi datamu jika ingin membuat Surat Keterangan Belum Nikah.<br><br>

  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfbTBRQr_Pd-o5UjcKcSH3cyeWDFQTKaaWJjQXGuS8oIBLWeg/viewform?usp=header"
    target="_blank"
    style="
      display:inline-block;
      background:#16a34a;
      color:white;
      padding:10px 16px;
      border-radius:8px;
      text-decoration:none;
      font-weight:bold;
    "
  >
    📄 Isi Form Surat Keterangan Belum Nikah
  </a>
  `
},

  // 📄 SURAT KETERANGAN PINDAH
  {
    keywords: ["buat surat keterangan pindah","mau buat surat keterangan pindah","surat keterangan pindah","skpk","buat skpk","surat pindah"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Keterangan Pindah.<br><br>📄 Form Surat Keterangan Pindah : Masih Kosong`
  },

  // 📄 SURAT KETERANGAN PINDAH DATANG
  {
    keywords: ["buat surat keterangan pindah datang","mau buat surat keterangan pindah datang","surat keterangan pindah datang","skpd","buat skpd","surat pindah datang"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Keterangan Pindah Datang.<br><br>📄 Form Surat Keterangan Pindah Datang : Masih Kosong`
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
  Oke, silakan isi datamu jika ingin membuat SKTM Sekolah.<br><br>

  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header"
    target="_blank"
    style="
      display:inline-block;
      background:#16a34a;
      color:white;
      padding:10px 16px;
      border-radius:8px;
      text-decoration:none;
      font-weight:bold;
    "
  >
    📄 Isi Form SKTM Sekolah
  </a>
  `
},

  // 📄 SKTM UMUM
  {
    keywords: ["sktm umum","surat keterangan tidak mampu umum"],
    reply: `Oke, silakan isi datamu jika ingin membuat SKTM Umum.<br><br>📄 Form SKTM Umum : Masih Kosong`
  },

  // 📄 SURAT KEMATIAN
  {
    keywords: ["surat kematian","akta kematian","orang meninggal"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Keterangan Kematian.<br><br>📄 Form Surat Kematian : Masih Kosong`
  },

  // 📄 SURAT KELAHIRAN
  {
    keywords: ["surat kelahiran","akta lahir","bayi lahir"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Keterangan Kelahiran.<br><br>📄 Form Surat Kelahiran : Masih Kosong`
  },

  // 📄 SURAT AHLI WARIS
  {
    keywords: ["surat ahli waris","ahli waris","warisan"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Ahli Waris.<br><br>📄 Form Surat Ahli Waris : Masih Kosong`
  },

  // 📄 SURAT PENGANTAR KTP
  {
    keywords: ["pengantar ktp","buat ktp","ktp baru","e-ktp"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Pengantar KTP.<br><br>📄 Form Pengantar KTP : Masih Kosong`
  },

  // 📄 SURAT PENGANTAR KK
  {
    keywords: ["pengantar kk","buat kk","kartu keluarga"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Pengantar KK.<br><br>📄 Form Pengantar KK : Masih Kosong`
  },

  // 📄 SURAT PENGANTAR SKCK
  {
    keywords: ["skck","pengantar skck","buat skck"],
    reply: `Oke, silakan isi datamu jika ingin membuat Surat Pengantar SKCK.<br><br>📄 Form Surat Pengantar SKCK : Masih Kosong`
  },

  // 👋 SAPAAN
  {
    keywords: ["hai selamat malam","hai selamat pagi","hai selamat siang","hai selamat sore","hai","halo"],
    reply: `Halo 👋 Ada yang bisa saya bantu?`
  }

];

  // 🔎 JAWABAN KHUSUS
  if (developerKeywords.some((kw) => cleanMsg.includes(kw))) {
    return res.status(200).json({
      reply: "Saya dikembangkan oleh Sabtu Ibrahim, yang akrab disapa Baim, perangkat Desa Mekar Sari 🚀"
    });
  }

  if (feedbackKeywords.some((kw) => cleanMsg.includes(kw))) {
    return res.status(200).json({
      reply: `Terimakasih atas masukannya 🙏<br><br>📄 Form Feedback Desa : Masih Kosong`
    });
  }

  if (bantuanKeywords.some((kw) => cleanMsg.includes(kw))) {
    return res.status(200).json({
      reply: `Silakan isi form bantuan berikut ya:<br><br>📄 Form Bantuan Desa : Masih Kosong`
    });
  }

  // 🔥 AUTO CUSTOM RESPONSES
  for (const item of customResponses) {
    const matched = item.keywords.some((kw) => cleanMsg.includes(kw.toLowerCase()));
    if (matched) {
      return res.status(200).json({ reply: item.reply });
    }
  }

  // 📄 FALLBACK SURAT
  if (cleanMsg.includes("surat") || cleanMsg.includes("sk") || cleanMsg.includes("pengantar")) {
    return res.status(200).json({ reply: "Maaf, jenis surat tersebut belum tersedia di sistem Aira 🙏" });
  }

// 🤖 DEFAULT AI RESPONSE
const models = [

  // 🔥 DeepSeek
  "deepseek/deepseek-chat:free",

  // 🔥 Google Gemma
  "google/gemma-3-27b-it:free",

  // 🔥 Mistral
  "mistralai/mistral-7b-instruct:free",

  // 🔥 Meta Llama
  "meta-llama/llama-3.3-70b-instruct:free",

  // 🔥 Qwen
  "qwen/qwen3-32b:free",

  // 🔥 Microsoft Phi
  "microsoft/phi-3-medium-128k-instruct:free"

];

try {
  for (const model of models) {
    try {

      console.log("Mencoba model:", model);

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
              content:
                "Kamu adalah Aira, AI desa yang ramah. Jawablah dengan bahasa Indonesia sederhana, sopan, mudah dimengerti, dan tidak terlalu panjang."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.error(`Model ${model} error:`, data);
        continue;
      }

      const reply =
        data?.choices?.[0]?.message?.content?.trim();

      if (reply) {
        console.log("Berhasil pakai:", model);
        return res.status(200).json({ reply });
      }

    } catch (err) {
      console.error(`Fetch error model ${model}:`, err);
    }
  }

  return res.status(200).json({
    reply: "Maaf, AI sedang sibuk. Silakan coba lagi 🙏"
  });

} catch (err) {

  console.error("ERROR UTAMA:", err);

  return res.status(500).json({
    reply: "Server sedang mengalami gangguan."
  });

}

}
