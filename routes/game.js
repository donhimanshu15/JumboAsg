const express = require("express");
const mongoose = require("mongoose");
const GameSession = require("../models/GameSession");
const Question = require("../models/Question");
const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    // Fetch 4 random questions
    const questions = await Question.aggregate([{ $sample: { size: 4 } }]);

    // Extract question IDs directly (no need to convert to ObjectId again)
    const questionIds = questions.map((q) => q._id);

    // Create a new game session
    const gameSession = new GameSession({
      player1: req.body.player1,
      player2: req.body.player2,
      questions: questionIds, // Use extracted ObjectId array
    });

    // Save the game session
    await gameSession.save();

    // Respond with the created game session
    res.status(201).json({ gameSession });
  } catch (error) {
    console.error("Error starting game session:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;