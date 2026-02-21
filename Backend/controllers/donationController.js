const pool = require("../config/db");

const createDonationController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, payment_method } = req.body;

    if (!amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "Amount and payment method required",
      });
    }

    const donation = await pool.query(
      `INSERT INTO donations 
       (user_id, amount, payment_method, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [userId, amount, payment_method],
    );

    res.status(201).json({
      success: true,
      message: "Donation initiated",
      donation: donation.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create donation",
    });
  }
};

const getDonationByUserController = async (req, res) => {
  try {
  } catch (error) {}
};

const getAllDonationController = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  createDonationController,
  getDonationByUserController,
  getAllDonationController,
};
