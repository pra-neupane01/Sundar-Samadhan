import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl mb-6 text-2xl font-black shadow-lg shadow-slate-900/20 transform hover:scale-105 transition-transform duration-300">
            S
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Recover access</h2>
          <p className="text-slate-500 text-base leading-relaxed">Enter your email and we'll send you a link to reset your password and get back on track.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-slate-900">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. citizen@sundarsamadhan.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] focus:ring-4 focus:ring-slate-900/10 disabled:opacity-70 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl mb-8 border border-emerald-100/50 flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-semibold mb-1">Success! Reset link sent.</p>
              <p className="text-xs opacity-90 leading-relaxed">Please check <strong>{email}</strong> for instructions.</p>
            </div>
            <p className="text-sm text-slate-500 mb-8 px-4">Didn't see it? Check your spam folder or wait a minute before trying again.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-slate-700 transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
