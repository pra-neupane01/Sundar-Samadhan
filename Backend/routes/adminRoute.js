const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getAllUsersController,
  toggleUserStatusController,
  getAdminStatsController,
} = require("../controllers/adminController");

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

module.exports = router;
