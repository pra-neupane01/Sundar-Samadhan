import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import NotificationBell from "../../components/NotificationBell";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Settings,
  ListChecks,
  Megaphone,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "./MunicipalDashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const MunicipalDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    resolved: 0,
  });

  const [categoryData, setCategoryData] = useState({});
  const [selectedWard, setSelectedWard] = useState("all"); // Default to 'all' or user?.ward_number

  const fetchWardComplaints = async () => {
    if (!token) return;
    try {
      let endpoint = "/complaints/get-all-complaints";
      if (selectedWard !== "all") {
        endpoint = `/complaints/get-complaints-by-ward/${selectedWard}`;
      }
      
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const complaints = res.data.complaint || [];
        
        let pending = 0;
        let processing = 0;
        let resolved = 0;
        let categories = {};

        complaints.forEach((c) => {
          if (c.status === "pending") pending++;
          else if (c.status === "processing") processing++;
          else if (c.status === "resolved") resolved++;

          const cat = c.category || "General";
          if (!categories[cat]) categories[cat] = 0;
          categories[cat]++;
        });

        setStats({
          total: complaints.length,
          pending,
          processing,
          resolved,
        });

        setCategoryData(categories);
      }
    } catch (error) {
      console.error("Error fetching ward complaints:", error);
    }
  };

  useEffect(() => {
    fetchWardComplaints();
  }, [token, selectedWard]);

  // Real-time Socket Listeners are now handled globablly in SocketContext.
  // Component-specific toast alerts removed to avoid duplicate notifications.
  // Real-time Socket Listeners to refresh stats
  useEffect(() => {
    if (!socket) return;
    
    const handleRefresh = () => {
      fetchWardComplaints();
    };

    socket.on("newWardComplaint", handleRefresh);
    socket.on("statusUpdated", handleRefresh);

    return () => {
      socket.off("newWardComplaint", handleRefresh);
      socket.off("statusUpdated", handleRefresh);
    };
  }, [socket, selectedWard, token]);

  const dashboardStats = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: <ClipboardList size={28} />,
      colorClass: "stat-card-blue",
      onClick: () => navigate("/municipal/complaints"),
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <Clock size={28} />,
      colorClass: "stat-card-yellow",
    },
    {
      title: "In Progress",
      value: stats.processing,
      icon: <Settings size={28} />,
      colorClass: "stat-card-blue",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: <CheckCircle size={28} />,
      colorClass: "stat-card-green",
    },
  ];

  const actions = [
    {
      title: "Manage Complaints",
      description: "View and update the statuses of complaints across all wards or a selected area.",
      icon: <ListChecks size={28} />,
      buttonText: "View Complaints",
      buttonClass: "action-btn-green",
      onClick: () => navigate("/municipal/complaints"),
    },
    {
      title: "Announcements",
      description: "Post and manage announcements for the municipality or specific wards.",
      icon: <Megaphone size={28} />,
      buttonText: "Manage Announcements",
      buttonClass: "action-btn-blue",
      onClick: () => navigate("/municipal/announcements"),
    },
  ];

  const statusChartData = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [
      {
        data: [stats.pending, stats.processing, stats.resolved],
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const catLabels = Object.keys(categoryData);
  const catValues = Object.values(categoryData);

  const categoryChartData = {
    labels: catLabels.length > 0 ? catLabels : ["No Data"],
    datasets: [
      {
        label: "Issues by Category",
        data: catValues.length > 0 ? catValues : [0],
        backgroundColor: "rgba(16, 185, 129, 0.85)",
        hoverBackgroundColor: "rgba(16, 185, 129, 1)",
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        titleFont: { size: 13, family: "Inter, sans-serif" },
        bodyFont: { size: 14, family: "Inter, sans-serif" },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(241, 245, 249, 1)", drawBorder: false },
        border: { display: false },
        ticks: { font: { family: "Inter, sans-serif", size: 11 }, color: "#64748b" },
      },
      x: {
        grid: { display: false, drawBorder: false },
        border: { display: false },
        ticks: { font: { family: "Inter, sans-serif", size: 11 }, color: "#64748b" },
      },
    },
  };

  const pieOptions = {
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { family: "Inter, sans-serif", size: 12 },
          color: "#475569",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        titleFont: { size: 13, family: "Inter, sans-serif" },
        bodyFont: { size: 14, family: "Inter, sans-serif", weight: "bold" },
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
      },
    },
  };

  return (
    <div className="municipal-dashboard">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span>
            <span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan</span>
        </div>

        <div className="navbar-user-section">
          <NotificationBell />
          <div className="user-welcome">
            <span className="user-welcome-label">Municipal Officer</span>
            <span className="user-welcome-email">
              {user?.email || "Officer"}
            </span>
          </div>

          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header mb-8 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="dashboard-heading">
              Municipal Dashboard {selectedWard !== "all" ? `(Ward ${selectedWard})` : "(All Wards)"}
            </h2>
            <p className="dashboard-subheading">
              Overview of complaints and activities in the selected area.
            </p>
          </div>
          <div className="ward-selector" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="wardSelect" style={{ fontWeight: 600, color: '#334155' }}>Select Area:</label>
            <select
              id="wardSelect"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                minWidth: '150px',
              }}
            >
              <option value="all">All Wards</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                <option key={w} value={w}>Ward {w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {dashboardStats.map((item, index) => (
            <div 
              key={index} 
              className={`stat-card ${item.colorClass} ${item.onClick ? "clickable" : ""}`}
              onClick={item.onClick}
            >
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

        {/* Analytics Section */}
        <div className="section-divider">
          <h3 className="section-title">Ward Analytics</h3>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h4>Complaint Status</h4>
            <div className="chart-container pie-container">
              <Doughnut data={statusChartData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-card" style={{ gridColumn: "span 2" }}>
            <h4>Complaints by Category</h4>
            <div className="chart-container">
              <Bar data={categoryChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="section-divider">
          <h3 className="section-title">Quick Actions</h3>
        </div>

        <div className="actions-grid">
          {actions.map((action, index) => (
            <div key={index} className="action-card">
              <div className="action-card-content">
                <div className="action-icon-container">{action.icon}</div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
                <button
                  className={`action-btn ${action.buttonClass}`}
                  onClick={action.onClick}
                >
                  {action.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MunicipalDashboard;
