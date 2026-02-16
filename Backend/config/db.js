const { Pool } = require("pg");

const dotenv = require("dotenv");

dotenv.config(); //  load variables from .env

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log(`✅ Database "${process.env.DB_NAME}" connected successfully`);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    console.error("Please check your database configuration in .env file");
  });

// event listeners
pool.on("connect", () => {
  console.log("✅ New database client connected");
});

pool.on("error", (err) => {
  console.error("❌ Database pool error:", err);
});

module.exports = pool; // exported to use in other files

// pg is PostgreSQL client for Node.js.
// Pool is a connection pool.
// dotenv.config() loads .env variables (DB_HOST, DB_USER, etc.).
// Event listeners log DB connection status.
