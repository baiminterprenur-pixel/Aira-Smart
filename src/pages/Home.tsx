import { useState, useEffect, useRef } from “react”;

function Home() {
  const [messages, setMessages] = useState([
    {
      sender: "aira",
      text: "Halo 👋 Aku Aira, asisten digital desa. Ada yang bisa aku bantu?"
    }
  ]);

  const [input, setInput] = useState(““);
 const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function handleSend() {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    let reply = "Maaf, aku belum mengerti.";

    const lower = input.toLowerCase();

    if (lower.includes("halo")) {
      reply = "Halo juga 😊";
    }

    if (lower.includes("surat")) {
      reply = "Saya bisa membantu informasi surat desa.";
    }

    if (lower.includes("bantuan")) {
      reply = "Silakan tanyakan bantuan desa yang ingin diketahui.";
    }

    const airaMessage = {
      sender: "aira",
      text: reply
    };

    setMessages((prev) => [...prev, userMessage, airaMessage]);

    setInput("");
  }

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#b30000",
          color: "white",
          padding: "20px"
        }}
      >
        <h1>Aira AI Desa 🇮🇩</h1>
        <p>Asisten Digital Pelayanan Masyarakat</p>
      </div>

      {/* Menu */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          background: "white"
        }}
      >
        <button>🏆 Kuis</button>

        <button>🌸 Refleksi</button>

        <button>📅 Langkahku</button>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto"
        }}
      >
        {messages.map((msg, index) => (
          <div ref={messagesEndRef}></div>
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.sender === "user" ? "right" : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                background:
                  msg.sender === "user" ? "#b30000" : "white",
                color:
                  msg.sender === "user" ? "white" : "black",
                maxWidth: "80%"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "white",
          gap: "10px"
        }}
      >
        <input
          type="text"
          placeholder="Tulis pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          style={{
            flex: 1,
            padding: "10px"
          }}
        />

        <button onClick={handleSend}>
          Kirim
        </button>
      </div>
    </div>
  );
}

export default Home;
