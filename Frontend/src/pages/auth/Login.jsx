import { useContext, useState } from "react";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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
      const data = await loginUser(form);
      login(
        { id: data.id, role: data.role, email: data.email, ward_number: data.ward_number },
        data.token,
      );
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "municipal") navigate("/municipal");
      else navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-logo">
            <span>SS</span>
          </div>
          <h1 className="auth-panel-title">Sundar Samadhan</h1>
          <p className="auth-panel-subtitle">
            Your community's complaint management platform — transparent, accountable, and citizen-first.
          </p>
          <div className="auth-features">
            {["Submit & track complaints", "Real-time status updates", "Earn Sundar Points", "Transparent governance"].map(f => (
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
            <h2>Welcome back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {errorMessage && (
            <div className="auth-error-box">
              <span>⚠</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
              <div className="auth-label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
              {isSubmitting ? (
                <><span className="auth-spinner"></span> Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
