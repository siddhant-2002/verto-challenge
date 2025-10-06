const mongoose = require("mongoose");
const Quiz = require("../models/quiz");

const validateQuestion = async (req, res, next) => {
  try {
    if (!req?.body) {
      return res.status(400).json({ message: "Request body is required." });
    }

    const { question, type, options, answerText, quiz } = req.body;

    // Question required
    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ message: "Question text is required and must be a non-empty string." });
    }

    // Type required
    if (!type || !["single", "multiple", "text"].includes(type)) {
      return res.status(400).json({ message: "Invalid question type. Must be 'single', 'multiple', or 'text'." });
    }

    // Quiz ID check
    if (!quiz || !mongoose.Types.ObjectId.isValid(quiz)) {
      return res.status(400).json({ message: "Quiz ID is required and must be a valid ObjectId." });
    }
    
    const quizExists = await Quiz.exists({ _id: quiz });
    if (!quizExists) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Choice questions
    if (type === "single" || type === "multiple") {
      if (typeof answerText === "string" && answerText.trim() !== "") {
        return res.status(400).json({ message: "answerText must not be provided for 'single' or 'multiple' questions." });
      }
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: "Choice questions must have at least 2 options." });
      }

      const seenTexts = new Set();
      let correctCount = 0;

      for (let i = 0; i < options.length; i++) {
        const o = options[i];

        if (typeof o !== "object" || !o) {
          return res.status(400).json({ message: `Option at index ${i} must be an object.` });
        }
        if (!o.text || typeof o.text !== "string" || o.text.trim() === "") {
          return res.status(400).json({ message: `Option at index ${i} must have a non-empty text string.` });
        }

        const normalizedText = o.text.trim().toLowerCase();
        if (seenTexts.has(normalizedText)) {
          return res.status(400).json({ message: `Duplicate option text found: '${o.text}'` });
        }
        seenTexts.add(normalizedText);

        if (typeof o.isCorrect !== "boolean") {
          return res.status(400).json({ message: `Option at index ${i} must include an 'isCorrect' boolean.` });
        }

        if (o.isCorrect) correctCount++;
      }

      if (type === "single" && correctCount !== 1) {
        return res.status(400).json({ message: "Single-choice questions must have exactly 1 correct option." });
      }
      if (type === "multiple" && correctCount < 1) {
        return res.status(400).json({ message: "Multiple-choice questions must have at least 1 correct option." });
      }
    }

    // Text questions
    if (type === "text") {
      if (!answerText || typeof answerText !== "string" || answerText.trim() === "") {
        return res.status(400).json({ message: "Text questions must have a non-empty 'answerText'." });
      }
      if (Array.isArray(options) && options.length > 0) {
        return res.status(400).json({ message: "Text questions must not include options." });
      }
    }

    return next();
  } catch (err) {
    console.error("validateQuestion error:", err);
    return res.status(500).json({ message: "Server error validating question." });
  }
};

module.exports = { validateQuestion };
