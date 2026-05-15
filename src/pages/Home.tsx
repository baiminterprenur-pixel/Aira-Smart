<div
  style={{
    display: "inline-block",
    padding: "12px",
    borderRadius: "12px",
    background: msg.sender === "user" ? "#b30000" : "white",
    color: msg.sender === "user" ? "white" : "black",
    maxWidth: "80%",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }}
>
  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
</div>
