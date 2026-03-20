import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ClipboardList, HeartHandshake, Star, Megaphone,
  PenLine, ListChecks, Coins, TrendingUp,
  CheckCircle2, Clock, AlertCircle, Activity,
  ArrowUpRight
} from "lucide-react";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "./CitizenDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaintCount, setComplaintCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [allComplaints, setAllComplaints] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const compRes = await api.get("/complaints/my-complaints");
        if (compRes.data.success) {
          const c = compRes.data.complaint || [];
          setComplaintCount(c.length);
          setAllComplaints(c);
          setRecentComplaints(c.slice(0, 5));
        }
        const donRes = await api.get("/donations/my-donations");
        if (donRes.data.success)
          setDonationCount(donRes.data.donationCount || donRes.data.donations?.length || 0);
        const annRes = await api.get("/announcements/get-announcements");
        if (annRes.data.success)
          setAnnouncementCount(annRes.data.announcements?.length || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const resolvedCount   = allComplaints.filter(c => c.status === "resolved").length;
  const pendingCount    = allComplaints.filter(c => c.status === "pending").length;
  const processingCount = allComplaints.filter(c => c.status === "processing").length;
  const resolutionRate  = complaintCount ? Math.round((resolvedCount / complaintCount) * 100) : 0;

  const getStatusBadge = (status) => {
    const map = {
      pending:    "badge badge-pending",
      processing: "badge badge-processing",
      resolved:   "badge badge-resolved",
    };
    return map[status?.toLowerCase()] || "badge badge-default";
  };

  const getStatusDot = (status) => {
    const dots = { pending: "#f59e0b", processing: "#3b82f6", resolved: "#10b981" };
    return dots[status?.toLowerCase()] || "#94a3b8";
  };

  const getCategoryCounts = () => {
    const counts = {};
    allComplaints.forEach(c => {
      const cat = c.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  };
  const catCounts = getCategoryCounts();

  const doughnutData = {
    labels: ["Pending", "Processing", "Resolved"],
    datasets: [{
      data: [pendingCount, processingCount, resolvedCount],
      backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
      borderWidth: 0, hoverOffset: 6,
    }],
  };

  const barData = {
    labels: Object.keys(catCounts).length > 0 ? Object.keys(catCounts) : ["No Data"],
    datasets: [{
      label: "Issues",
      data: Object.values(catCounts).length > 0 ? Object.values(catCounts) : [0],
      backgroundColor: "rgba(37, 99, 235, 0.8)",
      hoverBackgroundColor: "#2563eb",
      borderRadius: 6, barPercentage: 0.55,
    }],
  };

  const pieOptions = {
    maintainAspectRatio: false, cutout: "68%",
    plugins: {
      legend: { position: "bottom", labels: { padding: 16, usePointStyle: true, font: { size: 12, family: "Inter" }, color: "#475569" }},
      tooltip: { backgroundColor: "#1e293b", padding: 10, cornerRadius: 8, bodyFont: { size: 13 } },
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

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-shell">
      <div className="content-container">

        {/* ── Welcome Header ── */}
        <div className="cd-welcome-header">
          <div>
            <p className="cd-greeting">{greeting()}, {user?.full_name?.split(" ")[0]} 👋</p>
            <h1 className="page-title">Citizen Dashboard</h1>
            <p className="page-subtitle">Track your complaints, donations and community activities.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/citizen/complaint/create")}>
            <PenLine size={18} /> Lodge a Complaint
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="stats-row">
          <div className="stat-card-v2 stat-blue" onClick={() => navigate("/citizen/complaints")}>
            <div className="stat-icon"><ClipboardList size={24} /></div>
            <div>
              <div className="stat-label">Total Complaints</div>
              <div className="stat-value">{complaintCount}</div>
              <div className="stat-trend" style={{ color: "#2563eb" }}>↗ View all</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-amber">
            <div className="stat-icon"><Clock size={24} /></div>
            <div>
              <div className="stat-label">Pending</div>
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-trend" style={{ color: "#92400e" }}>Awaiting action</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-green">
            <div className="stat-icon"><CheckCircle2 size={24} /></div>
            <div>
              <div className="stat-label">Resolved</div>
              <div className="stat-value">{resolvedCount}</div>
              <div className="stat-trend" style={{ color: "#065f46" }}>{resolutionRate}% resolution rate</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-purple" onClick={() => navigate("/citizen/donations")}>
            <div className="stat-icon"><HeartHandshake size={24} /></div>
            <div>
              <div className="stat-label">My Donations</div>
              <div className="stat-value">{donationCount}</div>
              <div className="stat-trend" style={{ color: "#6d28d9" }}>{user?.sundar_points || 0} pts earned</div>
            </div>
          </div>
        </div>

        {/* ── Charts & Recent ── */}
        <div className="cd-main-grid">
          <div className="cd-charts-col">

            {/* Complaint Status Doughnut */}
            <div className="chart-card-v2">
              <div className="chart-title section-heading">Complaint Status Breakdown</div>
              {complaintCount > 0 ? (
                <div className="chart-body" style={{ height: "260px" }}>
                  <Doughnut data={doughnutData} options={pieOptions} />
                </div>
              ) : (
                <div className="empty-chart">
                  <Activity size={40} style={{ color: "#cbd5e1" }} />
                  <p>Submit a complaint to see analytics here.</p>
                </div>
              )}
            </div>

            {/* Category Bar */}
            <div className="chart-card-v2" style={{ marginTop: "20px" }}>
              <div className="chart-title section-heading">Issues by Category</div>
              <div className="chart-body" style={{ height: "220px" }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

          </div>

          <div className="cd-right-col">
            {/* Recent Complaints */}
            <div className="chart-card-v2">
              <div className="chart-title section-heading" style={{ marginBottom: "16px", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ClipboardList size={18} style={{ color: "#2563eb" }} /> Recent Complaints
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate("/citizen/complaints")}
                  style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem" }}>
                  View All <ArrowUpRight size={14} />
                </button>
              </div>

              {loading ? (
                <div className="loading-spinner-v2"><div className="spinner-ring"></div><p>Loading...</p></div>
              ) : recentComplaints.length > 0 ? (
                <div className="cd-complaints-list">
                  {recentComplaints.map((c) => (
                    <div key={c.complaint_id} className="cd-complaint-row">
                      <div className="cd-complaint-dot" style={{ background: getStatusDot(c.status) }}></div>
                      <div className="cd-complaint-info">
                        <span className="cd-complaint-title">{c.title}</span>
                        <span className="cd-complaint-meta">{c.category} · Ward {c.ward_number} · {new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={getStatusBadge(c.status)}>
                        <span className="badge-dot"></span>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-v2" style={{ padding: "40px 20px" }}>
                  <div className="empty-icon"><ClipboardList size={32} /></div>
                  <h3>No complaints yet</h3>
                  <p>You haven't submitted any complaints. Let your voice be heard!</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}
                    onClick={() => navigate("/citizen/complaint/create")}>
                    Submit First Complaint
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats Panel */}
            <div className="chart-card-v2" style={{ marginTop: "20px" }}>
              <div className="chart-title section-heading">Your Activity</div>
              <div className="cd-activity-row">
                <div className="cd-activity-item">
                  <Star size={22} style={{ color: "#f59e0b" }} />
                  <div>
                    <div className="cd-activity-val">{user?.sundar_points || 0}</div>
                    <div className="cd-activity-lbl">Sundar Points</div>
                  </div>
                </div>
                <div className="cd-activity-item">
                  <Megaphone size={22} style={{ color: "#8b5cf6" }} />
                  <div>
                    <div className="cd-activity-val">{announcementCount}</div>
                    <div className="cd-activity-lbl">Announcements</div>
                  </div>
                </div>
                <div className="cd-activity-item">
                  <TrendingUp size={22} style={{ color: "#10b981" }} />
                  <div>
                    <div className="cd-activity-val">{resolutionRate}%</div>
                    <div className="cd-activity-lbl">Resolved Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="section-heading" style={{ marginTop: "40px", marginBottom: "20px" }}>Quick Actions</div>
        <div className="quick-actions-grid">
          <div className="quick-action-card qa-blue" onClick={() => navigate("/citizen/complaint/create")}>
            <div className="qa-icon"><PenLine size={24} /></div>
            <div>
              <div className="qa-title">Lodge a Complaint</div>
              <div className="qa-desc">Report infrastructure issues, civic problems, or municipal services in your area.</div>
            </div>
            <button className="btn btn-primary btn-sm">Report Now →</button>
          </div>
          <div className="quick-action-card qa-green" onClick={() => navigate("/citizen/complaints")}>
            <div className="qa-icon"><ListChecks size={24} /></div>
            <div>
              <div className="qa-title">Track My Complaints</div>
              <div className="qa-desc">View real-time updates for all complaints you've submitted previously.</div>
            </div>
            <button className="btn btn-success btn-sm">View Status →</button>
          </div>
          <div className="quick-action-card qa-amber" onClick={() => navigate("/citizen/donate")}>
            <div className="qa-icon"><Coins size={24} /></div>
            <div>
              <div className="qa-title">Make a Donation</div>
              <div className="qa-desc">Support community development projects and earn Sundar Points as a reward.</div>
            </div>
            <button className="btn btn-sm" style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "white" }}>Donate Now →</button>
          </div>
          <div className="quick-action-card qa-purple" onClick={() => navigate("/citizen/announcements")}>
            <div className="qa-icon"><Megaphone size={24} /></div>
            <div>
              <div className="qa-title">View Announcements</div>
              <div className="qa-desc">Stay informed with the latest municipal news and announcements.</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ border: "1px solid #e9d5ff", color: "#7c3aed" }}>Read More →</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
