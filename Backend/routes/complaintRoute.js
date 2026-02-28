const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  checkOverdueComplaints,
} = require("../controllers/complaintController");

const {
  createComplaintController,
  getAllComplaintController,
  getComplaintByWardController,
  getComplaintByUserController,
  updateComplaintStatusController,
  deleteComplaintController,
} = require("../controllers/complaintController");
const { route } = require("./testRoute");

const router = express.Router();

// CREATE COMPLAINT : POST
router.post(
  "/create-complaint",
  authMiddleware,
  roleMiddleware("citizen"),
  upload.single("image"),
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

// DELETE COMPLAINT : DELETE BY ADMIN
router.delete(
  "/delete-complaint/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteComplaintController,
);

// 🔥 Force Overdue Check (for testing)
router.get("/force-overdue", (req, res) => {
  const io = req.app.get("io");
  checkOverdueComplaints(io);
  res.status(200).json({
    success: true,
    message: "Overdue check triggered",
  });
});

module.exports = router;
