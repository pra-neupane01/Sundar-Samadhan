const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUserProfileController,
  updateUserProfileController,
  getPointsHistoryController,
  changePasswordController,
} = require("../controllers/userController");
const { 
  submitMunicipalRequest, 
  getMyMunicipalRequest 
} = require("../controllers/municipalRequestController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// GET USER PROFILE
router.get("/profile", authMiddleware, getUserProfileController);

// UPDATE USER PROFILE
router.put("/update-profile", authMiddleware, updateUserProfileController);

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, changePasswordController);

// GET POINTS HISTORY
router.get("/points-history", authMiddleware, getPointsHistoryController);

// APPLY FOR MUNICIPAL
router.post("/apply-municipal", authMiddleware, upload.single("document"), submitMunicipalRequest);
router.get("/my-municipal-request", authMiddleware, getMyMunicipalRequest);

module.exports = router;
