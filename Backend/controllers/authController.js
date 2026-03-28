const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/emailService");

/**
 * Generates a JWT token for authenticated users
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Handles new citizen registration
 */
const registerController = async (req, res) => {
  try {
    const { fullName, email, password, wardNumber } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, ward_number) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role, ward_number",
      [fullName, email, hashedPassword, wardNumber || null],
    );

    const user = newUser.rows[0];

    res.status(201).json({
      success: true,
      message: "Successfully registered",
      ...user,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles user login and session creation
 */
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

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by admin",
      });
    }

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
      ward_number: user.ward_number,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Initiates password reset flow by sending a tokenized link via email
 */
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists but don't reveal status for security
    const userResult = await pool.query("SELECT id, full_name FROM users WHERE email = $1", [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "If an account exists with that email, a reset link has been sent." 
      });
    }

    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
      [resetToken, expiry, email]
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: "Reset Your Password - Sundar Samadhan",
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="margin-bottom: 32px; text-align: center;">
             <div style="display: inline-block; padding: 12px; background: #0f172a; border-radius: 12px; color: white; font-weight: 800; font-size: 24px; width: 40px; height: 40px; line-height: 40px;">S</div>
          </div>
          <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0 0 16px; text-align: center;">Reset your password</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 32px; text-align: center;">
            Hi ${user.full_name}, we received a request to reset your password. Click the button below to choose a new one.
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: all 0.2s;">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px;">
            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    res.status(200).json({ 
      success: true, 
      message: "If an account exists with that email, a reset link has been sent." 
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Validates reset token without performing password update
 */
const checkResetTokenController = async (req, res) => {
  try {
    const { token } = req.params;
    const userResult = await pool.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    res.status(200).json({ success: true, message: "Token is valid" });
  } catch (error) {
    console.error("CHECK RESET TOKEN ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Finalizes password reset with a new password
 */
const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const userResult = await pool.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2",
      [hashedPassword, token]
    );

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};

module.exports = { 
  registerController, 
  loginController, 
  forgotPasswordController, 
  resetPasswordController,
  checkResetTokenController
};
