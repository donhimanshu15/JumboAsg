const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  scores: {
    player1: { type: Number, default: 0 },
    player2: { type: Number, default: 0 },
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameSession", gameSessionSchema);