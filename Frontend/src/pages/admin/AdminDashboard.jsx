import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Users, ClipboardList, CheckCircle, Banknote,
  UserCog, FileCheck, TrendingUp, Activity,
  ShieldCheck, BarChart3, ArrowUpRight
} from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalComplaints: 0, resolvedPercentage: "0", activeUsers: 0, totalDonationAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(r => { if (r.data.success) setStats(r.data.stats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const adminModules = [
    {
      title: "Manage Users",
      desc: "View, block, and manage roles for all registered citizens and officers.",
      icon: <UserCog size={26} />,
      color: "qa-blue",
      href: "/admin/users",
      stat: `${stats.activeUsers} active`,
    },
    {
      title: "Municipal Requests",
      desc: "Review submitted documents and grant Municipal Officer privileges.",
      icon: <FileCheck size={26} />,
      color: "qa-green",
      href: "/admin/municipal-requests",
      stat: "Pending review",
    },
    {
      title: "Donation Ledger",
      desc: "Monitor all successful financial contributions across the platform.",
      icon: <Banknote size={26} />,
      color: "qa-amber",
      href: "/admin/all-donations",
      stat: `Rs. ${stats.totalDonationAmount || 0}`,
    },
    {
      title: "System Health",
      desc: "Monitor platform uptime, system settings, and database status.",
      icon: <ShieldCheck size={26} />,
      color: "qa-purple",
      href: null,
      stat: "Operational ✓",
    },
  ];

  return (
    <div className="page-shell">
      <div className="content-container">

        {/* Welcome */}
        <div className="cd-welcome-header">
          <div>
            <p className="cd-greeting" style={{ color: "#7c3aed" }}>
              {(() => { const h=new Date().getHours(); const n=user?.full_name||""; const p=n.trim().split(" "); const d=p.length>1?`Mr. ${p[p.length-1]}`:n; return h<12?`Good morning, ${d}`:h<17?`Good afternoon, ${d}`:`Good evening, ${d}`; })()} 🏛️
            </p>
            <h1 className="page-title">Control Panel</h1>
            <p className="page-subtitle">Manage users, complaints, and platform operations.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Logged in as</div>
            <div style={{ fontWeight: 700, color: "#1e293b" }}>{user?.email}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card-v2 stat-blue">
            <div className="stat-icon"><Users size={24} /></div>
            <div>
              <div className="stat-label">Active Users</div>
              <div className="stat-value">{loading ? "—" : stats.activeUsers}</div>
              <div className="stat-trend" style={{ color: "#2563eb" }}>Registered citizens</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-amber">
            <div className="stat-icon"><ClipboardList size={24} /></div>
            <div>
              <div className="stat-label">Total Complaints</div>
              <div className="stat-value">{loading ? "—" : stats.totalComplaints}</div>
              <div className="stat-trend" style={{ color: "#92400e" }}>Across all wards</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-green">
            <div className="stat-icon"><CheckCircle size={24} /></div>
            <div>
              <div className="stat-label">Resolution Rate</div>
              <div className="stat-value">{loading ? "—" : `${stats.resolvedPercentage}%`}</div>
              <div className="stat-trend" style={{ color: "#065f46" }}>of all complaints</div>
            </div>
          </div>
          <div className="stat-card-v2 stat-purple">
            <div className="stat-icon"><Banknote size={24} /></div>
            <div>
              <div className="stat-label">Total Donations</div>
              <div className="stat-value">Rs.{loading ? "—" : Math.round(stats.totalDonationAmount || 0)}</div>
              <div className="stat-trend" style={{ color: "#6d28d9" }}>Total collected</div>
            </div>
          </div>
        </div>

        {/* Resolution Progress Bar */}
        <div className="card" style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div className="section-heading" style={{ margin: 0 }}>Platform Performance</div>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Overall Resolution Rate</span>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
            <div style={{
              width: `${stats.resolvedPercentage || 0}%`,
              background: "linear-gradient(90deg, #10b981, #34d399)",
              height: "100%", borderRadius: "999px",
              transition: "width 1s ease",
            }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.78rem", color: "#94a3b8" }}>
            <span>0%</span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>{stats.resolvedPercentage}% resolved</span>
            <span>100%</span>
          </div>
        </div>

        {/* Admin Modules Grid */}
        <div className="section-heading">Administration Modules</div>
        <div className="quick-actions-grid" style={{ marginTop: "16px" }}>
          {adminModules.map((m) => (
            <div
              key={m.title}
              className={`quick-action-card ${m.color}`}
              onClick={() => m.href ? navigate(m.href) : alert("System operational.")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="qa-icon">{m.icon}</div>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>{m.stat}</span>
              </div>
              <div>
                <div className="qa-title">{m.title}</div>
                <div className="qa-desc">{m.desc}</div>
              </div>
              {m.href && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: 600, color: "#2563eb" }}>
                  Open Module <ArrowUpRight size={15} />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
