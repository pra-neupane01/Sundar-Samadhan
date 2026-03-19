const pool = require("../config/db");

// GET USER PROFILE
const getUserProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, full_name, email, role, ward_number, sundar_points, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// UPDATE USER PROFILE
const updateUserProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, wardNumber } = req.body;

    const result = await pool.query(
      "UPDATE users SET full_name = $1, ward_number = $2 WHERE id = $3 RETURNING id, full_name, email, role, ward_number, sundar_points",
      [fullName, wardNumber, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

// GET POINTS HISTORY (Success Donations)
const getPointsHistoryController = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT donation_id, amount, created_at, status FROM donations WHERE user_id = $1 AND status = 'success' ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({
      success: true,
      history: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching points history",
    });
  }
};

module.exports = {
  getUserProfileController,
  updateUserProfileController,
  getPointsHistoryController,
};
