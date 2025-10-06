const Question = require("../models/question");
const Quiz = require("../models/quiz");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { question, type, options, answerText, quiz } = req.body;

    const newQuestion = new Question({
      question,
      type,
      options,
      answerText, // only for text type
      quiz,
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully", questionId: newQuestion._id });
  } catch (error) {
    res.status(500).json({ message: "Error creating question", error });
  }
};

// Get quiz questions (hide correct answers)
const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quizId })
      .select("-options.isCorrect -answerText")
      .lean();

    const safe = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      type: q.type,
      options: (q.options || []).map((o) => ({
        _id: o._id,
        text: o.text,
      })),
    }));

    res.json(safe);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid quiz ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Submit quiz answers
const submitAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quizId }).lean();
    let score = 0;
    let results = [];

    for (const question of questions) {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );
      if (!userAnswer) continue;

      let isCorrect = false;

      if (question.type === "text") {
        if (
          question.answerText &&
          userAnswer.answer &&
          question.answerText.trim().toLowerCase() ===
            userAnswer.answer.trim().toLowerCase()
        ) {
          isCorrect = true;
        }
      }

      if (question.type === "single") {
        const selected = (question.options || []).find(
          (o) => o._id.toString() === userAnswer.selectedOptionId
        );
        if (selected && selected.isCorrect) isCorrect = true;
      }

      if (question.type === "multiple") {
        const selectedIds = new Set(
          (userAnswer.selectedOptionIds || []).map(String)
        );
        const correctIds = new Set(
          (question.options || [])
            .filter((o) => o.isCorrect)
            .map((o) => o._id.toString())
        );
        const allCorrectChosen = [...correctIds].every((id) =>
          selectedIds.has(id)
        );
        const noWrongChosen = [...selectedIds].every((id) =>
          correctIds.has(id)
        );
        if (allCorrectChosen && noWrongChosen) isCorrect = true;
      }

      if (isCorrect) score++;

      results.push({
        questionId: question._id,
        correct: isCorrect,
      });
    }

    res.json({ score, total: questions.length, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createQuestion, getQuizQuestions, submitAnswers };
