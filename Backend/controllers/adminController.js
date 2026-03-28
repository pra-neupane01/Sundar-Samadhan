const pool = require("../config/db");

/**
 * Fetches data for all users in the system.
 */
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
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

/**
 * Deactivates or reactivates a user account.
 * Prevents self-blocking.
 */
const toggleUserStatusController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (req.user.id === user_id) {
      return res.status(400).json({ success: false, message: "You cannot block your own account" });
    }

    const result = await pool.query(
      `UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, full_name, is_active`,
      [user_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User status updated",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

/**
 * Aggregates high-level system statistics for the Admin Dashboard.
 */
const getAdminStatsController = async (req, res) => {
  try {
    const totalComplaints = await pool.query("SELECT COUNT(*) FROM complaints");
    const resolvedComplaints = await pool.query("SELECT COUNT(*) FROM complaints WHERE status = 'resolved'");
    const activeUsers = await pool.query("SELECT COUNT(*) FROM users WHERE is_active = TRUE");
    const donationSummary = await pool.query("SELECT COUNT(*) as total_donations, SUM(amount) as total_amount FROM donations WHERE status = 'success'");

    const total = parseInt(totalComplaints.rows[0].count);
    const resolved = parseInt(resolvedComplaints.rows[0].count);

    res.status(200).json({
      success: true,
      stats: {
        totalComplaints: total,
        resolvedPercentage: total === 0 ? 0 : ((resolved / total) * 100).toFixed(2),
        activeUsers: parseInt(activeUsers.rows[0].count),
        donationCount: donationSummary.rows[0].total_donations,
        totalDonationAmount: donationSummary.rows[0].total_amount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch statistics" });
  }
};

/**
 * Updates a user's role (e.g., promoting a Citizen to a Municipal officer).
 */
const updateUserRoleController = async (req, res) => {
  try {
    const { user_id, new_role } = req.body;

    if (!user_id || !new_role) {
      return res.status(400).json({ success: false, message: "User ID and new role are required" });
    }

    const allowedRoles = ["citizen", "municipal", "admin"];
    if (!allowedRoles.includes(new_role)) {
      return res.status(400).json({ success: false, message: "Invalid role value" });
    }

    if (req.user.id === user_id) {
      return res.status(400).json({ success: false, message: "You cannot change your own role" });
    }

    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, full_name, email, role`,
      [new_role, user_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to update user role" });
  }
};

module.exports = {
  getAllUsersController,
  toggleUserStatusController,
  getAdminStatsController,
  updateUserRoleController,
};
