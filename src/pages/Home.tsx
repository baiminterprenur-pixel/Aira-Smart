function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          background: "#b30000",
          color: "white",
          padding: "20px",
          borderRadius: "16px"
        }}
      >
        <h1>Aira AI Desa 🇮🇩</h1>
        <p>Asisten Digital Pelayanan Masyarakat</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }}>💬 Chat Aira</button>

        <button style={{ marginRight: "10px" }}>🏆 Kuis</button>

        <button style={{ marginRight: "10px" }}>🌸 Refleksi</button>

        <button>📅 Langkahku</button>
      </div>
    </div>
  );
}

export default Home;
