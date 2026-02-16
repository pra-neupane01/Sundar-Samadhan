const {
  registerController,
  loginController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

// register : POST
router.post("/register", registerController);

// login : POST
router.post("/login", loginController);

module.exports = router;
