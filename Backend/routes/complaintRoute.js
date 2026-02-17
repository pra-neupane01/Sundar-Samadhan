const {
  registerController,
  loginController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createComplaintController,
  getAllComplaintController,
  getComplaintByWardController,
  getComplaintByUserController,
  updateComplaintStatusController,
  deleteComplaintController,
} = require("../controllers/complaintController");

const router = express.Router();

// CREATE COMPLAINT : POST
router.post(
  "/create-complaint",
  authMiddleware,
  roleMiddleware("citizen"),
  createComplaintController,
);

// // GET ALL COMPLAINTS : GET
router.get(
  "/get-all-complaints",
  authMiddleware,
  roleMiddleware("admin", "municipal"),
  getAllComplaintController,
);

// GET COMPLAINTS BY WARD : GET
router.get(
  "/get-complaints-by-ward/:wardNumber",
  authMiddleware,
  roleMiddleware("admin", "municipal"),
  getComplaintByWardController,
);

// GET COMPLAINTS BY USER(OWN COMPLAINTS): GET
router.get(
  "/my-complaints",
  authMiddleware,
  roleMiddleware,
  getComplaintByUserController,
);

// UPDATE COMPLAINT STATUS : PUT
router.put(
  "/update-status/:id",
  authMiddleware,
  roleMiddleware("municipal"),
  updateComplaintStatusController,
);

console.log("Complaint routes loaded");

// // DELETE COMPLAINT : DELETE
// router.delete(
//   "/delete-complaint",
//   authMiddleware,
//   roleMiddleware,
//   deleteComplaintController,
// );

module.exports = router;
