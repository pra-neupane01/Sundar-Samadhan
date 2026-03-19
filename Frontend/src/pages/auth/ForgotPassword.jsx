import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";
import "./Login.css"; // Reuse login styles for consistency

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        toast.success("Reset link sent!");
        setSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span>S</span>
            <span>S</span>
          </div>
          <h2>Forgot Password?</h2>
          <p>Enter your email to receive a password reset link.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : (
                <>
                  <Send size={18} style={{ marginRight: '8px' }} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-message" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              Check your email! We've sent a password reset link to <strong>{email}</strong>.
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Didn't receive the email? Check your spam folder or try again.</p>
          </div>
        )}

        <div className="login-footer">
          <Link to="/login" className="forgot-password" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
