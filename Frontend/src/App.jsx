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
import ComplaintDetails from "./pages/citizen/ComplaintDetails";
import CitizenAnnouncements from "./pages/citizen/CitizenAnnouncements";
import Donate from "./pages/citizen/Donate";
import CommunityMap from "./pages/citizen/CommunityMap";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";
import MunicipalDashboard from "./pages/municipal/MunicipalDashboard";
import WardComplaints from "./pages/municipal/WardComplaints";
import ManageAnnouncements from "./pages/municipal/ManageAnnouncements";
import Profile from "./pages/user/Profile";
import Notifications from "./pages/user/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MunicipalRequests from "./pages/admin/MunicipalRequests";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminDonations from "./pages/admin/AdminDonations";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Landing from "./pages/public/Landing";

/**
 * Main application component. 
 * Orchestrates navigation, global toast notifications, and protected route access.
 */
const App = () => {
  return (
    <BrowserRouter>
      {/* Toast provider for application-wide notifications */}
      <Toaster position="top-right" />
      
      {/* Shared Navigation Header */}
      <Navbar />

      <Routes>
        {/* --- Public Authentication Flow --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* --- Citizen Role-Based Routes --- */}
        <Route path="/dashboard" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>} />
        <Route path="/citizen/complaint/create" element={<ProtectedRoute><CreateComplaint /></ProtectedRoute>} />
        <Route path="/citizen/complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
        <Route path="/citizen/map" element={<ProtectedRoute><CommunityMap /></ProtectedRoute>} />
        <Route path="/citizen/complaint/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
        <Route path="/citizen/donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />
        <Route path="/citizen/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
        <Route path="/citizen/announcements" element={<ProtectedRoute><CitizenAnnouncements /></ProtectedRoute>} />

        {/* --- Payment Flow Feedback --- */}
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment/cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />

        {/* --- Municipal Officer Role-Based Routes --- */}
        <Route path="/municipal" element={<ProtectedRoute><MunicipalDashboard /></ProtectedRoute>} />
        <Route path="/municipal/complaints" element={<ProtectedRoute><WardComplaints /></ProtectedRoute>} />
        <Route path="/municipal/announcements" element={<ProtectedRoute><ManageAnnouncements /></ProtectedRoute>} />

        {/* --- System Administrator Role-Based Routes --- */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/all-donations" element={<ProtectedRoute role="admin"><AdminDonations /></ProtectedRoute>} />
        <Route path="/admin/municipal-requests" element={<ProtectedRoute role="admin"><MunicipalRequests /></ProtectedRoute>} />

        {/* --- Common Authenticated Routes --- */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* --- Public Informational Pages --- */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Landing />} />

        {/* --- 404/Fallback Redirect --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
