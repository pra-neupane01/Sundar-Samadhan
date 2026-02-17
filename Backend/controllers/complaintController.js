const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//GENERATE TOKEN
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// CREATE COMPLAINT || CITIZEN
const createComplaintController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
    }
    const userRole = req.user?.role;

    const { title, description, image_url, latitude, longitude, ward_number } =
      req.body;

    // 🔹 Basic field validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const complaint = await pool.query(
      "INSERT INTO complaints (title, description, image_url, latitude, longitude, ward_number, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        title,
        description,
        image_url || null,
        latitude || null,
        longitude || null,
        ward_number || null,
        userId,
      ],
    );

    const complaintDetails = complaint.rows[0];

    res.status(201).json({
      success: true,
      message: "Complaint Successfully Lodged.",
      ...complaintDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to lodge complaint.",
      error,
    });
  }
};

// GET ALL COMPLAINT || ADMIN, MUNICIPAL
const getAllComplaintController = async (req, res) => {
  try {
    const complaint = await pool.query(`SELECT * FROM complaints`);

    const complaintDetails = complaint.rows;

    res.status(200).json({
      success: true,
      message: "Successfully fetched complaints.",
      complaintCount: complaint.rows.length,
      ...complaintDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
      error,
    });
  }
};

// GET COMPLAINT BASED ON WARD || ADMIN, MUNICIPAL (as param)
const getComplaintByWardController = async (req, res) => {
  try {
    const wardNumber = req.params.wardNumber;

    const complaint = await pool.query(
      `SELECT * FROM complaints WHERE ward_number=$1`,
      [wardNumber],
    );

    res.status(200).json({
      success: true,
      message: "Successfully fetched complaint.",
      complaintCount: complaint.rows.length,
      complaint: complaint.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

// GET COMPLAINT BASED ON USER ID || CITIZEN
const getComplaintByUserController = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized user",
      });
    }

    const complaint = await pool.query(
      `SELECT * FROM complaints WHERE created_by=$1`,
      [userId],
    );

    res.status(200).json({
      success: true,
      message: "Successfully fetched complaint.",
      complaintCount: complaint.rows.length,
      complaint: complaint.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

//UPDATE COMPLAINT STATUS|| MUNICIPAL
const updateComplaintStatusController = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;

    // Validate status
    const allowedStatus = ["pending", "processing", "resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await pool.query(
      `UPDATE complaints
       SET status = $1
       WHERE complaint_id = $2
       RETURNING *`,
      [status, complaintId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
    });
  }
};

const deleteComplaintController = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  createComplaintController,
  getAllComplaintController,
  getComplaintByWardController,
  getComplaintByUserController,
  updateComplaintStatusController,
  deleteComplaintController,
};
