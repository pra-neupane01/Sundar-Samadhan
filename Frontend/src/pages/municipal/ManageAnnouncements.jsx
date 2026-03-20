import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Megaphone, Send, Image as ImageIcon, ClipboardList, Trash2, Pencil, X, Check, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ManageAnnouncements.css";

const ManageAnnouncements = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

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
      if (res.data.success) setAnnouncements(res.data.announcements || []);
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
    setEditForm({ title: ann.title, content: ann.content });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({ title: "", content: "" }); };

  const handleUpdate = async (id) => {
    if (!editForm.title || !editForm.content) { toast.error("Title and content required."); return; }
    try {
      const res = await api.put(`/announcements/update-announcement/${id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        toast.success("Announcement updated!");
        setEditingId(null);
        fetchAnnouncements();
      }
    } catch (e) { toast.error(e.response?.data?.message || "Failed to update"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error("Title and Content are required.");
    setLoading(true);
    try {
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
        setFormData({ title: "", content: "", ward_number: user?.ward_number || "all", image: null });
        document.getElementById("image-upload").value = "";
        fetchAnnouncements();
      }
    } catch (e) { toast.error(e.response?.data?.message || "Failed to post"); }
    finally { setLoading(false); }
  };

  const canManage = user?.role === "municipal" || user?.role === "admin";

  return (
    <div className="page-shell">
      <Toaster position="top-right" />
      <div className="content-container">

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
            <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} style={{ borderRadius: "10px" }}>
                <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>Announcements Hub</h1>
              <p className="page-subtitle">{canManage ? "Manage communications for your ward" : "Official municipal community updates"}</p>
            </div>
        </div>

        <div className={`ma-layout ${!canManage ? "ma-full" : ""}`}>
          {/* Post Form — Municipal/Admin Only */}
          {canManage && (
            <div className="card ma-form-card">
              <div className="ma-form-header">
                <div className="ma-header-icon"><Megaphone size={20} /></div>
                <h3>Post Announcement</h3>
              </div>

              <form onSubmit={handleSubmit} className="ma-form">
                <div className="form-group">
                  <label className="form-label">Title <span className="required">*</span></label>
                  <input className="form-control" type="text" name="title" value={formData.title}
                    onChange={handleChange} placeholder="e.g. Water supply interruption" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Details <span className="required">*</span></label>
                  <textarea className="form-control" name="content" value={formData.content} onChange={handleChange}
                    placeholder="Provide announcement details…" rows="4" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select className="form-control" name="ward_number" value={formData.ward_number} onChange={handleChange}>
                    <option value="all">All Wards (Public)</option>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(w => <option key={w} value={w}>Ward {w} Only</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Attach Image (Optional)</label>
                  <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange}
                    className="form-control" style={{ padding: "8px" }} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                  {loading ? <span className="auth-spinner" style={{ width: "16px", height: "16px" }}></span> : <><Send size={16} /> Post Announcement</>}
                </button>
              </form>
            </div>
          )}

          {/* Announcement List */}
          <div className="ma-list-col">
            <div className="section-heading" style={{ marginBottom: "16px" }}>
              <ClipboardList size={18} /> Recent Announcements
            </div>

            {fetching ? (
              <div className="loading-spinner-v2"><div className="spinner-ring"></div><p>Loading…</p></div>
            ) : announcements.length > 0 ? (
              <div className="ma-ann-list">
                {announcements.map(ann => (
                  <div key={ann.announcement_id} className="card ma-ann-item">
                    {editingId === ann.announcement_id ? (
                      /* Edit Mode */
                      <div className="ma-edit-form">
                        <input className="form-control" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="Title" style={{ marginBottom: "8px", fontWeight: 600 }} />
                        <textarea className="form-control" value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                          rows="3" placeholder="Content" />
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px", justifyContent: "flex-end" }}>
                          <button className="btn btn-secondary btn-sm" onClick={cancelEdit}><X size={14} /> Cancel</button>
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdate(ann.announcement_id)}><Check size={14} /> Save</button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <div className="ma-ann-header">
                          <div>
                            <h4 className="ma-ann-title">{ann.title}</h4>
                            <div className="ma-ann-meta">
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={12} />
                                {new Date(ann.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                              <span className={`badge ${ann.ward_number ? "badge-processing" : "badge-resolved"}`}>
                                {ann.ward_number ? `Ward ${ann.ward_number}` : "All Wards"}
                              </span>
                            </div>
                          </div>
                          {canManage && (user?.role === "admin" || ann.created_by === user?.id) && (
                            <div className="ma-ann-actions">
                              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(ann)} title="Edit"><Pencil size={15} /></button>
                              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(ann.announcement_id)} title="Delete"
                                style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
                            </div>
                          )}
                        </div>
                        <p className="ma-ann-content">{ann.content}</p>
                        {ann.image_url && (
                          <img src={`http://localhost:4849${ann.image_url}`} alt="Announcement"
                            className="ma-ann-image" onError={(e) => { e.target.style.display = "none"; }} />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-v2">
                <div className="empty-icon"><Megaphone size={36} /></div>
                <h3>No announcements yet</h3>
                <p>No announcements have been posted.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
