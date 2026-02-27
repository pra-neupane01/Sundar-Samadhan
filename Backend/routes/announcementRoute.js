const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createAnnouncementController,
  getAnnouncementController,
  getAnnouncementByWardController,
  deleteAnnouncementController,
} = require("../controllers/announcementController");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// CREATE ANNOUNCEMENT : POST
router.post(
  "/create-announcements",
  authMiddleware,
  roleMiddleware("municipal", "admin"),
  upload.single("image"),
  createAnnouncementController,
);

// // GET ALL ANNOUNCEMENTS : GET --PUBLIC
router.get("/get-announcements", getAnnouncementController);

// GET ANNOUNCEMENT BASED ON WARD || GET
router.get(
  "/get-announcements-ward/:wardNumber",
  getAnnouncementByWardController,
);

router.delete(
  "/delete-announcement/:announcementId",
  authMiddleware,
  roleMiddleware("admin", "municipal"),
  deleteAnnouncementController,
);

module.exports = router;
