import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/check-reset-token/${token}`);
        if (res.data.success) {
          setTokenValid(true);
        }
      } catch (error) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        setTokenValid(false);
      } finally {
        setCheckingToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { 
        token, 
        newPassword 
      });
      if (res.data.success) {
        toast.success("Password reset successful!");
        setSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid && !submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 text-center border border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Link Expired</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">This password reset link is invalid or has expired. For security reasons, reset links are only valid for 1 hour.</p>
          <Link to="/forgot-password" 
            className="inline-flex items-center justify-center w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            style={{ textDecoration: 'none' }}
          >
            Request New Link
          </Link>
          <div className="mt-6">
            <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-xl mb-4 text-xl font-bold font-sans">
            S
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
          <p className="text-sm text-slate-600">Please enter your new secure password.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pass" className="block text-sm font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                id="pass"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all font-sans"
              />
            </div>

            <div>
              <label htmlFor="confirmPass" className="block text-sm font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPass"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-8 border border-emerald-100 text-sm font-medium">
              Password updated successfully! You can now log in with your new password.
            </div>
            <Link 
              to="/login"
              className="block w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all flex items-center justify-center font-sans text-sm"
              style={{ textDecoration: 'none' }}
            >
              Go to Login
            </Link>
          </div>
        )}

        {!submitted && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="text-sm font-semibold text-slate-900 hover:underline flex items-center justify-center gap-1 font-sans">
               &larr; Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
