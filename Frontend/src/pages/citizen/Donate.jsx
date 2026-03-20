import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { Heart, ShieldCheck, Zap, Coins, CreditCard, ArrowRight } from "lucide-react";
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
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) { toast.error("Please enter a valid amount"); return; }
    setLoading(true);
    try {
      const res = await api.post("/donations/create", { amount: parseFloat(amount), payment_method: "card" }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success && res.data.url) window.location.href = res.data.url;
      else toast.error("Failed to initiate payment session");
    } catch (error) { toast.error(error.response?.data?.message || "Error creating donation"); }
    finally { setLoading(false); }
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="page-shell">
      <div className="content-container">

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 className="page-title">Support Your Community</h1>
          <p className="page-subtitle">Your contributions directly fund local development projects and initiatives.</p>
        </div>

        <div className="donate-layout">
          {/* Main Form */}
          <div className="card donate-card">
            <div className="donate-card-header">
              <div className="donate-heart-icon"><Heart size={22} /></div>
              <h3>Make a Donation</h3>
            </div>

            <form onSubmit={handleDonation}>
              {/* Amount Input */}
              <div className="donate-amount-box">
                <span className="donate-currency">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="any"
                  required
                  className="donate-amount-input"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="donate-quick-grid">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`donate-quick-btn ${parseFloat(amount) === amt ? "active" : ""}`}
                    onClick={() => setAmount(amt.toString())}
                  >${amt}</button>
                ))}
              </div>

              {/* Payment Method */}
              <div className="donate-method-bar">
                <div className="donate-method-icon"><CreditCard size={18} /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.87rem", color: "#1e293b" }}>Secure Card Payment</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Processed via Stripe</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "20px" }} disabled={loading}>
                {loading ? <span className="auth-spinner" style={{ width: "18px", height: "18px" }}></span> : <>Complete Donation <ArrowRight size={18} /></>}
              </button>

              <p className="donate-secure-text">
                <ShieldCheck size={14} /> All payments are securely processed and encrypted.
              </p>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="donate-sidebar">
            <div className="card donate-info-card">
              <div className="donate-info-icon" style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}>
                <Zap size={22} />
              </div>
              <h4>Why Donate?</h4>
              <ul className="donate-benefit-list">
                <li><span className="donate-bullet"></span> Fund local infrastructure repairs</li>
                <li><span className="donate-bullet"></span> Support health and education programs</li>
                <li><span className="donate-bullet"></span> Earn <strong>Sundar Points</strong> for every dollar</li>
              </ul>
            </div>

            <div className="card donate-info-card">
              <div className="donate-info-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
                <Coins size={22} />
              </div>
              <h4>Points System</h4>
              <p style={{ color: "#64748b", fontSize: "0.87rem", lineHeight: 1.6 }}>For every $1 donated, earn 1 Sundar Point. Use points to vote on community priorities and appear on the leaderboard.</p>
              <div className="donate-points-formula">
                <span className="donate-formula-num">$1</span>
                <ArrowRight size={16} style={{ color: "#94a3b8" }} />
                <span className="donate-formula-num">1 Point</span>
              </div>
            </div>

            <div className="donate-trust-bar">
              <ShieldCheck size={18} />
              <span>Secure, Transparent & Impactful</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
