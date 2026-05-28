import allSurat from "../modules/surat";

// Tambahkan interface untuk intent surat
interface SuratIntent {
  keywords: string[];
  reply: string;
}

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
    {
      keywords: ["buat surat domisili","mau buat surat domisili","surat domisili","domisili","skdu","buat skdu"],
      reply: `
      Oke, silakan isi datamu jika ingin membuat Surat Domisili di link berikut ya :<br><br>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfPTARAcNT7gh4F8I4mFy2S7BL6hkQiFQNx5KhhNTSTDTaM9A/viewform?usp=header" target="_blank" rel="noopener noreferrer">
      📄 Form Surat Domisili
      </a>
      `
    },
    {
      keywords: ["buat surat keterangan usaha","buatkan surat keterangan
