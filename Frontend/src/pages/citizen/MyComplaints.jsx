import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Search, Bell, Settings, LayoutDashboard, FileText, Map as MapIcon,
  Building2, HelpCircle, Plus, CheckCircle2, CircleDashed, Check,
  Clock, AlertTriangle, Trash2, Shield, ArrowRight, ExternalLink,
  ShieldAlert
} from "lucide-react";
import "../../components/DashboardLayout.css";

const MyComplaints = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  useEffect(() => {
    api.get(`/complaints/my-complaints?limit=30`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          setComplaints(res.data.complaint || []);
        }
      })
      .catch(console.error);
  }, [token]);

  // Aggregation for metrics
  const activeCount = complaints.filter(c => c.status === "processing" || c.status === "pending").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;

  const filtered = complaints.filter(c => {
    const sMatch = search ? c.title.toLowerCase().includes(search.toLowerCase()) : true;
    const fMatch = filterStatus === "all" ? true : c.status.toLowerCase() === filterStatus;
    return sMatch && fMatch;
  });

  // Dynamically setup the active report based on user interaction
  let activeReport = null;
  if (selectedComplaintId) {
    activeReport = complaints.find(c => c.complaint_id === selectedComplaintId);
  }
  if (!activeReport) {
    activeReport = complaints.find(c => c.status !== "resolved") || complaints[0];
  }

  return (
    <div className="dashboard-shell">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="sidebar-left">
        <div className="brand-section" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
          <div className="brand-name">City of Progress</div>
          <div className="portal-type">{user?.role === 'municipal' ? 'MUNICIPAL' : user?.role === 'admin' ? 'ADMIN' : 'CITIZEN'} PORTAL</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard size={20} />
            Overview
          </div>
          <div className="nav-item active">
            <FileText size={20} fill="#d1fae5" />
            My Reports
          </div>
          <div className="nav-item" onClick={() => navigate("/citizen/map")}>
            <MapIcon size={20} />
            Community Map
          </div>
          <div className="nav-item" onClick={() => navigate("/contact")}>
            <HelpCircle size={20} />
            Support
          </div>
        </nav>

        <div className="sidebar-bottom">
          <button className="btn-new-report" onClick={() => navigate("/citizen/complaint/create")}>
            <Plus size={20} strokeWidth={3} />
            New Report
          </button>
          
          <div className="legal-links">
            <div className="legal-link"><Shield size={14} /> Privacy</div>
            <div className="legal-link"><ShieldAlert size={14} /> Terms</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        <div>
          <h1 className="ar-title" style={{ fontSize: "2.2rem" }}>My Reports</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "32px" }}>
            Track the status of your submitted complaints and community requests in real-time.
          </p>
        </div>

        <div className="filter-pills">
          <button className={`pill ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`pill ${filterStatus === 'processing' ? 'active' : ''}`} onClick={() => setFilter('processing')}>In Progress</button>
          <button className={`pill ${filterStatus === 'resolved' ? 'active' : ''}`} onClick={() => setFilter('resolved')}>Resolved</button>
        </div>

        {activeReport && (
          <div className="active-report-card">
            <div className="ar-header">
              <div>
                <div className="ar-tag">ACTIVE REPORT</div>
                <h2 className="ar-title">#SS-{(activeReport.id || activeReport.complaint_id).toString().substring(0, 6).toUpperCase()}: {activeReport.title}</h2>
                <div className="ar-date">Submitted on {new Date(activeReport.created_at).toLocaleString()}</div>
              </div>
              <span className="pill" style={{ background: "#e2e8f0", color: "#475569", borderRadius:"8px", fontSize:"0.8rem", textTransform: "capitalize" }}>
                {activeReport.status === 'processing' ? 'In Progress' : activeReport.status}
              </span>
            </div>

            <div className="timeline-stepper">
              <div className="step-line" style={{ background: activeReport.status === 'resolved' ? '#059669' : '#e2e8f0' }}></div>
              
              <div className="timeline-step">
                <div className="step-icon bg-green"><Check size={16} strokeWidth={3} /></div>
                <div className="step-content">
                  <h4>Reported</h4>
                  <p>Ticket created and initial evidence uploaded.</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className={`step-icon ${activeReport.status !== 'pending' ? 'bg-green' : 'bg-gray'}`}>
                  {(activeReport.status !== 'pending') ? <Check size={16} strokeWidth={3} /> : <CircleDashed size={16} />}
                </div>
                <div className="step-content">
                  <h4 style={{ color: activeReport.status !== 'pending' ? '#1e293b' : '#94a3b8' }}>Assigned</h4>
                  <p>Assigned to Municipal Ward {activeReport.ward_number} Department.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className={`step-icon ${activeReport.status === 'processing' || activeReport.status === 'resolved' ? 'bg-light-green' : 'bg-gray'}`}>
                  {activeReport.status === 'processing' ? <CircleDashed size={16} className="text-emerald-700" /> : <Check size={16} />}
                </div>
                <div className="step-content">
                  <h4 style={{ color: activeReport.status === 'processing' || activeReport.status === 'resolved' ? '#1e293b' : '#94a3b8' }}>In Progress</h4>
                  <p>Technicians are evaluating or currently on-site performing repairs.</p>
                </div>
              </div>

              <div className="timeline-step" style={{ paddingBottom: 0 }}>
                <div className={`step-icon ${activeReport.status === 'resolved' ? 'bg-green' : 'bg-gray'}`}>
                  <CheckCircle2 size={16} />
                </div>
                <div className="step-content">
                  <h4 style={{ color: activeReport.status === 'resolved' ? '#1e293b' : '#94a3b8' }}>Resolved</h4>
                  <p>Inspection completed and service restored.</p>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px", marginTop: "16px", textAlign: "right" }}>
              <button 
                onClick={() => navigate(`/citizen/complaint/${activeReport.id || activeReport.complaint_id}`)}
                style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: "0.9rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                View Full Incident History <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        <h3 className="section-title">Past Submissions</h3>
        <div className="submission-list">
          {filtered.map(c => (
            <div 
              key={c.complaint_id} 
              className="sub-card" 
              onClick={() => {
                setSelectedComplaintId(c.complaint_id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ border: activeReport && activeReport.complaint_id === c.complaint_id ? '2px solid var(--brand-primary)' : '2px solid transparent' }}
            >
              <div className="sub-icon">
                {c.category?.toLowerCase()?.includes('road') || c.category?.toLowerCase()?.includes('pothole') ? <AlertTriangle size={24} color="#b91c1c" /> : 
                 c.category?.toLowerCase()?.includes('waste') ? <Trash2 size={24} color="#059669" /> : 
                 c.category?.toLowerCase()?.includes('light') ? <CircleDashed size={24} color="#0f172a" /> : 
                 <FileText size={24} color="#475569" />}
              </div>
              <div className="sub-details">
                <h4>#SS-{(c.id || c.complaint_id).toString().substring(0, 6).toUpperCase()}: {c.title}</h4>
                <p>{c.category} • {new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`sub-status ${c.status === 'pending' ? 'status-urgent' : 'status-resolved'}`} style={{ textTransform: "capitalize" }}>
                {c.status}
              </span>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
          ))}
          {filtered.length === 0 && <p style={{color:"#94a3b8"}}>No past submissions match your criteria.</p>}
        </div>
      </main>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="sidebar-right">
        <div className="metrics-card">
          <h3 className="metric-title">Performance Metrics</h3>
          
          <div className="metric-item">
            <div className="m-icon" style={{ background: "#d1fae5", color: "#059669" }}><AlertTriangle size={20} /></div>
            <div className="m-info">
              <h5>ACTIVE REPORTS</h5>
              <span className="m-val">{activeCount}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="m-icon" style={{ background: "#e2e8f0", color: "#475569" }}><CheckCircle2 size={20} /></div>
            <div className="m-info">
              <h5>RESOLVED ALL TIME</h5>
              <span className="m-val">{resolvedCount}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="m-icon" style={{ background: "#fee2e2", color: "#b91c1c" }}><Clock size={20} /></div>
            <div className="m-info">
              <h5>AVG. RESOLUTION TIME</h5>
              <span className="m-val">3.2</span><span className="m-sub">Days</span>
            </div>
          </div>
        </div>

        <div className="community-card">
          <span className="cf-tag">COMMUNITY FOCUS</span>
          <h3>How your reports shape our city.</h3>
          <p>
            In the last 30 days, 85% of citizen reports in your neighborhood were resolved within 48 hours. Thank you for contributing to a better community!
          </p>
          <button className="btn-learn">Learn More</button>
        </div>

        <h3 className="metric-title" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>RESOURCES</h3>
        <div className="resources-list">
          <a href="#" className="res-link">Submission Guidelines <ExternalLink size={14} /></a>
          <a href="#" className="res-link">Contact City Hall <ExternalLink size={14} /></a>
          <a href="#" className="res-link">FAQs <ExternalLink size={14} /></a>
        </div>
      </aside>
    </div>
  );
};

export default MyComplaints;
