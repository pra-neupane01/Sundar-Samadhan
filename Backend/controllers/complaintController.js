const pool = require("../config/db");
const { createNotification } = require("./notificationController");

// CREATE COMPLAINT || CITIZEN
const createComplaintController = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
    }

    const { title, description, latitude, longitude, ward_number, category, address } = req.body;

    // 🔹 Basic field validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const complaint = await pool.query(
      `INSERT INTO complaints 
  (title, description, image_url, category, latitude, longitude, ward_number, created_by, address) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
  RETURNING *`,
      [
        title,
        description,
        imagePath,
        category || null,
        latitude || null,
        longitude || null,
        ward_number || null,
        userId,
        address || null,
      ],
    );

    const complaintDetails = complaint.rows[0];

    const io = req.app.get("io");
    // only municipal of that ward gets it.

    console.log(`📢 Emit newWardComplaint to ward_${ward_number}: ${title}`);
    io.to(`ward_${ward_number}`).emit("newWardComplaint", {
      title,
      ward_number,
    });

    // 🔹 Save notification for all municipal officers of this ward
    const municipalUsers = await pool.query(
      "SELECT id FROM users WHERE role = 'municipal' AND (ward_number = $1 OR role = 'admin')",
      [ward_number]
    );
    for (const user of municipalUsers.rows) {
      await createNotification({
        userId: user.id,
        title: "New Ward Complaint",
        message: `New complaint in Ward ${ward_number}: ${title}`,
        type: "newWardComplaint"
      });
    }

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
    const isAll = req.query.limit === 'all';
    
    if (isAll) {
      const complaint = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
      return res.status(200).json({
        success: true,
        message: "Successfully fetched complaints.",
        complaintCount: complaint.rows.length,
        totalComplaints: complaint.rows.length,
        totalPages: 1,
        currentPage: 1,
        complaint: complaint.rows,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*) FROM complaints');
    const totalComplaints = parseInt(countResult.rows[0].count);

    const complaint = await pool.query(
      `SELECT * FROM complaints ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      message: "Successfully fetched complaints.",
      complaintCount: complaint.rows.length,
      totalComplaints,
      totalPages: Math.ceil(totalComplaints / limit),
      currentPage: page,
      complaint: complaint.rows,
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
    const isAll = req.query.limit === 'all';

    if (isAll) {
      const complaint = await pool.query('SELECT * FROM complaints WHERE ward_number=$1 ORDER BY created_at DESC', [wardNumber]);
      return res.status(200).json({
        success: true,
        message: "Successfully fetched complaint.",
        complaintCount: complaint.rows.length,
        totalComplaints: complaint.rows.length,
        totalPages: 1,
        currentPage: 1,
        complaint: complaint.rows,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM complaints WHERE ward_number=$1',
      [wardNumber]
    );
    const totalComplaints = parseInt(countResult.rows[0].count);

    const complaint = await pool.query(
      `SELECT * FROM complaints WHERE ward_number=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [wardNumber, limit, offset],
    );

    res.status(200).json({
      success: true,
      message: "Successfully fetched complaint.",
      complaintCount: complaint.rows.length,
      totalComplaints,
      totalPages: Math.ceil(totalComplaints / limit),
      currentPage: page,
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

    const isAll = req.query.limit === 'all';

    if (isAll) {
      const complaint = await pool.query(
        'SELECT * FROM complaints WHERE created_by=$1 ORDER BY created_at DESC',
        [userId]
      );
      return res.status(200).json({
        success: true,
        message: "Successfully fetched complaints.",
        complaintCount: complaint.rows.length,
        totalComplaints: complaint.rows.length,
        totalPages: 1,
        currentPage: 1,
        complaint: complaint.rows,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM complaints WHERE created_by=$1',
      [userId]
    );
    const totalComplaints = parseInt(countResult.rows[0].count);

    const complaint = await pool.query(
      `SELECT * FROM complaints WHERE created_by=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    res.status(200).json({
      success: true,
      message: "Successfully fetched complaint.",
      complaintCount: complaint.rows.length,
      totalComplaints,
      totalPages: Math.ceil(totalComplaints / limit),
      currentPage: page,
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

    const updatedComplaint = result.rows[0];

    // 🔥 Get io instance
    const io = req.app.get("io");

    // 🔥 Emit notification to complaint creator
    console.log(`🔔 Notifying user ${updatedComplaint.created_by} about status update to ${updatedComplaint.status}`);
    io.to(updatedComplaint.created_by).emit("statusUpdated", {
      complaintId: updatedComplaint.complaint_id,
      status: updatedComplaint.status,
      message: "Your complaint status has been updated",
    });

    // 🔹 Save notification to DB for the citizen
    await createNotification({
      userId: updatedComplaint.created_by,
      title: "Complaint Status Updated",
      message: `Your complaint "${updatedComplaint.title}" status has been updated to ${updatedComplaint.status}.`,
      type: "statusUpdated"
    });

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
    });
  }
};

//DELETE COMPLAINT || ADMIN ONLY
const deleteComplaintController = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const result = await pool.query(
      "DELETE FROM complaints WHERE complaint_id = $1 RETURNING *",
      [complaintId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete complaint",
    });
  }
};

const checkOverdueComplaints = async (io) => {
  try {
    console.log("Running overdue check...");
    const result = await pool.query(
      `SELECT complaint_id, ward_number
   FROM complaints
   WHERE status = 'pending'
   AND created_at < NOW() - INTERVAL '3 days'`,
    );

    console.log("Overdue found:", result.rows);

    result.rows.forEach(async (complaint) => {
      io.to(`ward_${complaint.ward_number}`).emit("overdueComplaint", {
        complaintId: complaint.complaint_id,
        ward_number: complaint.ward_number,
        message: "Complaint pending for more than 3 days",
      });

      // 🔹 Save to DB for municipal officers
      const municipalUsers = await pool.query(
        "SELECT id FROM users WHERE role = 'municipal' AND (ward_number = $1 OR role = 'admin')",
        [complaint.ward_number]
      );
      for (const user of municipalUsers.rows) {
        await createNotification({
          userId: user.id,
          title: "Overdue Complaint",
          message: `Complaint #${complaint.complaint_id} in Ward ${complaint.ward_number} is overdue.`,
          type: "overdueComplaint"
        });
      }
    });
  } catch (error) {
    console.error("Overdue check error:", error);
  }
};

// UPDATE COMPLAINT BY USER || CITIZEN
const updateComplaintByUserController = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;
    const { title, description, category, ward_number, address, latitude, longitude } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // 1. Find complaint
    const findResult = await pool.query(
      "SELECT * FROM complaints WHERE complaint_id = $1",
      [complaintId]
    );

    if (findResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const complaint = findResult.rows[0];

    // 2. Check ownership
    if (complaint.created_by !== userId) {
      return res.status(403).json({ success: false, message: "You can only edit your own complaints" });
    }

    // 3. Check status (Only allow edit if pending)
    if (complaint.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending complaints can be edited" });
    }

    // 4. Update
    const updateResult = await pool.query(
      `UPDATE complaints 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           category = COALESCE($3, category), 
           ward_number = COALESCE($4, ward_number), 
           address = COALESCE($5, address), 
           latitude = COALESCE($6, latitude), 
           longitude = COALESCE($7, longitude),
           image_url = COALESCE($8, image_url)
       WHERE complaint_id = $9
       RETURNING *`,
      [title, description, category, ward_number, address, latitude, longitude, imagePath, complaintId]
    );

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: updateResult.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update complaint" });
  }
};

// DELETE COMPLAINT BY USER || CITIZEN
const deleteComplaintByUserController = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id;

    // 1. Find complaint
    const findResult = await pool.query(
      "SELECT * FROM complaints WHERE complaint_id = $1",
      [complaintId]
    );

    if (findResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const complaint = findResult.rows[0];

    // 2. Check ownership
    if (complaint.created_by !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own complaints" });
    }

    // 3. Check status (Only allow delete if pending)
    if (complaint.status !== "pending") {
      return res.status(400).json({ success: false, message: "Logged complaints cannot be deleted once they are being processed" });
    }

    // 4. Delete
    await pool.query("DELETE FROM complaints WHERE complaint_id = $1", [complaintId]);

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete complaint" });
  }
};

module.exports = {
  createComplaintController,
  getAllComplaintController,
  getComplaintByWardController,
  getComplaintByUserController,
  updateComplaintStatusController,
  deleteComplaintController,
  updateComplaintByUserController,
  deleteComplaintByUserController,
  checkOverdueComplaints,
};
