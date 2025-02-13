const express = require("express");
const Question = require("../models/Question");
const router = express.Router();

// Endpoint to add a new question
router.post("/add", async (req, res) => {
    console.log("33333333")
  try {
    const { text, choices, correctAnswer } = req.body;

    // Validate input
    if (!text || !choices || !correctAnswer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(choices) || choices.length < 2) {
      return res.status(400).json({ error: "Choices must be an array with at least 2 options" });
    }

    if (!choices.includes(correctAnswer)) {
      return res.status(400).json({ error: "Correct answer must be one of the choices" });
    }

    // Create a new question
    const question = new Question({
      text,
      choices,
      correctAnswer,
    });

    // Save the question to the database
    await question.save();

    // Return the created question
    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;