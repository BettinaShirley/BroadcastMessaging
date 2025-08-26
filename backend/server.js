const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' })); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const index = req.fileIndex || 0;
    const newFilename = `image${index + 1}.jpeg`;
    req.fileIndex = index + 1;
    cb(null, newFilename);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.array('files', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  console.log(`Uploaded ${req.files.length} file(s):`);
  req.files.forEach((file, index) => {
    console.log(`- Saved as image${index + 1}.jpeg (original: ${file.originalname})`);
  });

  res.send('Files uploaded successfully!');
});

app.post('/api/send-broadcast', (req, res) => {
  console.log('Starting whatsapp.js...');
  const child = spawn('node', ['whatsapp.js'], { cwd: __dirname });

  child.stdout.on('data', (data) => {
    console.log(`whatsapp.js: ${data.toString()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`whatsapp.js error: ${data.toString()}`);
  });

  child.on('close', (code) => {
    console.log(`whatsapp.js exited with code ${code}`);
  });

  res.send('WhatsApp broadcast started!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
