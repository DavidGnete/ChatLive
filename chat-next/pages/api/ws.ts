import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT)|| 8765;

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) client.send(message.toString());
    });
  });
});

