import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CreateComplaint from "./pages/citizen/CreateComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import MyDonations from "./pages/citizen/MyDonations";
import Donate from "./pages/citizen/Donate";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";
import MunicipalDashboard from "./pages/municipal/MunicipalDashboard";
import WardComplaints from "./pages/municipal/WardComplaints";
import ManageAnnouncements from "./pages/municipal/ManageAnnouncements";

import Profile from "./pages/user/Profile";
import Notifications from "./pages/user/Notifications";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import MunicipalRequests from "./pages/admin/MunicipalRequests";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminDonations from "./pages/admin/AdminDonations";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Landing from "./pages/public/Landing";

const RolePage = ({ title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">Logged in as: {user?.email}</p>
        <p className="mt-1 text-slate-600">Role: {user?.role}</p>

        <button
          onClick={logout}
          className="mt-5 rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Citizen Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* Citizen Complaints */}
        <Route
          path="/citizen/complaint/create"
          element={
            <ProtectedRoute>
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/complaints"
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/donations"
          element={
            <ProtectedRoute>
              <MyDonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/donate"
          element={
            <ProtectedRoute>
              <Donate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/all-donations"
          element={
            <ProtectedRoute role="admin">
              <AdminDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/municipal-requests"
          element={
            <ProtectedRoute role="admin">
              <MunicipalRequests />
            </ProtectedRoute>
          }
        />

        {/* Municipal Dashboard */}
        <Route
          path="/municipal"
          element={
            <ProtectedRoute>
              <MunicipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipal/complaints"
          element={
            <ProtectedRoute>
              <WardComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipal/announcements"
          element={
            <ProtectedRoute>
              <ManageAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/announcements"
          element={
            <ProtectedRoute>
              <ManageAnnouncements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Landing />} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
