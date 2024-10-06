const { Router } = require("express");
const path = require("node:path");
const multer = require('multer');
const gptSender = require('../calenderAssistantService.js');

const route = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads'));  // Dynamically resolve the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

route.post("/gptresponse", upload.single('file'),(req, res) => {
  const filePath = path.resolve(__dirname, `../uploads/${req.file.filename}`);
  console.log(1)
  gptSender(filePath, res, 1); // Pass the dynamic file path to gptSender
})

route.post("/upload", upload.single('file'), (req, res) => {
  const filePath = path.resolve(__dirname, `../uploads/${req.file.filename}`);
  console.log(2)
  gptSender(filePath, res, 2); // Pass the dynamic file path to gptSender
});

module.exports = route;
