import { useState } from "react";
import { registerUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";

const WARD_OPTIONS = Array.from({ length: 15 }, (_, index) =>
  String(index + 1),
);

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    wardNumber: "",
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
      await registerUser(form);
      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
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
          Create account
        </h2>
        <p className="text-sm text-slate-600 mb-5">
          Register to access citizen services.
        </p>
        <label
          htmlFor="fullName"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={form.fullName}
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-slate-500"
        />
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
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          required
          minLength={6}
          className="mb-4 w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-slate-500"
        />
        <label
          htmlFor="wardNumber"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Ward Number
        </label>
        <select
          id="wardNumber"
          name="wardNumber"
          value={form.wardNumber}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-slate-500"
        >
          <option value="">Select ward number</option>
          {WARD_OPTIONS.map((ward) => (
            <option key={ward} value={ward}>
              Ward {ward}
            </option>
          ))}
        </select>
        {errorMessage && (
          <p className="mb-3 text-sm text-red-600">{errorMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
