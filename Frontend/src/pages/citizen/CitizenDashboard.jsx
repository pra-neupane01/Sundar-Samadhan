import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ClipboardList, HeartHandshake, Star, Megaphone,
  PenLine, ListChecks, Coins, Activity,
  ArrowUpRight, Clock, MessageSquare, ChevronRight
} from "lucide-react";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "./CitizenDashboard.css";
import AboutContent from "../../components/AboutContent";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaintCount, setComplaintCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        // My Complaints
        const compRes = await api.get("/complaints/my-complaints");
        if (compRes.data.success) {
          const c = compRes.data.complaint || [];
          setComplaintCount(c.length);
          setAllComplaints(c);
          setRecentComplaints(c.slice(0, 5));
        }
        
        // My Donations
        const donRes = await api.get("/donations/my-donations");
        if (donRes.data.success) {
          setDonationCount(donRes.data.donationCount || donRes.data.donations?.length || 0);
        }
        
        // Get Ward or Global announcements
        let annUrl = "/announcements/get-announcements";
        if (user?.ward_number) annUrl = `/announcements/get-announcements-ward/${user.ward_number}`;
        
        const annRes = await api.get(annUrl);
        if (annRes.data.success) {
          setAnnouncements(annRes.data.announcements?.slice(0, 3) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.ward_number]);

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
      backgroundColor: "rgba(16, 185, 129, 0.8)",
      hoverBackgroundColor: "#10b981",
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
    const name = user?.full_name || "";
    const parts = name.trim().split(" ");
    const displayName = parts.length > 1 ? `Mr. ${parts[parts.length - 1]}` : name;
    if (h < 12) return `Good morning, ${displayName}`;
    if (h < 17) return `Good afternoon, ${displayName}`;
    return `Good evening, ${displayName}`;
  };

  return (
    <>
      <div className="page-shell">
      <div className="content-container">

        {/* Welcome Header */}
        <div className="cd-welcome-header">
          <div>
            <p className="cd-greeting">{greeting()} 👋</p>
            <h1 className="page-title">Overview & Analytics</h1>
            <p className="page-subtitle">Track your complaints, donations and community activities at a glance.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/citizen/complaint/create")}>
            <PenLine size={18} /> Lodge a Complaint
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card-v2 stat-blue" onClick={() => navigate("/citizen/complaints")}>
            <div className="stat-icon"><ClipboardList size={24} /></div>
            <div>
              <div className="stat-label">Total Complaints</div>
              <div className="stat-value">{complaintCount}</div>
              <div className="stat-trend">↗ View all history</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-amber">
            <div className="stat-icon"><Clock size={24} /></div>
            <div>
              <div className="stat-label">Pending Issues</div>
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-trend" style={{ color: "#92400e" }}>{processingCount} in progress</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-green">
            <div className="stat-icon"><Activity size={24} /></div>
            <div>
              <div className="stat-label">Resolved Rate</div>
              <div className="stat-value">{resolutionRate}%</div>
              <div className="stat-trend" style={{ color: "#065f46" }}>{resolvedCount} resolved</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-purple" onClick={() => navigate("/citizen/donate")}>
            <div className="stat-icon"><Star size={24} /></div>
            <div>
              <div className="stat-label">Sundar Points</div>
              <div className="stat-value">{user?.sundar_points || 0}</div>
              <div className="stat-trend" style={{ color: "#6d28d9" }}>{donationCount} donations made</div>
            </div>
          </div>
        </div>

        <div className="cd-main-grid">
          {/* Main Visualizations */}
          <div className="cd-charts-col">
            <div className="chart-card-v2">
              <div className="section-head-v2">
                <Activity size={18} className="text-green-600" />
                <h3>Complaint Analytics</h3>
              </div>
              <div className="charts-split">
                <div className="chart-item">
                  <span className="chart-label">Status Distribution</span>
                  <div className="chart-wrapper-v2" style={{ height: "220px" }}>
                    {complaintCount > 0 ? <Doughnut data={doughnutData} options={pieOptions} /> : <div className="empty-mini">No data yet</div>}
                  </div>
                </div>
                <div className="chart-item">
                  <span className="chart-label">Issues by Category</span>
                  <div className="chart-wrapper-v2" style={{ height: "220px" }}>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-6">
                <div className="section-head-v2" style={{ justifyContent: "space-between" }}>
                    <div className="flex-center gap-2">
                        <ClipboardList size={18} className="text-indigo-600" />
                        <h3>Recent Activity</h3>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/citizen/complaints")}>
                        View All <ArrowUpRight size={14} />
                    </button>
                </div>
                
                {recentComplaints.length > 0 ? (
                    <div className="cd-recent-list">
                        {recentComplaints.map((c) => (
                            <div key={c.complaint_id} className="cd-recent-item" onClick={() => navigate(`/citizen/complaints`)}>
                                <div className="cd-status-marker" style={{ background: getStatusDot(c.status) }}></div>
                                <div className="cd-item-details">
                                    <span className="cd-item-title">{c.title}</span>
                                    <div className="cd-item-meta">
                                        <span>{c.category}</span>
                                        <span className="dot-sep small"></span>
                                        <span>Ward {c.ward_number}</span>
                                        <span className="dot-sep small"></span>
                                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span className={getStatusBadge(c.status)}>{c.status}</span>
                                <ChevronRight size={16} className="cd-item-arrow" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-mini">
                        <MessageSquare size={32} />
                        <p>No recent activity found.</p>
                    </div>
                )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="cd-right-col">
            <div className="card cd-side-announcement">
                <div className="section-head-v2" style={{ justifyContent: "space-between" }}>
                    <div className="flex-center gap-2">
                        <Megaphone size={18} className="text-amber-600" />
                        <h3>Community Updates</h3>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/municipal/announcements")}>
                        <ArrowUpRight size={14} />
                    </button>
                </div>

                <div className="cd-ann-list">
                    {announcements.length > 0 ? announcements.map((ann, i) => (
                        <div key={i} className="cd-ann-item">
                            <div className="cd-ann-date">
                                {new Date(ann.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                            <h4 className="cd-ann-title">{ann.title}</h4>
                            <p className="cd-ann-snippet">{ann.content.substring(0, 80)}...</p>
                        </div>
                    )) : (
                        <div className="empty-state-mini">
                            <p>No updates from your ward.</p>
                        </div>
                    )}
                </div>
                
                <button className="btn btn-secondary btn-sm w-full mt-4" onClick={() => navigate("/municipal/announcements")}>
                    Read All Announcements
                </button>
            </div>

            <div className="card mt-6 bg-gradient-to-br from-green-600 to-green-700 text-white border-none shadow-green">
                <h4 className="text-white font-bold mb-2">Build a Sundar City</h4>
                <p className="text-green-100 text-sm mb-4">Your contributions directly fund localized infrastructure and health initiatives.</p>
                <button className="btn btn-sm w-full bg-white text-green-600 hover:bg-green-50" onClick={() => navigate("/citizen/donate")}>
                    Contribute Now
                </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="section-heading mt-10">Quick Actions</div>
        <div className="quick-actions-grid mt-4">
          <div className="quick-action-card qa-blue" onClick={() => navigate("/citizen/complaint/create")}>
            <div className="qa-icon"><PenLine size={24} /></div>
            <div>
              <div className="qa-title">Lodge a Complaint</div>
              <div className="qa-desc">Report infrastructure issues, civic problems, or municipal services.</div>
            </div>
            <button className="btn btn-primary btn-sm">Start Report</button>
          </div>
          <div className="quick-action-card qa-green" onClick={() => navigate("/citizen/complaints")}>
            <div className="qa-icon"><ListChecks size={24} /></div>
            <div>
              <div className="qa-title">Track Submissions</div>
              <div className="qa-desc">Monitor real-time progress and notes from municipal officers.</div>
            </div>
            <button className="btn btn-success btn-sm">Check Status</button>
          </div>
          <div className="quick-action-card qa-amber" onClick={() => navigate("/citizen/donate")}>
            <div className="qa-icon"><Coins size={24} /></div>
            <div>
              <div className="qa-title">Impact Donation</div>
              <div className="qa-desc">Support community development projects and earn points.</div>
            </div>
            <button className="btn btn-sm" style={{ background: "#f59e0b", color: "white" }}>Donate Funds</button>
          </div>
        </div>

        {/* --- ADDED ABOUT US SECTIONS --- */}
        <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid var(--gray-200)" }}>
          <AboutContent />
        </div>

        <footer style={{ marginTop: "40px", textAlign: "center", paddingBottom: "40px", color: "#94a3b8", fontSize: "0.85rem" }}>
           &copy; 2026 Sundar Samadhan Municipality Initiative
        </footer>
      </div>
    </div>

    <style>{`
        .section-head-v2 { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .section-head-v2 h3 { font-size: 1.05rem; font-weight: 700; color: #1e293b; margin: 0; }
        .flex-center { display: flex; align-items: center; }
        .gap-2 { gap: 8px; }
        
        .cd-main-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; margin-top: 32px; }
        @media (max-width: 900px) { .cd-main-grid { grid-template-columns: 1fr; } }
        
        .charts-split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 600px) { .charts-split { grid-template-columns: 1fr; } }
        
        .chart-item { display: flex; flex-direction: column; gap: 8px; }
        .chart-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
        
        /* Recent Items */
        .cd-recent-list { display: flex; flex-direction: column; gap: 10px; }
        .cd-recent-item {
            display: flex; align-items: center; gap: 16px; padding: 12px;
            background: #f8fafc; border-radius: 12px; cursor: pointer; transition: all 0.2s;
            border: 1px solid transparent;
        }
        .cd-recent-item:hover { background: #eff6ff; border-color: #dbeafe; transform: translateX(4px); }
        .cd-status-marker { width: 4px; height: 32px; border-radius: 4px; flex-shrink: 0; }
        .cd-item-details { flex: 1; min-width: 0; }
        .cd-item-title { font-size: 0.95rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 2px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cd-item-meta { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; color: #94a3b8; }
        .dot-sep.small { width: 3px; height: 3px; background: #cbd5e1; border-radius: 50%; }
        .cd-item-arrow { color: #cbd5e1; opacity: 0; transition: all 0.2s; }
        .cd-recent-item:hover .cd-item-arrow { opacity: 1; transform: translateX(2px); color: #2563eb; }

        /* Announcements sidebar */
        .cd-ann-list { display: flex; flex-direction: column; gap: 16px; }
        .cd-ann-item { border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .cd-ann-item:last-child { border-bottom: none; padding-bottom: 0; }
        .cd-ann-date { font-size: 0.7rem; font-weight: 700; color: #2563eb; background: #eff6ff;
            padding: 2px 8px; border-radius: 6px; display: inline-block; margin-bottom: 6px; }
        .cd-ann-title { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
        .cd-ann-snippet { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0; }

        .empty-state-mini { padding: 40px 20px; text-align: center; color: #cbd5e1; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .empty-state-mini p { font-size: 0.87rem; color: #94a3b8; margin: 0; }
      `}</style>
    </>
  );
};

export default CitizenDashboard;
