const pool = require("../config/db");

const userSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'citizen',
    ward_number INTEGER,
    sundar_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     is_active BOOLEAN DEFAULT TRUE
);
`;
  try {
    await pool.query(query);
    console.log("Users table ensured.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

module.exports = { userSchema };
