const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config({ quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
