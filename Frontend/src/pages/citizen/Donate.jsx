import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { 
  ArrowLeft, 
  Heart, 
  Info, 
  ShieldCheck, 
  Zap,
  Coins,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Donate.css";

const Donate = () => {
  const { token } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDonation = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/donations/create",
        { amount: parseFloat(amount), payment_method: "card" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to initiate payment session");
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast.error(error.response?.data?.message || "Error creating donation session");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="donate-page-container">
      <header className="donate-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="header-content">
          <h1>Support Your Community</h1>
          <p>Your contributions directly fund local development projects and community initiatives.</p>
        </div>
      </header>

      <main className="donate-main">
        <div className="donate-grid">
          <section className="donate-form-section">
            <div className="glass-card donate-card">
              <div className="card-header">
                <Heart className="heart-icon" size={24} />
                <h2>Make a Donation</h2>
              </div>
              
              <form onSubmit={handleDonation}>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="any"
                    required
                  />
                </div>

                <div className="quick-amounts-grid">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amount-btn ${parseFloat(amount) === amt ? "active" : ""}`}
                      onClick={() => setAmount(amt.toString())}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="payment-method-preview">
                  <div className="method-info">
                    <div className="method-icon-bg">
                      <CreditCard size={18} />
                    </div>
                    <div className="method-text">
                      <span className="label">Payment Method</span>
                      <span className="value">Secure Card Payment via Stripe</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-donation-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="button-loader"></div>
                  ) : (
                    <>
                      <span>Complete Donation</span>
                      <Zap size={18} />
                    </>
                  )}
                </button>

                <p className="donation-note">
                  <ShieldCheck size={14} />
                  Payments are processed securely and encrypted.
                </p>
              </form>
            </div>
          </section>

          <aside className="donate-info-sidebar">
            <div className="info-card impact-card">
              <div className="info-icon-bg">
                <Zap size={24} />
              </div>
              <h3>Why Donate?</h3>
              <ul>
                <li>
                  <div className="bullet"></div>
                  <span>Fund local infrastructure repairs (roads, lights)</span>
                </li>
                <li>
                  <div className="bullet"></div>
                  <span>Support community health and education programs</span>
                </li>
                <li>
                  <div className="bullet"></div>
                  <span>Earn <strong>Sundar Points</strong> for every dollar contributed</span>
                </li>
              </ul>
            </div>

            <div className="info-card points-info-card">
              <div className="info-icon-bg">
                <Coins size={24} />
              </div>
              <h3>Points System</h3>
              <p>For every $1 you donate, you earn 1 Sundar Point. These points can be used to vote on community priorities or get featured in the community leaderboard.</p>
              <div className="points-formula">
                <span className="math">$1</span>
                <ArrowLeft size={16} className="arrow-right" />
                <span className="math">1 Point</span>
              </div>
            </div>

            <div className="security-guarantee">
              <ShieldCheck size={20} />
              <span>Secure, Transparent & Impactful</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Donate;
