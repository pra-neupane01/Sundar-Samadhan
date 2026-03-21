import { useState } from "react";
import { registerUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, MapPin, ArrowRight, Eye, EyeOff } from "lucide-react";
import "./Auth.css";
import AboutContent from "../../components/AboutContent";

const WARD_OPTIONS = Array.from({ length: 15 }, (_, i) => String(i + 1));

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", wardNumber: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    if (errorMessage) setErrorMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await registerUser(form);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        {/* Left panel */}
        <div className="auth-panel">
          <div className="auth-panel-content">
            <div className="auth-logo-container">
              <img src="/logo.png" alt="Sundar Samadhan Logo" className="auth-logo-image" />
            </div>
            <h1 className="auth-panel-title">Join Sundar Samadhan</h1>
            <p className="auth-panel-subtitle">
              Become part of a transparent civic platform. Report issues, track progress, and help improve your community.
            </p>
            <div className="auth-features">
              {["Free citizen account", "Report civic issues instantly", "Get real-time updates", "Earn community rewards"].map(f => (
                <div key={f} className="auth-feature-item">
                  <span className="auth-feature-check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-panel-circle c1"></div>
          <div className="auth-panel-circle c2"></div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-box">
            <div className="auth-form-header">
              <h2>Create your account</h2>
              <p>Register to access citizen services</p>
            </div>

            {errorMessage && (
              <div className="auth-error-box">
                <span>⚠</span> {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="fullName">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={17} className="auth-input-icon" />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    placeholder="Your full name"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={17} className="auth-input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="you@example.com"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={17} className="auth-input-icon" />
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={form.password}
                    placeholder="Min. 6 characters"
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="wardNumber">Ward Number</label>
                <div className="auth-input-wrapper">
                  <MapPin size={17} className="auth-input-icon" />
                  <select
                    id="wardNumber"
                    name="wardNumber"
                    value={form.wardNumber}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: "40px" }}
                  >
                    <option value="">Select your ward</option>
                    {WARD_OPTIONS.map(w => (
                      <option key={w} value={w}>Ward {w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                {isSubmitting ? (
                  <><span className="auth-spinner"></span> Creating account…</>
                ) : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable About Content */}
      <div className="auth-about-footer" style={{ background: "#f8fafc", padding: "40px 20px" }}>
        <div className="content-container">
          <AboutContent />
        </div>
      </div>

      <footer style={{ padding: "40px 0", textAlign: "center", borderTop: "1px solid #e2e8f0", color: "#64748b", background: "#f8fafc" }}>
        &copy; 2026 Sundar Samadhan. A Municipality Initiative.
      </footer>
    </>
  );
};

export default Register;
