import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ClipboardList, CheckCircle, Clock, Settings, ListChecks, Megaphone, TrendingUp, Activity
} from "lucide-react";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "./MunicipalDashboard.css";
import AboutContent from "../../components/AboutContent";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const MunicipalDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, resolved: 0 });
  const [categoryData, setCategoryData] = useState({});
  const [selectedWard, setSelectedWard] = useState("all");

  const fetchWardComplaints = async () => {
    if (!token) return;
    try {
      let endpoint = "/complaints/get-all-complaints";
      if (selectedWard !== "all") endpoint = `/complaints/get-complaints-by-ward/${selectedWard}`;
      const res = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        const complaints = res.data.complaint || [];
        let pending = 0, processing = 0, resolved = 0, categories = {};
        complaints.forEach((c) => {
          if (c.status === "pending") pending++;
          else if (c.status === "processing") processing++;
          else if (c.status === "resolved") resolved++;
          const cat = c.category || "General";
          categories[cat] = (categories[cat] || 0) + 1;
        });
        setStats({ total: complaints.length, pending, processing, resolved });
        setCategoryData(categories);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchWardComplaints(); }, [token, selectedWard]);

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => fetchWardComplaints();
    socket.on("newWardComplaint", handleRefresh);
    socket.on("statusUpdated", handleRefresh);
    return () => { socket.off("newWardComplaint", handleRefresh); socket.off("statusUpdated", handleRefresh); };
  }, [socket, selectedWard, token]);

  const resolutionRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    const name = user?.full_name || "";
    const parts = name.trim().split(" ");
    const displayName = parts.length > 1 ? `Sir ${parts[parts.length - 1]}` : name;
    if (h < 12) return `Good morning, ${displayName}`;
    if (h < 17) return `Good afternoon, ${displayName}`;
    return `Good evening, ${displayName}`;
  };

  const statusChartData = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [{ data: [stats.pending, stats.processing, stats.resolved], backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"], borderWidth: 0, hoverOffset: 6 }],
  };
  const catLabels = Object.keys(categoryData);
  const catValues = Object.values(categoryData);
  const categoryChartData = {
    labels: catLabels.length > 0 ? catLabels : ["No Data"],
    datasets: [{ label: "Issues", data: catValues.length > 0 ? catValues : [0], backgroundColor: "rgba(37,99,235,0.8)", hoverBackgroundColor: "#2563eb", borderRadius: 6, barPercentage: 0.55 }],
  };

  const pieOptions = {
    maintainAspectRatio: false, cutout: "68%",
    plugins: {
      legend: { position: "bottom", labels: { padding: 16, usePointStyle: true, font: { size: 12, family: "Inter" }, color: "#475569" } },
      tooltip: { backgroundColor: "#1e293b", padding: 10, cornerRadius: 8 },
    },
  };
  const barOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1e293b", padding: 10, cornerRadius: 8 } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f1f5f9" }, border: { display: false }, ticks: { font: { size: 11 }, color: "#64748b" } },
      x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: "#64748b" } },
    },
  };

  return (
    <div className="page-shell">
      <div className="content-container">

        {/* Welcome Header */}
        <div className="cd-welcome-header">
          <div>
            <p className="cd-greeting" style={{ color: "#10b981" }}>{getGreeting()} 🏛️</p>
            <h1 className="page-title">Operations Center</h1>
            <p className="page-subtitle">
              {selectedWard !== "all" ? `Ward ${selectedWard} overview` : "Overview of all wards"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: 600, color: "#475569", fontSize: "0.87rem" }}>Area:</label>
            <select className="filter-select" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
              <option value="all">All Wards</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map(w => <option key={w} value={w}>Ward {w}</option>)}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card-v2 stat-blue" onClick={() => navigate("/municipal/complaints")} style={{ cursor: "pointer" }}>
            <div className="stat-icon"><ClipboardList size={24} /></div>
            <div>
              <div className="stat-label">Total Complaints</div>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-amber">
            <div className="stat-icon"><Clock size={24} /></div>
            <div>
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-blue">
            <div className="stat-icon"><Settings size={24} /></div>
            <div>
              <div className="stat-label">In Progress</div>
              <div className="stat-value">{stats.processing}</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-green">
            <div className="stat-icon"><CheckCircle size={24} /></div>
            <div>
              <div className="stat-label">Resolved</div>
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-trend" style={{ color: "#065f46" }}>{resolutionRate}%</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="section-heading">Ward Analytics</div>
        <div className="charts-grid-v2" style={{ marginTop: "16px" }}>
          <div className="chart-card-v2">
            <div className="chart-title">Complaint Status</div>
            <div className="chart-body" style={{ height: "240px" }}>
              <Doughnut data={statusChartData} options={pieOptions} />
            </div>
          </div>
          <div className="chart-card-v2 span-2">
            <div className="chart-title">Issues by Category</div>
            <div className="chart-body" style={{ height: "240px" }}>
              <Bar data={categoryChartData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-heading" style={{ marginTop: "36px" }}>Quick Actions</div>
        <div className="quick-actions-grid" style={{ marginTop: "16px" }}>
          <div className="quick-action-card qa-green" onClick={() => navigate("/municipal/complaints")}>
            <div className="qa-icon"><ListChecks size={24} /></div>
            <div>
              <div className="qa-title">Manage Complaints</div>
              <div className="qa-desc">View and update the status of complaints across all wards.</div>
            </div>
            <button className="btn btn-success btn-sm">View Complaints →</button>
          </div>
          <div className="quick-action-card qa-blue" onClick={() => navigate("/municipal/announcements")}>
            <div className="qa-icon"><Megaphone size={24} /></div>
            <div>
              <div className="qa-title">Announcements</div>
              <div className="qa-desc">Post and manage announcements for the municipality or specific wards.</div>
            </div>
            <button className="btn btn-primary btn-sm">Manage →</button>
          </div>
        </div>


        <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid var(--gray-200)" }}>
          <AboutContent />
        </div>

        <footer style={{ marginTop: "40px", textAlign: "center", paddingBottom: "40px", color: "#94a3b8", fontSize: "0.85rem" }}>
           &copy; 2026 Sundar Samadhan Municipality Initiative
        </footer>

      </div>
    </div>
  );
};

export default MunicipalDashboard;
