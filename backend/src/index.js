const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const routers = require("./routes/mainRouters");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_DOMAIN, // update when hosting in .env
  credentials: true
}));


//routes
app.use(routers);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MONGODB database");
}).catch((err) => {
  console.log("Error occured in connection to db -" + err);
});


app.listen(process.env.PORT, () => {
  console.log("Backend server has started at " + process.env.PORT);
});