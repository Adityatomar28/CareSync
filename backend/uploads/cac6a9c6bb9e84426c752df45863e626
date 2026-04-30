const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/test', upload.single('file'), (req, res) => {
  console.log("Req Body:", req.body);
  console.log("Req File:", req.file);
  res.json({ body: req.body, file: req.file ? true : false });
});

const server = app.listen(5002, () => {
  console.log('Test server running');
});
