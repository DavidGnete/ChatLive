import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Crear WebSocket apuntando al servidor interno de Next.js
    wsRef.current = new WebSocket("ws://chatlivebackend.onrender.com");

    wsRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    wsRef.current.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    wsRef.current.onclose = () => {
      console.log("Desconectado del WebSocket");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(input);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Chat Next.js</h2>
      <div
        style={{
          color: "#000000ff",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: "5px 0" }}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "5px" }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
