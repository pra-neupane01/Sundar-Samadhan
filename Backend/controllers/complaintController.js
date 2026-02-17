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
      ...complaintDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

const getComplaintByWardController = async (req, res) => {
  try {
  } catch (error) {}
};

const getComplaintByUserController = async (req, res) => {
  try {
  } catch (error) {}
};

const updateComplaintStatusController = async (req, res) => {
  try {
  } catch (error) {}
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
