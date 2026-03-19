const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUserProfileController,
  updateUserProfileController,
  getPointsHistoryController,
} = require("../controllers/userController");

const router = express.Router();

// GET USER PROFILE
router.get("/profile", authMiddleware, getUserProfileController);

// UPDATE USER PROFILE
router.put("/update-profile", authMiddleware, updateUserProfileController);

// GET POINTS HISTORY
router.get("/points-history", authMiddleware, getPointsHistoryController);

module.exports = router;
