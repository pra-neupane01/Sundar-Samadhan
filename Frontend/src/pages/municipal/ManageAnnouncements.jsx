import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Megaphone, Send, Image as ImageIcon, ClipboardList, Trash2 } from "lucide-react";
import "./ManageAnnouncements.css";

const ManageAnnouncements = () => {
  const { token, user } = useContext(AuthContext);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    ward_number: user?.ward_number || "all",
    image: null,
  });

  const fetchAnnouncements = async () => {
    try {
      setFetching(true);
      let endpoint = "/announcements/get-announcements";
      if (user?.role === "citizen" && user?.ward_number) {
        endpoint = `/announcements/get-announcements-ward/${user.ward_number}`;
      }
      const res = await api.get(endpoint);
      if (res.data.success) {
        setAnnouncements(res.data.announcements || []);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await api.delete(`/announcements/delete-announcement/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Announcement deleted successfully!");
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      return toast.error("Title and Content are required.");
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      if (formData.ward_number !== "all") {
        data.append("ward_number", formData.ward_number);
      }
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await api.post("/announcements/create-announcements", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Announcement posted successfully!");
        setFormData({
          title: "",
          content: "",
          ward_number: user?.ward_number || "all",
          image: null,
        });
        document.getElementById("image-upload").value = "";
        fetchAnnouncements(); // Refresh list
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error(error.response?.data?.message || "Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-announcements-page">
      <Toaster position="top-right" />
      {/* Navbar */}
      <nav className="dashboard-navbar" style={{ padding: "0 2rem", minHeight: "72px" }}>
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span><span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan</span>
        </div>
        <div className="navbar-user-section">
          <Link to={user?.role === "citizen" ? "/dashboard" : "/municipal"} className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="announcements-content">
        {/* POST FORM - Only for Municipal/Admin */}
        {(user?.role === "municipal" || user?.role === "admin") && (
          <div className="form-card">
            <div className="card-header">
              <Megaphone size={24} className="header-icon" />
              <h2>Post Announcement</h2>
            </div>
            
            <form className="announcement-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Announcement Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Water Supply Interruption on Monday"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Details *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Provide details about the announcement..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ward_number">Target Audience</label>
                <select
                  id="ward_number"
                  name="ward_number"
                  value={formData.ward_number}
                  onChange={handleChange}
                >
                  <option value="all">All Wards (Public)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                    <option key={w} value={w}>Ward {w} Only</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Attach Image (Optional)</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner"></div> : (
                  <>
                    <Send size={18} style={{ marginRight: '8px' }} />
                    Post Announcement
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* RECENT ANNOUNCEMENTS */}
        <div className="list-card" style={{ width: (user?.role === "municipal" || user?.role === "admin") ? "" : "100%", maxWidth: (user?.role === "municipal" || user?.role === "admin") ? "" : "800px", margin: (user?.role === "municipal" || user?.role === "admin") ? "" : "0 auto" }}>
          <div className="card-header">
            <ClipboardList size={24} className="header-icon" />
            <h2>Recent Announcements</h2>
          </div>
          
          <div className="announcements-list">
            {fetching ? (
              <div className="empty-state">
                <div className="spinner" style={{ borderColor: '#cbd5e1', borderTopColor: '#3b82f6' }}></div>
                <p>Loading announcements...</p>
              </div>
            ) : announcements.length > 0 ? (
              announcements.map(announcement => (
                <div key={announcement.announcement_id} className="announcement-item">
                  <div className="announcement-item-header">
                    <div>
                      <h3 className="announcement-item-title">{announcement.title}</h3>
                      <div className="announcement-item-meta">
                        <span>
                          {new Date(announcement.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                        {announcement.ward_number ? (
                          <span className="badge-ward">Ward {announcement.ward_number}</span>
                        ) : (
                          <span className="badge-ward" style={{ background: '#dcfce7', color: '#166534' }}>All Wards</span>
                        )}
                      </div>
                    </div>
                    {(user?.role === "admin" || announcement.created_by === user?.id) && (
                      <button 
                        onClick={() => handleDelete(announcement.announcement_id)}
                        className="delete-btn-rounded"
                        title="Delete Announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="announcement-item-content">{announcement.content}</p>
                  {announcement.image_url && (
                    <img 
                      src={`http://localhost:4849${announcement.image_url}`} 
                      alt="Announcement" 
                      className="announcement-item-image" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Megaphone size={48} color="#cbd5e1" />
                <p>No announcements have been posted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
