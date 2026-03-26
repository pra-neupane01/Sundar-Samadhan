import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import "./WardComplaints.css";

const WardComplaints = () => {
  const { token, user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedWard, setSelectedWard] = useState(user?.role === "municipal" ? user.ward_number : "all");
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWardComplaints = async () => {
      try {
        setLoading(true);
        let endpoint = `/complaints/get-all-complaints?page=${page}&limit=10`;
        if (selectedWard !== "all") {
          endpoint = `/complaints/get-complaints-by-ward/${selectedWard}?page=${page}&limit=10`;
        }
        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setComplaints(response.data.complaint || []);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchWardComplaints();
    }
  }, [token, selectedWard, page]);

  // Real-time Socket Listener
  useEffect(() => {
    if (!socket) return;
    const handleNewComplaint = (data) => {
      // Refresh list to show new complaint if it matches filter
      if (selectedWard === "all" || Number(selectedWard) === Number(data.ward_number)) {
        if (token) {
          api.get(selectedWard === "all" ? `/complaints/get-all-complaints?page=${page}&limit=10` : `/complaints/get-complaints-by-ward/${selectedWard}?page=${page}&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => {
            if (res.data.success) {
              setComplaints(res.data.complaint || []);
              setTotalPages(res.data.totalPages || 1);
            }
          }).catch(err => console.error("Error refreshing complaints on socket event", err));
        }
      }
    };
    socket.on("newWardComplaint", handleNewComplaint);
    return () => socket.off("newWardComplaint", handleNewComplaint);
  }, [socket, selectedWard, token, page]);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    try {
      const response = await api.put(
        `/complaints/update-status/${complaintId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Complaint status updated to ${newStatus}`);
        setComplaints((prev) =>
          prev.map((c) => (c.complaint_id === complaintId ? { ...c, status: newStatus } : c))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending:    "badge badge-pending",
      processing: "badge badge-processing",
      resolved:   "badge badge-resolved",
    };
    return map[status?.toLowerCase()] || "badge badge-default";
  };

  const getStatusDot = (status) => {
    const dots = { pending: "#f59e0b", processing: "var(--brand-secondary)", resolved: "#10b981" };
    return dots[status?.toLowerCase()] || "#94a3b8";
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock size={14} />;
      case "processing": return <AlertCircle size={14} />;
      case "resolved": return <CheckCircle2 size={14} />;
      default: return null;
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(searchTermLower) || 
                          c.category?.toLowerCase().includes(searchTermLower) ||
                          c.status.toLowerCase().includes(searchTermLower);
    const matchesFilter = filterStatus === "all" || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-shell">
      <Toaster position="top-right" />

      <div className="content-container">
        <div className="complaints-container">
          <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "28px" }}>
            <div className="flex-center gap-4">
              <button 
                className="btn btn-ghost btn-icon" 
                onClick={() => navigate("/municipal")}
                style={{ borderRadius: "10px", width: "40px", height: "40px" }}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="header-text">
                <h1 className="page-title" style={{ marginBottom: 0 }}>
                  {selectedWard !== "all" ? `Ward ${selectedWard} Complaints` : "All Complaints Dashboard"}
                </h1>
                <p className="page-subtitle">Track and update active community issues.</p>
              </div>
            </div>
            
            <div className="ward-filter">
              <select
                value={selectedWard}
                onChange={(e) => { setSelectedWard(e.target.value); setPage(1); }}
                className="filter-select"
              >
                <option value="all">All Wards</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                  <option key={w} value={w}>Ward {w}</option>
                ))}
              </select>
            </div>
          </header>

          <div className="toolbar" style={{ marginTop: "20px" }}>
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by title or category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ minWidth: "160px" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="data-table-wrapper" style={{ marginTop: "24px" }}>
            {loading ? (
              <div className="loading-spinner-v2">
                <div className="spinner-ring"></div>
                <p>Loading complaints...</p>
              </div>
            ) : filteredComplaints.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Complaint Details</th>
                    <th>Date Filed</th>
                    <th>Ward</th>
                    <th>Citizen</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => {
                    const isOverdue = complaint.status === "pending" && 
                      (Date.now() - new Date(complaint.created_at).getTime()) > 3 * 24 * 60 * 60 * 1000;

                    return (
                      <tr key={complaint.complaint_id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 700, color: "#1e293b" }}>
                              {complaint.title}
                              {complaint.image_url && <ImageIcon size={14} style={{ marginLeft: '8px', color: 'var(--brand-secondary)' }} title="Has Evidence Image" />}
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{complaint.category || "General"}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: "#475569", fontSize: "0.87rem" }}>
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </span>
                          {isOverdue && (
                            <div style={{ marginTop: '4px' }}>
                                <span className="badge badge-urgent">Overdue</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="badge-ward" style={{ fontWeight: 700, color: 'var(--brand-secondary)', background: "var(--surface-base)" }}>
                            Ward {complaint.ward_number}
                          </span>
                        </td>
                        <td>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{complaint.created_by?.split("-")[0]}...</span>
                        </td>
                        <td>
                          <span className={getStatusBadge(complaint.status)}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button 
                              className="btn btn-ghost btn-sm btn-icon" 
                              title="View Details"
                              onClick={() => { setViewComplaint(complaint); setShowModal(true); }}
                            >
                              <Eye size={18} />
                            </button>
                            <select 
                              className="filter-select"
                              style={{ padding: "6px 24px 6px 12px", fontSize: "0.8rem", minWidth: "120px" }}
                              value={complaint.status}
                              onChange={(e) => handleStatusUpdate(complaint.complaint_id, e.target.value)}
                              disabled={updatingId === complaint.complaint_id || complaint.status === 'resolved'}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state-v2" style={{ border: "none" }}>
                <div className="empty-icon"><AlertCircle size={32} /></div>
                <h3>No complaints found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
            
            {filteredComplaints.length > 0 && totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", gap: "10px" }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Page <strong style={{color:"#0f172a"}}>{page}</strong> of <strong style={{color:"#0f172a"}}>{totalPages}</strong>
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && viewComplaint && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                 <span className={getStatusBadge(viewComplaint.status)}>
                    {getStatusIcon(viewComplaint.status)} {viewComplaint.status}
                 </span>
                 <h3>{viewComplaint.title}</h3>
              </div>
              <button 
                className="btn btn-ghost btn-icon" 
                onClick={() => setShowModal(false)}
                style={{ borderRadius: "50%" }}
              ><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Description</div>
                <p style={{ color: "#475569", lineHeight: 1.6 }}>{viewComplaint.description}</p>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Category</div>
                  <span className="badge badge-default">{viewComplaint.category || "General"}</span>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Ward Number</div>
                  <span className="badge badge-processing">Ward {viewComplaint.ward_number}</span>
                </div>
                <div>
                   <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Submission Date</div>
                   <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "#475569" }}>
                        <Clock size={16} /> {new Date(viewComplaint.created_at).toLocaleString()}
                   </div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Location & Map</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <MapPin size={18} className="text-blue-500" />
                  <span style={{ fontSize: "0.9rem", color: "#1e293b", fontWeight: 600 }}>{viewComplaint.address || "No address provided"}</span>
                </div>
              </div>

              {viewComplaint.image_url && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Evidence Photo</div>
                  <img 
                    src={`http://localhost:4849${viewComplaint.image_url}`} 
                    alt="Complaint Evidence" 
                    style={{ width: "100%", borderRadius: "14px", border: "1px solid #e2e8f0", maxHeight: "300px", objectFit: "cover" }}
                    onError={(e) => e.target.style.display='none'}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WardComplaints;
