const pool = require("../config/db");

const announcementSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS announcements (
    announcement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    ward_number INTEGER DEFAULT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_user 
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_announcements_ward 
ON announcements (ward_number);
`;
  try {
    await pool.query(query);
    console.log("✅ Announcements table ensured.");
  } catch (err) {
    console.error("❌ Error creating announcements table:", err);
  }
};

module.exports = { announcementSchema };
