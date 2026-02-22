const pool = require("../config/db");

const getAllUsersController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at 
       FROM users 
       ORDER BY created_at DESC`,
    );

    res.status(200).json({
      success: true,
      userCount: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

module.exports = { getAllUsersController };
