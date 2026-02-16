const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//GENERATE TOKEN
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER USER
const registerController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, role",
      [fullName, email, hashedPassword],
    );

    const user = newUser.rows[0];

    res.status(201).json({
      message: "successfully Regitered.",
      ...user,

      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//LOGIN USER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(201).json({
      message: "successfully Logged In.",
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerController, loginController };
