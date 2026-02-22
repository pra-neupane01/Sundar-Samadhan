const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createDonationController,
  verifyPaymentController,
  getDonationByUserController,
  getAllDonationsController,
} = require("../controllers/donationController");

router.post("/create", authMiddleware, createDonationController);
router.post("/verify", verifyPaymentController);
router.get("/my-donations", authMiddleware, getDonationByUserController);

router.get(
  "/all-donations",
  authMiddleware,
  roleMiddleware("admin"),
  getAllDonationsController,
);

module.exports = router;
