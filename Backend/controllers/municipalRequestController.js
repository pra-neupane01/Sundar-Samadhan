const pool = require("../config/db");
const { createNotification } = require("./notificationController");

const submitMunicipalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ward_number } = req.body;
    const documentPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!documentPath) {
      return res.status(400).json({ success: false, message: "Valid document upload is required" });
    }

    if (!ward_number) {
      return res.status(400).json({ success: false, message: "Ward number is required" });
    }

    // Check if a request already exists
    const existing = await pool.query("SELECT * FROM municipal_requests WHERE user_id = $1", [userId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "You already have a pending or processed request" });
    }

    const result = await pool.query(
      "INSERT INTO municipal_requests (user_id, document_url, ward_number) VALUES ($1, $2, $3) RETURNING *",
      [userId, documentPath, ward_number]
    );

    // Notify Admins
    const admins = await pool.query("SELECT id FROM users WHERE role = 'admin'");
    for (const admin of admins.rows) {
      await createNotification({
        userId: admin.id,
        title: "New Municipal Request",
        message: `User ${req.user.email} has applied to be a Municipal Officer for Ward ${ward_number}.`,
        type: "municipalRequest"
      });
    }

    res.status(201).json({ success: true, message: "Request submitted successfully", data: result.rows[0] });
  } catch (error) {
    console.error("SUBMIT MUNICIPAL REQUEST ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllMunicipalRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.full_name, u.email 
      FROM municipal_requests r 
      JOIN users u ON r.user_id = u.id 
      ORDER BY r.created_at DESC
    `);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("GET MUNICIPAL REQUESTS ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateMunicipalRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_message } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const requestResult = await pool.query("SELECT * FROM municipal_requests WHERE id = $1", [id]);
    if (requestResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const request = requestResult.rows[0];

    // Update Request
    await pool.query(
      "UPDATE municipal_requests SET status = $1, admin_message = $2, updated_at = NOW() WHERE id = $3",
      [status, admin_message || null, id]
    );

    if (status === 'approved') {
      // Update User Role and Ward
      await pool.query(
        "UPDATE users SET role = 'municipal', ward_number = $1 WHERE id = $2",
        [request.ward_number, request.user_id]
      );

      // Notify User
      await createNotification({
        userId: request.user_id,
        title: "Role Approved!",
        message: `Congratulations! Your request to be a Municipal Officer for Ward ${request.ward_number} has been approved.`,
        type: "roleApproval"
      });
    } else {
      // Notify User about rejection
      await createNotification({
        userId: request.user_id,
        title: "Request Update",
        message: `Your request to be a Municipal Officer was rejected. ${admin_message ? 'Note: ' + admin_message : ''}`,
        type: "roleRejection"
      });
    }

    res.status(200).json({ success: true, message: `Request ${status} successfully` });
  } catch (error) {
    console.error("UPDATE MUNICIPAL REQUEST ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMyMunicipalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM municipal_requests WHERE user_id = $1", [userId]);
    res.status(200).json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    console.error("GET MY MUNICIPAL REQUEST ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  submitMunicipalRequest,
  getAllMunicipalRequests,
  updateMunicipalRequestStatus,
  getMyMunicipalRequest
};
