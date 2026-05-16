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
    return res.status(500).json({
      reply: "Maaf, saya belum bisa menjawab saat ini."
    });
  }

  // =========================================================
  // ✅ UBAH PESAN MENJADI HURUF KECIL
  // =========================================================
  const lowerMsg = (message || "").toLowerCase();

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
    {
      keywords: ["hai selamat malam", "hai selamat pagi", "hai selamat siang", "hai selamat sore", "hai", "halo", "aira"],
      reply: `Iya, ada yang bisa saya bantu?`
    },
    {
      keywords: [
        "aira aku mau buat surat domisili nih",
        "buat surat domisili",
        "mau buat surat domisili",
        "bisa bantu buat surat domisili",
        "aku mau bikin surat domisili",
        "cara buat surat domisili",
        "minta buatkan surat domisili",
        "buat surat keterangan domisili",
        "surat domisili dong",
        "mau urus surat domisili",
        "tolong buat surat domisili",
        "saya ingin membuat surat domisili",
        "saya mau buat surat domisili",
        "bantu bikin surat domisili",
        "pengajuan surat domisili",
        "permohonan surat domisili",
        "surat domisili penduduk",
        "buatkan surat domisili saya",
        "mau bikin surat keterangan domisili",
        "aku ingin buat surat domisili",
        "bisa bikin surat domisili ga",
        "mau minta surat domisili",
        "urus domisili",
        "bikin domisili",
        "surat domisili",
        "domisili",
        "buat surat domisili sekarang",
        "aku perlu surat domisili",
        "mau buat surat tempat tinggal",
        "buat surat tempat tinggal",
        "surat keterangan tempat tinggal",
        "mau bikin surat tempat tinggal",
        "izin buat surat domisili",
        "minta surat keterangan tempat tinggal",
        "bantu urus domisili",
        "saya perlu surat domisili",
        "surat domisili warga",
        "buat surat domisili online",
        "pengurusan surat domisili",
        "mau cetak surat domisili",
        "pengajuan domisili",
        "buatkan domisili penduduk",
        "surat domisili pribadi",
        "surat domisili untuk kerja",
        "surat domisili untuk sekolah",
        "surat domisili untuk bank",
        "surat domisili usaha",
        "buat surat domisili usaha",
        "mau bikin surat domisili usaha",
        "surat keterangan domisili usaha",
        "skdu",
        "buat skdu",
        "mau buat skdu"
      ],
      reply: `Oke, silakan isi datamu jika ingin buat surat domisili di link berikut ya :\n\nhttps://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header`
    }
  ];

  // =========================================================
  // 🔎 JAWABAN KHUSUS
  // =========================================================
  if (developerKeywords.some((kw) => lowerMsg.includes(kw))) {
    return res.status(200).json({
      reply: "Saya dikembangkan oleh Sabtu Ibrahim, yang akrab disapa Baim, seorang perangkat Desa Mek
