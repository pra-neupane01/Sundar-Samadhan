import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  Search, Filter, PenLine, Clock, CheckCircle2,
  AlertCircle, ClipboardX, Eye, Hash
} from "lucide-react";
import "./MyComplaints.css";

const StatusBadge = ({ status }) => {
  const map = {
    pending:    { cls: "badge badge-pending",    dot: "#f59e0b", label: "Pending" },
    processing: { cls: "badge badge-processing", dot: "#3b82f6", label: "In Progress" },
    resolved:   { cls: "badge badge-resolved",   dot: "#10b981", label: "Resolved" },
  };
  const s = map[status?.toLowerCase()] || { cls: "badge badge-default", dot: "#94a3b8", label: status };
  return (
    <span className={s.cls}>
      <span className="badge-dot" style={{ background: s.dot }}></span>
      {s.label}
    </span>
  );
};

const MyComplaints = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterStatus, setFilter] = useState("all");

  useEffect(() => {
    api.get("/complaints/my-complaints", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data.success) setComplaints(r.data.complaint || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const total     = complaints.length;
  const pending   = complaints.filter(c => c.status === "pending").length;
  const resolved  = complaints.filter(c => c.status === "resolved").length;
  const inProgress = complaints.filter(c => c.status === "processing").length;

  const filtered = complaints.filter(c => {
    const match = c.title.toLowerCase().includes(search.toLowerCase()) ||
                  c.category?.toLowerCase().includes(search.toLowerCase());
    const byStatus = filterStatus === "all" || c.status.toLowerCase() === filterStatus;
    return match && byStatus;
  });

  return (
    <div className="page-shell">
      <div className="content-container">

        {/* Header */}
        <div className="page-header-row" style={{ marginBottom: "32px" }}>
          <div>
            <h1 className="page-title">My Complaints</h1>
            <p className="page-subtitle">Track all issues you've reported to the municipality.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/citizen/complaint/create")}>
            <PenLine size={18} /> New Complaint
          </button>
        </div>

        {/* Mini Stats */}
        <div className="mc-stats-row">
          <div className="mc-mini-stat">
            <span className="mc-mini-val">{total}</span>
            <span className="mc-mini-lbl">Total Filed</span>
          </div>
          <div className="mc-mini-stat mc-yellow">
            <span className="mc-mini-val" style={{ color: "#92400e" }}>{pending}</span>
            <span className="mc-mini-lbl">Pending</span>
          </div>
          <div className="mc-mini-stat mc-blue">
            <span className="mc-mini-val" style={{ color: "#1d4ed8" }}>{inProgress}</span>
            <span className="mc-mini-lbl">In Progress</span>
          </div>
          <div className="mc-mini-stat mc-green">
            <span className="mc-mini-val" style={{ color: "#065f46" }}>{resolved}</span>
            <span className="mc-mini-lbl">Resolved</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Records */}
        {loading ? (
          <div className="loading-spinner-v2"><div className="spinner-ring"></div><p>Loading your complaints…</p></div>
        ) : filtered.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Ward</th>
                  <th>Date Filed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.complaint_id} className="data-table-row-clickable" onClick={() => {}}>
                    <td style={{ color: "#94a3b8", fontWeight: 600, width: "50px" }}>#{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.93rem" }}>{c.title}</div>
                      {c.description && (
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600 }}>
                        {c.category || "General"}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b", fontSize: "0.87rem" }}>
                        <Hash size={13} /> Ward {c.ward_number}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.87rem" }}>
                      {new Date(c.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-v2">
            <div className="empty-icon">
              {search || filterStatus !== "all" ? <Filter size={36} /> : <ClipboardX size={36} />}
            </div>
            <h3>{search || filterStatus !== "all" ? "No matches found" : "No complaints yet"}</h3>
            <p>
              {search || filterStatus !== "all"
                ? "Try a different search term or remove the status filter."
                : "You haven't filed any complaints yet. Click below to get started."}
            </p>
            {!search && filterStatus === "all" && (
              <button className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}
                onClick={() => navigate("/citizen/complaint/create")}>
                <PenLine size={16} /> File Your First Complaint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
