import { useState, useEffect, useRef } from "react";

function Home() {
  const [messages, setMessages] = useState([
    {
      sender: "aira",
      text: "Halo 👋 Aku Aira, asisten digital desa. Ada yang bisa aku bantu?"
    }
  ]);

  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // KIRIM PESAN KE AI
  async function handleSend() {
    if (!input.trim()) return;

    const currentInput = input;

    const userMessage = {
      sender: "user",
      text: currentInput
    };

    // tampilkan pesan user
    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    // kosongkan input
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: currentInput
        })
      });

      const data = await response.json();

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
      const errorMessage = {
        sender: "aira",
        text: "Maaf, server AI sedang error."
      };

      setMessages((prev) => [
        ...prev,
        errorMessage
      ]);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#b30000",
          color: "white",
          padding: "20px"
        }}
      >
        <h1>Aira AI Desa Mekar Sari 🇮🇩</h1>

        <p>
          Asisten Digital Pelayanan Masyarakat Desa Mekar Sari
        </p>
      </div>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          background: "white",
          borderBottom: "1px solid #ddd"
        }}
      >
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

        <button
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          🌸 Refleksi
        </button>

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
      </div>

      {/* CHAT */}
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
              marginBottom: "10px",
              textAlign:
                msg.sender === "user"
                  ? "right"
                  : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "12px",
                borderRadius: "12px",
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
                  "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef}></div>
      </div>

      {/* INPUT */}
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
              handleSend();
            }
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: "12px 20px",
            background: "#b30000",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default Home;
