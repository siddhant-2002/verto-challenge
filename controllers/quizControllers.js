const Quiz = require("../models/quiz");

const createQuiz = async (req, res) => {
  try {
    const { title } = req.body;
    const quiz = new Quiz({ title });
    await quiz.save();
    res.json({ id: quiz._id, title: quiz.title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllQuizes = async (req, res) => {
  try {
    const quizes = await Quiz.find();
    // console.log(quizes.questions);
    res.json(quizes);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuiz,
  getAllQuizes,
};
