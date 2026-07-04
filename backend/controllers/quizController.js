import Quiz from "../models/Quiz.js";


import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";


export const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      duration,
    } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      duration,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Quiz Created Successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const publishQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Quiz
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check Ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to publish this quiz",
      });
    }

    // Publish Quiz
    quiz.isPublished = true;

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz Published Successfully",
      quiz,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      duration,
    } = req.body;

    // Find Quiz
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check Ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this quiz",
      });
    }

    // Update Fields
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.category = category || quiz.category;
    quiz.duration = duration || quiz.duration;

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz Updated Successfully",
      quiz,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Quiz
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check Ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this quiz",
      });
    }

    // Delete Related Questions
    await Question.deleteMany({
      quiz: id,
    });

    // Delete Related Attempts
    await Attempt.deleteMany({
      quiz: id,
    });

    // Delete Quiz
    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: "Quiz Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};