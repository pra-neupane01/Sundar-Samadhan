const pool = require("../config/db");

const userSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
full_name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(50) NOT NULL DEFAULT 'Client'
  CHECK (role IN ('Client', 'Admin', 'Vendor', 'Driver')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

  try {
    await pool.query(query);
    console.log("Users table ensured.");
  } catch (err) {
    console.error("Error creating users table:", err);
    throw err;
  }
};

module.exports = { userSchema };
