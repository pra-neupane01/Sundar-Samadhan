import { useContext, useState } from "react";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      console.log("LOGIN RESPONSE:", data);

      login(
        {
          id: data.id,
          role: data.role,
          email: data.email,
          ward_number: data.ward_number,
        },
        data.token,
      );

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "municipal") navigate("/municipal");
      else navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-slate-600 mb-5">
          Log in to continue to your dashboard.
        </p>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-slate-500"
        />
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <Link to="/forgot-password" title="Recover Password" style={{ fontSize: '12px', color: '#475569', textDecoration: 'none', fontWeight: '500' }} className="hover:text-slate-900 hover:underline">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-slate-500"
        />
        {errorMessage && (
          <p className="mb-3 text-sm text-red-600">{errorMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Need an account?{" "}
          <Link to="/register" className="font-medium text-slate-900 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
