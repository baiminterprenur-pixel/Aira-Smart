export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { message } = req.body;

  let reply = "Aku belum mengerti.";

  const lower = message.toLowerCase();

  if (lower.includes("halo")) {
    reply = "Halo juga 😊";
  }

  if (lower.includes("malam")) {
    reply = "Selamat malam 🌙 Semoga harimu menyenangkan.";
  }

  if (lower.includes("surat")) {
    reply = "Saya bisa membantu informasi surat desa.";
  }

  res.status(200).json({
    reply
  });
}
