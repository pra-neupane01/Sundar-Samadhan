const pool = require("../config/db");

// CREATE ANNOUNCEMENT || (MUNICIPAL, ADMIN)
const createAnnouncementController = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized.",
      });
    }

    const { title, content, ward_number } = req.body;

    // 🔹 Basic field validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const announcement = await pool.query(
      `INSERT INTO announcements 
  (title, content, image_url, ward_number, created_by) 
  VALUES ($1, $2, $3, $4, $5) 
  RETURNING *`,
      [title, content, imagePath, ward_number || null, userId],
    );

    const announcementDetails = announcement.rows[0];

    res.status(201).json({
      success: true,
      message: "Announcements Successfully Posted.",
      announcementCount: announcement.rows.length,
      ...announcementDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to post announcement.",
      error,
    });
  }
};

// GET ANNOUNCEMENT || (PUBLIC)
const getAnnouncementController = async (req, res) => {
  try {
    const announcement = await pool.query(
      `SELECT * FROM announcements ORDER BY created_at DESC`,
    );
    const announcementDetails = announcement.rows;

    res.status(200).json({
      success: true,
      message: "Announcement fetched successfully.",
      announcements: announcement.rows,
      announcementCount: announcement.rows.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Get Announcement API.",
    });
  }
};

// GET ANNOUNCEMENT BY WARD  || (PUBLIC)
const getAnnouncementByWardController = async (req, res) => {
  try {
    const wardNumber = req.params.wardNumber;

    const announcement = await pool.query(
      `SELECT * FROM announcements 
       WHERE ward_number = $1 OR ward_number IS NULL
       ORDER BY created_at DESC`,
      [wardNumber],
    );

    res.status(200).json({
      success: true,
      message: "Announcements fetched successfully.",
      announcements: announcement.rows,
      announcementCount: announcement.rows.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Get Announcement By Ward API.",
    });
  }
};

// DELETE ANNOUNCEMENT || OWNER OR ADMIN
const deleteAnnouncementController = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userWard = req.user.ward_number;

    const check = await pool.query("SELECT created_by, ward_number FROM announcements WHERE announcement_id = $1", [announcementId]);
    if (check.rows.length === 0) return res.status(404).json({ success: false, message: "Announcement not found" });

    const ann = check.rows[0];
    const isOwner = String(ann.created_by) == String(userId);
    const isWardOfficer = userRole === 'municipal' && String(ann.ward_number) == String(userWard);

    if (userRole !== 'admin' && !isOwner && !isWardOfficer) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this announcement" });
    }

    await pool.query("DELETE FROM announcements WHERE announcement_id = $1", [announcementId]);
    res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete announcement" });
  }
};

// UPDATE ANNOUNCEMENT
const updateAnnouncementController = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const { title, content, ward_number } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userWard = req.user.ward_number;

    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required." });

    const check = await pool.query("SELECT created_by, ward_number FROM announcements WHERE announcement_id = $1", [announcementId]);
    if (check.rows.length === 0) return res.status(404).json({ success: false, message: "Announcement not found" });

    const ann = check.rows[0];
    const isOwner = String(ann.created_by) == String(userId);
    const isWardOfficer = userRole === 'municipal' && String(ann.ward_number) == String(userWard);

    if (userRole !== 'admin' && !isOwner && !isWardOfficer) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this announcement" });
    }

    const result = await pool.query(
      "UPDATE announcements SET title = $1, content = $2, ward_number = $3 WHERE announcement_id = $4 RETURNING *",
      [title, content, ward_number || null, announcementId]
    );

    res.status(200).json({ success: true, message: "Announcement updated successfully", announcement: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update announcement" });
  }
};

module.exports = {
  createAnnouncementController,
  getAnnouncementController,
  getAnnouncementByWardController,
  deleteAnnouncementController,
  updateAnnouncementController,
};
