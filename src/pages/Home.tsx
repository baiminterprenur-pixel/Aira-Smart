import { useState, useEffect, useRef } from "react";

function Home() {

  // =========================================================
  // 🌸 MODE REFLEKSI
  // =========================================================
  const REFLEKSI_PROMPT = `
Kamu adalah Aira Refleksi.

Kamu adalah teman ngobrol yang hangat, santai, nyaman, dan penuh perhatian.

Bantu pengguna merasa lebih tenang dan didengar lewat obrolan ringan.

Gunakan bahasa Indonesia sederhana dan natural seperti teman dekat.

Jangan formal.
Jangan menghakimi.
Jangan terlalu panjang.
`;

  // =========================================================
  // 💬 PESAN DEFAULT
  // =========================================================
  const defaultMessage = [
    {
      sender: "aira",
      text: `
Halo 👋 Aku Aira, asisten digital Desa Mekar Sari.<br><br>

Aku siap membantu:
<br>• Pelayanan desa
<br>• Informasi surat
<br>• Refleksi & teman ngobrol
<br>• Pendampingan ringan masyarakat
`
    }
  ];

  // =========================================================
  // 💾 AMBIL CHAT DARI LOCAL STORAGE
  // =========================================================
  const [messages, setMessages] = useState(() => {

    if (typeof window !== "undefined") {

      const saved = localStorage.getItem("messages");

      return saved
        ? JSON.parse(saved)
        : defaultMessage;
    }

    return defaultMessage;

  });

  // =========================================================
  // 📝 INPUT USER
  // =========================================================
  const [input, setInput] = useState("");

  // =========================================================
  // ⏳ LOADING
  // =========================================================
  const [loading, setLoading] = useState(false);

  // =========================================================
  // 📌 AUTO SCROLL
  // =========================================================
  const messagesEndRef = useRef(null);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  // =========================================================
  // 💾 SIMPAN CHAT
  // =========================================================
  useEffect(() => {

    if (typeof window !== "undefined") {

      localStorage.setItem(
        "messages",
        JSON.stringify(messages)
      );

    }

  }, [messages]);

  // =========================================================
  // 🗑️ HAPUS CHAT
  // =========================================================
  function clearChat() {

    setMessages(defaultMessage);

    localStorage.removeItem("messages");
  }

  // =========================================================
  // 📤 KIRIM PESAN KE AI
  // =========================================================
  async function sendToAI(customMessage = null) {

    const finalMessage =
      customMessage || input;

    if (!finalMessage.trim() || loading) return;

    // =========================================================
    // 👤 USER MESSAGE
    // =========================================================
    if (!customMessage) {

      const userMessage = {
        sender: "user",
        text: finalMessage
      };

      setMessages((prev) => [
        ...prev,
        userMessage
      ]);

    }

    setInput("");

    setLoading(true);

    try {

      // =========================================================
      // 🤖 REQUEST API
      // =========================================================
      const response = await fetch("/api/chat", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: finalMessage
        })

      });

      const data = await response.json();

      // =========================================================
      // 🤖 BALASAN AI
      // =========================================================
      const airaMessage = {

        sender: "aira",

        text:
          data.reply ||
          "Maaf, belum ada balasan dari AI."

      };

      setMessages((prev) => [
        ...prev,
        airaMessage
      ]);

    } catch (error) {

      console.error(error);

      const errorMessage = {

        sender: "aira",

        text:
          "Maaf, server AI sedang mengalami gangguan."

      };

      setMessages((prev) => [
        ...prev,
        errorMessage
      ]);

    } finally {

      setLoading(false);

    }

  }

  // =========================================================
  // 🌸 MENU REFLEKSI
  // =========================================================
  async function handleRefleksi() {

    const userMessage = {

      sender: "user",

      text: "🌸 Saya ingin refleksi diri"

    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    await sendToAI(REFLEKSI_PROMPT);

  }

  // =========================================================
  // 🎨 UI
  // =========================================================
  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* =========================================================
          🔴 HEADER
      ========================================================= */}

      <div
        style={{
          background: "#b30000",
          color: "white",
          padding: "14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}
      >

        {/* 👨‍💼 ICON */}

        <div
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            flexShrink: 0
          }}
        >
          👨‍💼
        </div>

        {/* 📝 TITLE */}

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "22px"
            }}
          >
            Aira AI Desa Mekar Sari
          </h1>

          <p
            style={{
              margin: "4px 0 0 0",
              opacity: 0.9,
              fontSize: "14px"
            }}
          >
            Pelayanan & Pendampingan Digital Desa
          </p>

        </div>

      </div>

      {/* =========================================================
          📌 MENU
      ========================================================= */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          background: "white",
          borderBottom: "1px solid #ddd",
          flexWrap: "wrap"
        }}
      >

        {/* 🏆 KUIS */}

        <button
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          🏆 Kuis
        </button>

        {/* 🌸 REFLEKSI */}

        <button

          onClick={handleRefleksi}

          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#ffe4ec",
            color: "#b30059",
            fontWeight: "bold"
          }}
        >
          🌸 Refleksi
        </button>

        {/* 📅 LANGKAHKU */}

        <button
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          📅 Langkahku
        </button>

        {/* 🗑️ HAPUS CHAT */}

        <button
          onClick={clearChat}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#ff4444",
            color: "white"
          }}
        >
          🗑️ Hapus Chat
        </button>

      </div>

      {/* =========================================================
          💬 CHAT AREA
      ========================================================= */}

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto"
        }}
      >

        {messages.map((msg, index) => (

          <div
            key={index}
            style={{
              marginBottom: "12px",
              display: "flex",

              justifyContent:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start"
            }}
          >

            {/* 👨‍💼 ICON AIRA */}

            {msg.sender === "aira" && (

              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#b30000",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "8px",
                  flexShrink: 0,
                  fontSize: "18px"
                }}
              >
                👨‍💼
              </div>

            )}

            {/* 💬 BUBBLE */}

            <div
              style={{
                display: "inline-block",
                padding: "12px",
                borderRadius: "14px",

                background:
                  msg.sender === "user"
                    ? "#b30000"
                    : "white",

                color:
                  msg.sender === "user"
                    ? "white"
                    : "black",

                maxWidth: "80%",

                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",

                lineHeight: "1.5"
              }}
            >

              <div
                dangerouslySetInnerHTML={{
                  __html: msg.text
                }}
              />

            </div>

          </div>
        ))}

        {/* ⏳ LOADING */}

        {loading && (

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px"
            }}
          >

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#b30000",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              👨‍💼
            </div>

            <div
              style={{
                background: "white",
                padding: "12px",
                borderRadius: "12px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              Aira sedang mengetik...
            </div>

          </div>

        )}

        <div ref={messagesEndRef}></div>

      </div>

      {/* =========================================================
          ✍️ INPUT AREA
      ========================================================= */}

      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "white",
          gap: "10px",
          borderTop: "1px solid #ddd"
        }}
      >

        <input
          type="text"

          placeholder="Tulis pesan..."

          value={input}

          onChange={(e) =>
            setInput(e.target.value)
          }

          onKeyDown={(e) => {

            if (e.key === "Enter") {

              sendToAI();

            }

          }}

          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px"
          }}
        />

        <button
          onClick={() => sendToAI()}

          disabled={loading}

          style={{
            padding: "12px 20px",
            background: "#b30000",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "..." : "Kirim"}
        </button>

      </div>

    </div>
  );
}

export default Home;
