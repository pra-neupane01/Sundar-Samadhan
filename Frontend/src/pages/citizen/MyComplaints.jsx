import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
  Search, Bell, Settings, LayoutDashboard, FileText, Map as MapIcon, Megaphone,
  Building2, HelpCircle, Plus, CheckCircle2, CircleDashed, Check,
  Clock, AlertTriangle, Trash2, Shield, ArrowRight, ExternalLink,
  ShieldAlert, Edit3 as Pencil, X, UploadCloud, History
} from "lucide-react";
import "../../components/DashboardLayout.css";

const MyComplaints = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    description: "",
    ward_number: "",
    address: ""
  });
  const [editFile, setEditFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingComplaint, setDeletingComplaint] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = [
    "Roads & Infrastructure",
    "Water & Sanitation",
    "Electricity & Power",
    "Waste Management",
    "Public Services",
    "Other",
  ];

  useEffect(() => {
    api.get(`/complaints/my-complaints?limit=all`, { headers: { Authorization: `Bearer ${token}` } })
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

  const handleDelete = async () => {
    if (!deletingComplaint) return;
    setIsDeleting(true);
    try {
      const id = deletingComplaint.complaint_id;
      const res = await api.delete(`/complaints/delete-my-complaint/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Complaint deleted successfully");
        setComplaints(prev => prev.filter(c => c.complaint_id !== id));
        if (selectedComplaintId === id) setSelectedComplaintId(null);
        setIsDeleteModalOpen(false);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete complaint");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (complaint) => {
    setDeletingComplaint(complaint);
    setIsDeleteModalOpen(true);
  };


  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setEditFormData({
      title: complaint.title,
      category: complaint.category,
      description: complaint.description,
      ward_number: complaint.ward_number,
      address: complaint.address || ""
    });
    setEditFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach(key => {
        data.append(key, editFormData[key]);
      });
      if (editFile) data.append("image", editFile);

      const res = await api.put(`/complaints/update-complaint/${editingComplaint.complaint_id}`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        }
      });

      if (res.data.success) {
        toast.success("Complaint updated successfully");
        setComplaints(prev => prev.map(c => c.complaint_id === editingComplaint.complaint_id ? res.data.complaint : c));
        setIsEditModalOpen(false);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update complaint");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="dashboard-shell">
      <Toaster position="top-right" />
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
          <div className="nav-item" onClick={() => navigate("/citizen/announcements")}>
            <Megaphone size={20} /> 
            Announcements
          </div>
          <div className="nav-item" onClick={() => navigate("/citizen/map")}>
            <MapIcon size={20} />
            Community Map
          </div>
          <div className="nav-item" onClick={() => navigate("/citizen/donations")}>
            <History size={20} />
            Donation History
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

        <div style={{ marginBottom: "24px", position: "relative" }}>
          <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input 
            type="text" 
            placeholder="Search reports by title..." 
            className="form-control" 
            style={{ paddingLeft: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", width: "100%", height: "48px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button className={`pill ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`pill ${filterStatus === 'processing' ? 'active' : ''}`} onClick={() => setFilter('processing')}>In Progress</button>
          <button className={`pill ${filterStatus === 'resolved' ? 'active' : ''}`} onClick={() => setFilter('resolved')}>Resolved</button>
        </div>

        {activeReport && (
          <div className="active-report-card">
            <div className="ar-header">
              <div style={{ flex: 1 }}>
                <div className="ar-tag">ACTIVE REPORT</div>
                <h2 className="ar-title">#SS-{(activeReport.id || activeReport.complaint_id).toString().substring(0, 6).toUpperCase()}: {activeReport.title}</h2>
                <div className="ar-date">Submitted on {new Date(activeReport.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                <span className="pill" style={{ background: "#e2e8f0", color: "#475569", borderRadius:"8px", fontSize:"0.8rem", textTransform: "capitalize" }}>
                    {activeReport.status === 'processing' ? 'In Progress' : activeReport.status}
                </span>
                
                {activeReport.status === 'pending' && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                        onClick={() => openEditModal(activeReport)}
                        className="btn-icon-ar edit" title="Edit Report">
                        <Pencil size={16} />
                    </button>
                    <button 
                        onClick={() => openDeleteModal(activeReport)}
                        className="btn-icon-ar delete" title="Delete Report">
                        <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
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

      {/* ── EDIT MODAL ── */}
      {isEditModalOpen && (
          <div className="modal-overlay">
              <div className="modal-card">
                  <div className="modal-header">
                      <h3>Edit Complaint</h3>
                      <button className="btn-close" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleUpdate} className="modal-form">
                      <div className="form-group">
                          <label>Title</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editFormData.title} 
                            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                            required
                          />
                      </div>
                      <div className="form-row">
                          <div className="form-group">
                              <label>Category</label>
                              <select 
                                className="form-control" 
                                value={editFormData.category} 
                                onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                                required
                              >
                                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                          </div>
                          <div className="form-group">
                              <label>Ward</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={editFormData.ward_number} 
                                onChange={(e) => setEditFormData({...editFormData, ward_number: e.target.value})}
                                required
                              />
                          </div>
                      </div>
                      <div className="form-group">
                          <label>Address</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editFormData.address} 
                            onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                            required
                          />
                      </div>
                      <div className="form-group">
                          <label>Description</label>
                          <textarea 
                            className="form-control" 
                            rows="4"
                            value={editFormData.description} 
                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                            required
                          />
                      </div>
                      <div className="form-group">
                          <label>Update Photo</label>
                          <div className="modal-upload">
                              <input type="file" id="edit-img" hidden onChange={(e) => setEditFile(e.target.files[0])} />
                              <label htmlFor="edit-img">
                                <UploadCloud size={20} />
                                <span>{editFile ? editFile.name : "Choose new photo"}</span>
                              </label>
                          </div>
                      </div>
                      <div className="modal-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                          <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                              {isUpdating ? "Saving..." : "Save Changes"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      
      {/* ── DELETE CONFIRMATION MODAL ── */}
      {isDeleteModalOpen && (
          <div className="modal-overlay">
              <div className="modal-card" style={{ maxWidth: "450px" }}>
                  <div className="modal-header">
                      <h3>Confirm Deletion</h3>
                      <button className="btn-close" onClick={() => setIsDeleteModalOpen(false)}><X size={20} /></button>
                  </div>
                  <div className="modal-body" style={{ padding: "24px", textAlign: "center" }}>
                      <div style={{ width: "64px", height: "64px", background: "#fef2f2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <Trash2 size={32} />
                      </div>
                      <h4 style={{ fontSize: "1.1rem", marginBottom: "8px", color: "#1e293b" }}>Are you sure?</h4>
                      <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                          This will permanently delete the report <strong>"{deletingComplaint?.title}"</strong>. This action cannot be reversed.
                      </p>
                  </div>
                  <div className="modal-footer" style={{ padding: "16px 24px", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                      <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</button>
                      <button 
                        className="btn btn-primary" 
                        style={{ background: "#ef4444", borderColor: "#ef4444" }} 
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                          {isDeleting ? "Deleting..." : "Delete Permanently"}
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      <style>{`
          .btn-icon-ar {
              width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e2e8f0;
              display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
              background: white;
          }
          .btn-icon-ar.edit { color: var(--brand-primary); }
          .btn-icon-ar.edit:hover { background: #eff6ff; border-color: #3b82f6; }
          .btn-icon-ar.delete { color: #ef4444; }
          .btn-icon-ar.delete:hover { background: #fef2f2; border-color: #ef4444; }

          .modal-overlay {
              position: fixed; top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
              display: flex; align-items: center; justify-content: center; z-index: 1000;
              padding: 20px;
          }
          .modal-card {
              background: white; width: 100%; max-width: 550px; border-radius: 16px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;
              animation: modalSlide 0.3s ease-out;
          }
          @keyframes modalSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

          .modal-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
          .modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
          .btn-close { background: transparent; border: none; color: #94a3b8; cursor: pointer; }

          .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
          .form-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
          .modal-upload label {
              display: flex; align-items: center; gap: 10px; padding: 12px; border: 2px dashed #e2e8f0;
              border-radius: 8px; cursor: pointer; color: #64748b; font-size: 0.9rem;
          }
          .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
      `}</style>
    </div>
    </>
  );
};

export default MyComplaints;
