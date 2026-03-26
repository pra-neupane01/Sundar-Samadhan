import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Megaphone, Send, Image as ImageIcon, ClipboardList, Trash2, Pencil, X, Check, Clock, ArrowLeft, LayoutDashboard, FileText, Settings, Search, Bell, Plus, Filter, MoreVertical, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../components/DashboardLayout.css";
import "./ManageAnnouncements.css";

const ManageAnnouncements = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "", content: "",
    ward_number: user?.ward_number || "all",
    image: null,
  });

  const fetchAnnouncements = async () => {
    try {
      setFetching(true);
      let endpoint = "/announcements/get-announcements";
      if (user?.role === "citizen" && user?.ward_number) endpoint = `/announcements/get-announcements-ward/${user.ward_number}`;
      const res = await api.get(endpoint);
      if (res.data.success) {
        setAnnouncements(res.data.announcements || []);
      }
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }));

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await api.delete(`/announcements/delete-announcement/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { toast.success("Announcement deleted!"); fetchAnnouncements(); }
    } catch (e) { toast.error("Failed to delete announcement"); }
  };

  const startEdit = (ann) => {
    setEditingId(ann.announcement_id);
    setFormData({ title: ann.title, content: ann.content, ward_number: ann.ward_number || "all", image: null });
    setShowModal(true);
  };

  const cancelEdit = () => { 
    setEditingId(null); 
    setFormData({ title: "", content: "", ward_number: user?.ward_number || "all", image: null }); 
    setShowModal(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error("Title and Content are required.");
    setLoading(true);

    try {
      if (editingId) {
        // UPDATE
        const updateData = { title: formData.title, content: formData.content, ward_number: formData.ward_number === "all" ? null : formData.ward_number };
        const res = await api.put(`/announcements/update-announcement/${editingId}`, updateData, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          toast.success("Announcement updated!");
          cancelEdit();
          fetchAnnouncements();
        }
      } else {
        // CREATE
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        if (formData.ward_number !== "all") data.append("ward_number", formData.ward_number);
        if (formData.image) data.append("image", formData.image);
        const res = await api.post("/announcements/create-announcements", data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          toast.success("Announcement posted!");
          cancelEdit();
          fetchAnnouncements();
        }
      }
    } catch (e) { toast.error(e.response?.data?.message || "Failed to save announcement"); }
    finally { setLoading(false); }
  };

  const canManage = user?.role === "municipal" || user?.role === "admin";

  return (
    <div className="dashboard-shell" style={{ backgroundColor: "#f8f9fa" }}>
      <Toaster position="top-right" />
      
      {/* ── LEFT SIDEBAR ── */}
      <aside className="sidebar-left">
        <div className="brand-section" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 40, height: 40, background: "#004d34", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>A</span>
          </div>
          <div>
            <div className="brand-name" style={{ fontSize: "1.1rem" }}>{user?.role === 'admin' ? 'Admin Center' : 'Municipal Center'}</div>
            <div className="portal-type" style={{ fontSize: "0.65rem" }}>CITY OF SUNDAR</div>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: "32px", flex: 1 }}>
          <div className="nav-item" onClick={() => navigate(user?.role === 'admin' ? "/admin/dashboard" : "/municipal/dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="nav-item active" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "12px", color: "var(--brand-primary)" }}>
            <Megaphone size={20} /> Announcements
          </div>
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{ maxWidth: "1200px", padding: "32px 48px" }}>
        
        {/* Page Title & Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <div className="ar-tag" style={{ color: "var(--brand-primary)", fontWeight: 800, letterSpacing: "2px" }}>MANAGEMENT PORTAL</div>
            <h1 className="ar-title" style={{ fontSize: "2.5rem", marginBottom: "12px" }}>Announcements</h1>
            <p style={{ color: "#475569", fontSize: "1rem", maxWidth: "600px", lineHeight: 1.5 }}>
              Broadcast critical updates, infrastructure notices, and public safety alerts to the citizens of Sundar Samadhan.
            </p>
          </div>
          {canManage && (
            <button className="btn-new-report" onClick={() => { setEditingId(null); setFormData({ title: "", content: "", ward_number: user?.ward_number || "all", image: null }); setShowModal(true); }} style={{ width: "auto", padding: "12px 24px", gap: "12px", background: "var(--brand-primary)" }}>
              <Plus size={18} strokeWidth={3} /> Create New Announcement
            </button>
          )}
        </div>

        {/* Metrics Row */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
          <div style={{ flex: 2, background: "var(--brand-primary)", borderRadius: "24px", padding: "32px", color: "white", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em" }}>TOTAL REACH</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "6px 12px", background: "rgba(255,255,255,0.1)", borderRadius: "99px" }}>+12% from last week</span>
            </div>
            <div style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "32px" }}>42.8k</div>
            {/* Faux Bar Chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "60px", opacity: 0.8 }}>
              {[40, 50, 60, 75, 55, 80, 65].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: "rgba(255,255,255,0.2)", borderRadius: "4px 4px 0 0" }}></div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, background: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-primary)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "24px" }}>
              <Megaphone size={16} /> ENGAGEMENT
            </div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>84%</div>
            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "auto" }}>Average citizen response rate to safety alerts this month.</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
              <div style={{ display: "flex" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e2e8f0", border: "2px solid white", marginLeft: "-8px" }}></div>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#cbd5e1", border: "2px solid white", marginLeft: "-8px" }}></div>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#94a3b8", border: "2px solid white", marginLeft: "-8px" }}></div>
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--brand-primary)", cursor: "pointer" }}>View insights</span>
            </div>
          </div>
        </div>

        {/* Announcements Table Layout */}
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr 1fr 80px", padding: "16px 24px", background: "#f8f9fa", borderBottom: "1px solid #e2e8f0", fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <div>TITLE</div>
            <div>AUTHOR</div>
            <div>DATE</div>
            <div>CATEGORY</div>
            <div>STATUS</div>
            <div style={{ textAlign: "center" }}>ACTIONS</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {fetching ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading announcements...</div>
            ) : announcements.length > 0 ? (
              announcements.map((ann) => (
                <div key={ann.announcement_id} style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr 1fr 80px", padding: "24px", borderBottom: "1px solid #f1f5f9", alignItems: "center", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                  
                  {/* Title Col */}
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)", flexShrink: 0 }}>
                      <AlertTriangle size={20} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ann.title}</h4>
                      <p style={{ fontSize: "0.75rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ann.content}
                      </p>
                    </div>
                  </div>

                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#1e293b", fontWeight: 600 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#dbeafe", flexShrink: 0 }}></div>
                    {ann.created_by == user?.id ? "Me" : "Admin Staff"}
                  </div>

                  {/* Date */}
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: 600 }}>{new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>

                  {/* Category Pill */}
                  <div>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "6px 12px", background: "#e0e7ff", color: "#3730a3", borderRadius: "99px", letterSpacing: "0.05em" }}>
                      {ann.ward_number ? `WARD ${ann.ward_number}` : "COMMUNITY"}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "#0f172a" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-primary)" }}></div>
                    Active
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "12px", color: "#94a3b8" }}>
                     <Pencil size={18} style={{ cursor: "pointer" }} onClick={() => startEdit(ann)} />
                     <Trash2 size={18} style={{ cursor: "pointer" }} onClick={() => handleDelete(ann.announcement_id)} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No announcements found.</div>
            )}
          </div>
        </div>

        {/* Pagination placeholder */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
          <div>Showing 1 to {announcements.length} of {announcements.length} announcements</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ width: 36, height: 36, border: "1px solid #e2e8f0", background: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>&lt;</button>
            <button style={{ width: 36, height: 36, background: "var(--brand-primary)", color: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "none" }}>1</button>
            <button style={{ width: 36, height: 36, border: "1px solid #e2e8f0", background: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>2</button>
            <button style={{ width: 36, height: 36, border: "1px solid #e2e8f0", background: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>3</button>
            <button style={{ width: 36, height: 36, border: "1px solid #e2e8f0", background: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>&gt;</button>
          </div>
        </div>
      </main>

      {/* Basic Create/Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
               <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{editingId ? "Update Announcement" : "Create Announcement"}</h3>
               <button onClick={cancelEdit} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="ma-form">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "0.85rem" }}>Title <span className="required">*</span></label>
                  <input className="form-control" type="text" name="title" value={formData.title}
                    onChange={handleChange} placeholder="e.g. Water supply interruption" style={{ padding: "12px", background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: "12px", width: "100%" }} required />
                </div>
                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "0.85rem" }}>Details <span className="required">*</span></label>
                  <textarea className="form-control" name="content" value={formData.content} onChange={handleChange}
                    placeholder="Provide announcement details…" rows="4" style={{ padding: "12px", background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: "12px", width: "100%" }} required />
                </div>
                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "0.85rem" }}>Target Audience</label>
                  <select className="form-control" name="ward_number" value={formData.ward_number} onChange={handleChange} style={{ padding: "12px", background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: "12px", width: "100%" }}>
                    <option value="all">All Wards (Public)</option>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(w => <option key={w} value={w}>Ward {w} Only</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-new-report" disabled={loading} style={{ width: "100%", marginTop: "24px", padding: "14px", background: "var(--brand-primary)" }}>
                  {loading ? (editingId ? "Updating..." : "Posting...") : (editingId ? "Save Changes" : "Broadcast Announcement")}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
