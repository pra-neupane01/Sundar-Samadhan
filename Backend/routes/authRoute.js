const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  checkResetTokenController,
} = require("../controllers/authController");

const router = express.Router();

// register : POST
router.post("/register", registerController);

// login : POST
router.post("/login", loginController);

// forgot-password : POST
router.post("/forgot-password", forgotPasswordController);

// check-reset-token : GET
router.get("/check-reset-token/:token", checkResetTokenController);

// reset-password : POST
router.post("/reset-password", resetPasswordController);

module.exports = router;
