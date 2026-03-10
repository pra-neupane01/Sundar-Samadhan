import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  HeartHandshake,
  Star,
  Megaphone,
  PenLine,
  ListChecks,
  Coins,
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
import { Doughnut, Line, Bar } from "react-chartjs-2";
import "./CitizenDashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
);

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const stats = [
    {
      title: "My Complaints",
      value: 5,
      icon: <ClipboardList size={28} />,
      colorClass: "stat-card-blue",
    },
    {
      title: "My Donations",
      value: 3,
      icon: <HeartHandshake size={28} />,
      colorClass: "stat-card-green",
    },
    {
      title: "Sundar Points",
      value: 120,
      icon: <Star size={28} />,
      colorClass: "stat-card-yellow",
    },
    {
      title: "Announcements",
      value: 4,
      icon: <Megaphone size={28} />,
      colorClass: "stat-card-purple",
    },
  ];

  const actions = [
    {
      title: "Create Complaint",
      description:
        "Report issues in your ward and help improve your community.",
      icon: <PenLine size={28} />,
      buttonText: "Create Now",
      buttonClass: "action-btn-blue",
      onClick: () => navigate("/citizen/complaint/create"),
    },
    {
      title: "View Complaints",
      description:
        "Track and monitor all your submitted complaints in one place.",
      icon: <ListChecks size={28} />,
      buttonText: "View All",
      buttonClass: "action-btn-green",
    },
    {
      title: "Make a Donation",
      description: "Support community development projects and earn points.",
      icon: <Coins size={28} />,
      buttonText: "Donate Now",
      buttonClass: "action-btn-yellow",
    },
  ];

  // Mock data for charts
  const statusChartData = {
    labels: ["Pending", "In Progress", "Resolved", "Rejected"],
    datasets: [
      {
        data: [12, 5, 18, 2],
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const trendChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Complaints Submitted",
        data: [4, 7, 3, 15, 8, 12],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#4f46e5",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const categoryChartData = {
    labels: ["Roads", "Water", "Electricity", "Waste", "Others"],
    datasets: [
      {
        label: "Issues by Category",
        data: [15, 8, 5, 20, 3],
        backgroundColor: "rgba(6, 182, 212, 0.85)",
        hoverBackgroundColor: "rgba(6, 182, 212, 1)",
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
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
        grid: {
          color: "rgba(241, 245, 249, 1)",
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11 },
          color: "#64748b",
        },
      },
      x: {
        grid: { display: false, drawBorder: false },
        border: { display: false },
        ticks: {
          font: { family: "Inter, sans-serif", size: 11 },
          color: "#64748b",
        },
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
    <div className="citizen-dashboard">
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
          <div className="user-welcome">
            <span className="user-welcome-label">Welcome back</span>
            <span className="user-welcome-email">
              {user?.email || "Citizen User"}
            </span>
          </div>

          <button className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="dashboard-content">
        {/* Main Heading */}
        <div className="dashboard-header mb-8">
          <h2 className="dashboard-heading">Citizen Dashboard</h2>
          <p className="dashboard-subheading">
            Welcome back! Here's your activity overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((item, index) => (
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

        {/* Analytics Section */}
        <div className="section-divider">
          <h3 className="section-title">Dashboard Analytics</h3>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h4>Complaint Status</h4>
            <div className="chart-container pie-container">
              <Doughnut data={statusChartData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h4>Complaints Over Time</h4>
            <div className="chart-container">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
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

export default CitizenDashboard;
