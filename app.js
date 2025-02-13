const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");
const questionRoutes = require("./routes/question");

dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 


// Routes
app.use("/", authRoutes); 
app.use("/game", gameRoutes); 
app.use("/question", questionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;