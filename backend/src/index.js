const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MONGODB database");
}).catch((err) => {
  console.log("Error occured in connection to db -" + err);
});

app.get("/hello-world", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log("Backend server has started at " + process.env.PORT);
});