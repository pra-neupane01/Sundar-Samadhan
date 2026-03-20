const pool = require("../config/db");

const notificationSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
  try {
    await pool.query(query);
    console.log("Notifications table ensured.");
  } catch (err) {
    console.error("Error creating notifications table:", err);
  }
};

module.exports = { notificationSchema };
