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
// router.get(
//   "/get-all-complaint",
//   authMiddleware,
//   roleMiddleware,
//   getAllComplaintController,
// );

// // GET COMPLAINTS BY WARD : GET
// router.get(
//   "/get-complaint-by-ward",
//   authMiddleware,
//   roleMiddleware,
//   getComplaintByWardController,
// );

// // GET COMPLAINTS BY USER : GET
// router.get(
//   "/get-complaint-by-user",
//   authMiddleware,
//   roleMiddleware,
//   getComplaintByUserController,
// );

// // UPDATE COMPLAINT STATUS : PUT
// router.put(
//   "/update-complaint-status",
//   authMiddleware,
//   roleMiddleware,
//   updateComplaintStatusController,
// );

// // DELETE COMPLAINT : DELETE
// router.delete(
//   "/delete-complaint",
//   authMiddleware,
//   roleMiddleware,
//   deleteComplaintController,
// );

module.exports = router;
