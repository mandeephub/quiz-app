import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";

export const addQuestion = async (req, res) => {
  try {
    const {
      quizId,
      question,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    // Validation
    if (
      !quizId ||
      !question ||
      !options ||
      correctAnswer === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    // Check Quiz Exists
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Create Question
    const newQuestion = await Question.create({
      quiz: quizId,
      question,
      options,
      correctAnswer,
      explanation,
    });

    // Increase Question Count
    quiz.totalQuestions += 1;
    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Question Added Successfully",
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const questions = await Question.find({ quiz: quizId });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      question,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    // Find Question
    const existingQuestion = await Question.findById(id);

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }




  
    // Find Quiz
    const quiz = await Quiz.findById(existingQuestion.quiz);

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
        message: "You are not authorized to update this question",
      });
    }



    // Update Fields
    existingQuestion.question =
      question || existingQuestion.question;

    existingQuestion.options =
      options || existingQuestion.options;

    existingQuestion.correctAnswer =
      correctAnswer ?? existingQuestion.correctAnswer;

    existingQuestion.explanation =
      explanation || existingQuestion.explanation;

    await existingQuestion.save();

    res.status(200).json({
      success: true,
      message: "Question Updated Successfully",
      question: existingQuestion,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Question
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Find Quiz
    const quiz = await Quiz.findById(question.quiz);

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
        message: "You are not authorized to delete this question",
      });
    }

    // Delete Question
    await question.deleteOne();

    // Update Quiz Question Count
   quiz.totalQuestions = Math.max(0, quiz.totalQuestions - 1);

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Question Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};