const pool = require("../config/db");

const municipalRequestSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS municipal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    document_url TEXT NOT NULL,
    ward_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
  try {
    await pool.query(query);
    console.log("Municipal Requests table ensured.");
  } catch (err) {
    console.error("Error creating municipal requests table:", err);
  }
};

module.exports = { municipalRequestSchema };
