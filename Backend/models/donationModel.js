const pool = require("../config/db");

const donationSchema = async () => {
  const query = `
CREATE TABLE IF NOT EXISTS donations (
    donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    transaction_id TEXT UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending','success','failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

`;
  try {
    await pool.query(query);
    console.log("✅ Donations table ensured.");
  } catch (err) {
    console.error("❌ Error creating Donations table:", err);
  }
};

module.exports = { donationSchema };
