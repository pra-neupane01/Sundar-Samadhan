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
const { 
  getAllMunicipalRequests, 
  updateMunicipalRequestStatus 
} = require("../controllers/municipalRequestController");

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

// MUNICIPAL REQUESTS
router.get(
  "/municipal-requests",
  authMiddleware,
  roleMiddleware("admin"),
  getAllMunicipalRequests
);

router.put(
  "/municipal-requests/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateMunicipalRequestStatus
);

module.exports = router;
