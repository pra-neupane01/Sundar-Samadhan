const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/authController");

const router = express.Router();

// register : POST
router.post("/register", registerController);

// login : POST
router.post("/login", loginController);

// forgot-password : POST
router.post("/forgot-password", forgotPasswordController);

// reset-password : POST
router.post("/reset-password", resetPasswordController);

module.exports = router;
