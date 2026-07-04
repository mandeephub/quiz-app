import express from "express";
import {
  addQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorize("teacher"),
  addQuestion
);

router.get(
  "/quiz/:quizId",
  protect,
  authorize("teacher"),
  getQuestionsByQuiz
);

router.put(
  "/:id",
  protect,
  authorize("teacher"),
  updateQuestion
);


router.delete(
  "/:id",
  protect,
  authorize("teacher"),
  deleteQuestion
);

export default router;