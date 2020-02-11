const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
//import routes
const authRoutes = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();

//conect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log("connected to db!")
);

//middleware
app.use(express.json());
//routes midleware
app.use("/api/user", authRoutes);
app.use("/api/posts", postRoute);
app.listen(5050, () => console.log("servidoor rodando"));
