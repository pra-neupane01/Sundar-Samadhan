import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import NotificationBell from "../../components/NotificationBell";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Banknote,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedPercentage: "0",
    activeUsers: 0,
    totalDonationAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  const statCards = [
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <Users size={28} />,
      colorClass: "stat-card-blue",
    },
    {
      title: "Total Complaints",
      value: stats.totalComplaints,
      icon: <ClipboardList size={28} />,
      colorClass: "stat-card-yellow",
    },
    {
      title: "Resolved Rate",
      value: `${stats.resolvedPercentage}%`,
      icon: <CheckCircle size={28} />,
      colorClass: "stat-card-green",
    },
    {
      title: "Total Donations",
      value: `Rs. ${stats.totalDonationAmount}`,
      icon: <Banknote size={28} />,
      colorClass: "stat-card-purple",
    },
  ];

  const actions = [
    {
      title: "Manage Users",
      description: "View all platform users. Block accounts or upgrade roles to municipal officers.",
      icon: <UserCog size={28} />,
      btnText: "User Directory",
      btnClass: "action-btn-blue",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "View Donations",
      description: "Track all successful financial donations across the platform.",
      icon: <Banknote size={28} />,
      btnText: "Donation Ledger",
      btnClass: "action-btn-green",
      onClick: () => navigate("/admin/donations"),
    },
    {
      title: "Platform Health",
      description: "Monitor system settings, application logs, and database backups.",
      icon: <ShieldCheck size={28} />,
      btnText: "System Check",
      btnClass: "action-btn-purple",
      onClick: () => alert("System settings are operational."),
    },
  ];

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span><span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan Admin</span>
        </div>
        <div className="navbar-user-section">
          <NotificationBell />
          <div className="user-welcome">
            <span className="user-welcome-label">Administrator</span>
            <span className="user-welcome-email">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header mb-8">
          <h2 className="dashboard-heading">System Overview</h2>
          <p className="dashboard-subheading">High-level statistics and management controls for the platform.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading statistics...</p>
          </div>
        ) : (
          <div className="stats-grid">
            {statCards.map((item, index) => (
              <div key={index} className={`stat-card ${item.colorClass}`}>
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">{item.title}</p>
                    <h3 className="stat-value">{item.value}</h3>
                  </div>
                  <div className="stat-icon-wrapper">{item.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-divider mt-12">
          <h3 className="section-title">Administrative Actions</h3>
        </div>

        <div className="actions-grid">
          {actions.map((action, index) => (
            <div key={index} className="action-card">
              <div className="action-card-content">
                <div className="action-icon-container">{action.icon}</div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
                <button
                  className={`action-btn ${action.btnClass}`}
                  onClick={action.onClick}
                >
                  {action.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
