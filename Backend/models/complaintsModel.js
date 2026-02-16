const pool = require("../config/db");

const complaintSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    ward_number INTEGER,
    status VARCHAR(100) DEFAULT pending (CHECK status IN ('pending','processing','resolved')),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaint_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_complaint_user FOREIGN KEY (ward_number) REFERENCES users(ward_number)
);
`;
  try {
    await pool.query(query);
    console.log("✅ Complaints table ensured.");
  } catch (err) {
    console.error("❌ Error creating complaints table:", err);
  }
};

module.exports = { complaintSchema };
