const express = require("express");
const router = express.Router();

const { createQuiz, getAllQuizes } = require("../controllers/quizControllers");
const {
  createQuestion,
  getQuizQuestions,
  submitAnswers,
} = require("../controllers/questionControllers");

const { validateQuestion } = require("../middleware/validateQuestion");

router.post("/createquiz", createQuiz);

router.post("/createquestion", validateQuestion, createQuestion);

router.get("/:quizId/questions", getQuizQuestions);

router.post("/:quizId/submit", submitAnswers);

router.get("/getallquizes", getAllQuizes);

module.exports = router;
