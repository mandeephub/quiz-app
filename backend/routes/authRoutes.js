import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// router.post("/register", (req, res) => {
//   res.json({
//     success: true,
//     message: "Register Route Working",
//   });
// });

// router.post("/login", (req, res) => {
//   res.json({
//     success: true,
//     message: "Login Route Working",
//   });
// });


router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;