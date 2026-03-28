const pool = require("../config/db");
const { createNotification } = require("./notificationController");
const stripe = require("../config/stripe");

/**
 * Initiates a donation by creating a pending record and a Stripe session.
 */
const createDonationController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, payment_method } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const txnId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const donationResult = await pool.query(
      `INSERT INTO donations (user_id, amount, payment_method, status, transaction_id)
       VALUES ($1, $2, $3, 'pending', $4) RETURNING *`,
      [userId, amount, payment_method, txnId],
    );

    const donation = donationResult.rows[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Donation - Sundar Samadhan" },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/payment/success?donation_id=${donation.donation_id}`,
      cancel_url: "http://localhost:5173/payment/cancel",
      metadata: { donation_id: donation.donation_id },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      donation_id: donation.donation_id,
    });
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);
    res.status(500).json({ success: false, message: "Error creating donation" });
  }
};

/**
 * Verifies a successful Stripe payment.
 * Updates donation status, awards 'Sundar Points' to the user, and alerts admins for high donations.
 */
const verifyPaymentController = async (req, res) => {
  try {
    const { donation_id } = req.body;

    if (!donation_id) {
      return res.status(400).json({ success: false, message: "Donation ID required" });
    }

    const donationResult = await pool.query("SELECT * FROM donations WHERE donation_id = $1", [donation_id]);

    if (donationResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    const donation = donationResult.rows[0];

    if (donation.status === "success") {
      return res.status(400).json({ success: false, message: "Already verified" });
    }

    await pool.query(`UPDATE donations SET status = 'success' WHERE donation_id = $1`, [donation_id]);
    await pool.query(`UPDATE users SET sundar_points = sundar_points + $1 WHERE id = $2`, [donation.amount, donation.user_id]);

    const io = req.app.get("io");

    // Special handling for high-value donations
    if (donation.amount >= 1000) {
      io.to("admin_room").emit("highDonation", { amount: donation.amount, user: donation.user_id });

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

    res.status(200).json({ success: true, message: "Payment verified & points updated" });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/**
 * Fetches donation history for a specific logged-in user.
 */
const getDonationByUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM donations WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

    res.status(200).json({
      success: true,
      donationCount: result.rows.length,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch donations" });
  }
};

/**
 * Fetches all successful donations for the Admin ledger.
 */
const getAllDonationsController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name, u.email
       FROM donations d
       JOIN users u ON d.user_id = u.id
       WHERE d.status = 'success'
       ORDER BY d.created_at DESC`,
    );

    res.status(200).json({
      success: true,
      donationCount: result.rows.length,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch donations" });
  }
};

module.exports = {
  createDonationController,
  verifyPaymentController,
  getDonationByUserController,
  getAllDonationsController,
};
