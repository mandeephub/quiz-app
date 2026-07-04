import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  getAvailableQuizzes,
  startQuiz,
  getQuestion,
  submitAnswer,
  getQuizResult,
} from "../controllers/studentController.js";

const router = express.Router();

router.get(
  "/quizzes",
  protect,
  authorize("student"),
  getAvailableQuizzes
);

router.post(
  "/start/:quizId",
  protect,
  authorize("student"),
  startQuiz
);

router.get(
  "/question/:attemptId",
  protect,
  authorize("student"),
  getQuestion
);


router.post(
  "/submit",
  protect,
  authorize("student"),
  submitAnswer
);

router.get(
  "/result/:attemptId",
  protect,
  authorize("student"),
  getQuizResult
);


export default router;