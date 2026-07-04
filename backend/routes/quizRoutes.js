import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createQuiz,
  publishQuiz,
  getMyQuizzes,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  authorize("teacher"),
  createQuiz
);

router.put(
  "/publish/:id",
  protect,
  authorize("teacher"),
  publishQuiz
);


router.put(
  "/:id",
  protect,
  authorize("teacher"),
  updateQuiz
);


router.delete(
  "/:id",
  protect,
  authorize("teacher"),
  deleteQuiz
);

router.get(
  "/my",
  protect,
  authorize("teacher"),
  getMyQuizzes
);

export default router;