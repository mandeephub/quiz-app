import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

router.get("/teacher", protect, authorize("teacher"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Teacher",
  });
});

router.get("/student", protect, authorize("student"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Student",
  });
});

export default router;