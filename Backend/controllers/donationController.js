const pool = require("../config/db");
const { createNotification } = require("./notificationController");
const stripe = require("../config/stripe");

/* ===============================
   CREATE DONATION (Create Stripe Session)
================================== */
const createDonationController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, payment_method } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount required",
      });
    }

    // Generate a unique transaction ID for tracking
    const txnId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1️⃣ Create donation as pending
    const donationResult = await pool.query(
      `INSERT INTO donations 
   (user_id, amount, payment_method, status, transaction_id)
   VALUES ($1, $2, $3, 'pending', $4)
   RETURNING *`,
      [userId, amount, payment_method, txnId],
    );

    const donation = donationResult.rows[0];

    // 2️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation - Sundar Samadhan",
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/payment/success?donation_id=${donation.donation_id}`,
      cancel_url: "http://localhost:5173/payment/cancel",
      metadata: {
        donation_id: donation.donation_id,
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      donation_id: donation.donation_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating donation",
      error: error.message,
    });
  }
};

const verifyPaymentController = async (req, res) => {
  try {
    const { donation_id } = req.body;

    if (!donation_id) {
      return res.status(400).json({
        success: false,
        message: "Donation ID required",
      });
    }

    const donationResult = await pool.query(
      "SELECT * FROM donations WHERE donation_id = $1",
      [donation_id],
    );

    if (donationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const donation = donationResult.rows[0];

    if (donation.status === "success") {
      return res.status(400).json({
        success: false,
        message: "Already verified",
      });
    }

    // ✅ Update donation
    await pool.query(
      `UPDATE donations 
       SET status = 'success'
       WHERE donation_id = $1`,
      [donation_id],
    );

    // ✅ Update points
    await pool.query(
      `UPDATE users
       SET sundar_points = sundar_points + $1
       WHERE id = $2`,
      [donation.amount, donation.user_id],
    );

    // ✅ GET IO PROPERLY
    const io = req.app.get("io");

    // 🔔 Notify admin if high donation
    if (donation.amount >= 1000) {
      console.log(`💰 High donation detected: ${donation.amount}. Notifying admin...`);
      io.to("admin_room").emit("highDonation", {
        amount: donation.amount,
        user: donation.user_id,
      });

      console.log("🔥 highDonation emitted to admin_room");

      // 🔹 Save notification to DB for all admins
      const adminUsers = await pool.query("SELECT id FROM users WHERE role = 'admin'");
      for (const admin of adminUsers.rows) {
        await createNotification({
          userId: admin.id,
          title: "High Donation Received",
          message: `A user donated $${donation.amount}!`,
          type: "highDonation",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified & points updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

/* ===============================
   GET DONATIONS BY LOGGED USER
================================== */
const getDonationByUserController = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM donations WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );

    res.status(200).json({
      success: true,
      donationCount: result.rows.length,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};

// GET ALL DONATIONS (ADMIN ONLY)
const getAllDonationsController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name, u.email
       FROM donations d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.created_at DESC`,
    );

    res.status(200).json({
      success: true,
      donationCount: result.rows.length,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};

module.exports = {
  createDonationController,
  verifyPaymentController,
  getDonationByUserController,
  getAllDonationsController,
};
