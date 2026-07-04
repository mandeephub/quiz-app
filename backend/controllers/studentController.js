import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";

export const getAvailableQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      isPublished: true,
    }).select("-__v");

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


export const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check quiz exists
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Create Attempt
    const attempt = await Attempt.create({
      student: req.user._id,
      quiz: quizId,
      answers: [],
      score: 0,
      status: "started",
    });

    res.status(201).json({
      success: true,
      message: "Quiz Started Successfully",
      attempt,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuestion = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const questions = await Question.find({
      quiz: attempt.quiz,
    }).sort({ createdAt: 1 });

    const currentQuestionIndex = attempt.answers.length;

    if (currentQuestionIndex >= questions.length) {
      return res.status(200).json({
        success: true,
        finished: true,
        message: "Quiz Completed",
      });
    }

    const question = questions[currentQuestionIndex];

    res.status(200).json({
      success: true,
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: questions.length,
      question: {
        id: question._id,
        question: question.question,
        options: question.options,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const {
      attemptId,
      questionId,
      selectedAnswer,
    } = req.body;

    // Find Attempt
    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    // Check if Quiz Already Completed
    if (attempt.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Quiz already completed",
      });
    }

    // Find Question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if Question Already Answered
    const alreadyAnswered = attempt.answers.find(
      (answer) =>
        answer.question.toString() === questionId
    );

    if (alreadyAnswered) {
      return res.status(400).json({
        success: false,
        message: "Question already answered",
      });
    }

    // Check Answer
    const isCorrect =
      selectedAnswer === question.correctAnswer;

    // Save Answer
    attempt.answers.push({
      question: questionId,
      selectedAnswer,
      isCorrect,
    });

    // Update Score
    if (isCorrect) {
      attempt.score += 1;
    }

    // Count Total Questions
    const totalQuestions = await Question.countDocuments({
      quiz: attempt.quiz,
    });

    // Check if Quiz Finished
    const hasNextQuestion =
      attempt.answers.length < totalQuestions;

    // Complete Quiz
    if (!hasNextQuestion) {
      attempt.status = "completed";
      attempt.completedAt = new Date();
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      score: attempt.score,
      hasNextQuestion,
      status: attempt.status,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Find Attempt
    const attempt = await Attempt.findById(attemptId)
      .populate("quiz", "title totalQuestions");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const totalQuestions = attempt.quiz.totalQuestions;
    const correctAnswers = attempt.score;
    const wrongAnswers = totalQuestions - correctAnswers;

    const percentage =
      totalQuestions > 0
        ? ((correctAnswers / totalQuestions) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      result: {
        quizTitle: attempt.quiz.title,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        score: attempt.score,
        percentage,
        status: attempt.status,
        completedAt: attempt.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};