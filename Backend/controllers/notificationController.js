const pool = require("../config/db");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // User must be authenticated

    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("MARK AS READ ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = $1",
      [userId]
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("MARK ALL AS READ ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Internal utility to create notifications
const createNotification = async ({ userId, title, message, type }) => {
  try {
    await pool.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)",
      [userId, title, message, type]
    );
    return true;
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
    return false;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
