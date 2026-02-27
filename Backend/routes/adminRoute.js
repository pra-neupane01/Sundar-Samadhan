const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getAllUsersController,
  toggleUserStatusController,
  getAdminStatsController,
  updateUserRoleController,
} = require("../controllers/adminController");
const {
  getAllDonationsController,
} = require("../controllers/donationController");

router.get(
  "/all-users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsersController,
);

router.put(
  "/toggle-user-status",
  authMiddleware,
  roleMiddleware("admin"),
  toggleUserStatusController,
);

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminStatsController,
);

router.get(
  "/all-donations",
  authMiddleware,
  roleMiddleware("admin"),
  getAllDonationsController,
);

router.put(
  "/update-role",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserRoleController,
);

module.exports = router;
