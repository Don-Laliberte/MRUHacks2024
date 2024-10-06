require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const chatgptRouter = require("./routes/chatgpt")
const PORT = process.env.PORT;
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));
app.use(bodyparser.json());
app.use("/api", chatgptRouter)

app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`)
});
