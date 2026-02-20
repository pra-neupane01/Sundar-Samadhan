const express = require("express");
const {
  createDonationController,
  getDonationByUserController,
  getAllDonationController,
} = require("../controllers/donationController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// DONATE || POST
router.post("/donate", createDonationController);

// FETCH OWN DONATION LIST || GET
router.get("/my-donations", authMiddleware, getDonationByUserController);

// FETCH ALL DONATION LIST || GET (ADMIN)
router.get(
  "/all-donations",
  authMiddleware,
  roleMiddleware("admin"),
  getAllDonationController,
);
