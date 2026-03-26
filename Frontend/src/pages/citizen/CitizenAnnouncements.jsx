import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { 
  Megaphone, Clock, MapPin, Search, Filter, 
  ArrowLeft, LayoutDashboard, FileText, HelpCircle, 
  Plus, Shield, ShieldAlert, ImageIcon, Calendar, History
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../components/DashboardLayout.css";

const CitizenAnnouncements = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            let endpoint = "/announcements/get-announcements";
            if (user?.ward_number) {
                endpoint = `/announcements/get-announcements-ward/${user.ward_number}`;
            }
            const res = await api.get(endpoint);
            if (res.data.success) {
                setAnnouncements(res.data.announcements || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [user?.ward_number]);

    const filtered = announcements.filter(ann => 
        ann.title.toLowerCase().includes(search.toLowerCase()) || 
        ann.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-shell">
            {/* ── LEFT SIDEBAR ── */}
            <aside className="sidebar-left">
                <div className="brand-section" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
                    <div className="brand-name">City of Progress</div>
                    <div className="portal-type">CITIZEN PORTAL</div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard size={20} /> Overview
                    </div>
                    <div className="nav-item" onClick={() => navigate("/citizen/complaints")}>
                        <FileText size={20} /> My Reports
                    </div>
                    <div className="nav-item active">
                        <Megaphone size={20} fill="#d1fae5" /> Announcements
                    </div>
                    <div className="nav-item" onClick={() => navigate("/citizen/map")}>
                        <MapPin size={20} /> Community Map
                    </div>
                    <div className="nav-item" onClick={() => navigate("/citizen/donations")}>
                        <History size={20} /> Donation History
                    </div>
                </nav>

                <div className="sidebar-bottom">
                    <button className="btn-new-report" onClick={() => navigate("/citizen/complaint/create")}>
                        <Plus size={20} strokeWidth={3} /> New Report
                    </button>
                    <div className="legal-links">
                        <div className="legal-link"><Shield size={14} /> Privacy</div>
                        <div className="legal-link"><ShieldAlert size={14} /> Terms</div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="main-content">
                <div style={{ marginBottom: "40px" }}>
                    <div className="ar-tag" style={{ color: "var(--brand-primary)", fontWeight: 800 }}>COMMUNITY UPDATES</div>
                    <h1 className="ar-title" style={{ fontSize: "2.5rem" }}>Public Announcements</h1>
                    <p style={{ color: "#64748b", marginTop: "8px" }}>Stay informed about ward notices, infrastructure updates, and city events.</p>
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input 
                            type="text" 
                            placeholder="Search notices..." 
                            className="form-control" 
                            style={{ paddingLeft: "48px", borderRadius: "14px", height: "50px", border: "1px solid #e2e8f0", background: "white" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                <div style={{ display: "flex", gap: "16px", marginBottom: "32px", overflowX: "auto", paddingBottom: "8px" }}>
                    {["All Notices", "Infrastructure", "Healthcare", "Community Events", "Emergency"].map(cat => (
                        <button 
                            key={cat}
                            className={`pill ${search.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                            style={{ 
                                whiteSpace: "nowrap", border: "1px solid #e2e8f0", background: "white", 
                                color: "#64748b", padding: "8px 20px", borderRadius: "100px", fontWeight: 700, 
                                fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" 
                            }}
                            onClick={() => cat === "All Notices" ? setSearch("") : setSearch(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                        <div className="loader-spinner"></div>
                        <p style={{ marginTop: "16px" }}>Fetching latest updates...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="ann-feed-grid">
                        {filtered.map((ann) => (
                            <div key={ann.announcement_id} className="ann-post-card">
                                {ann.image_url && (
                                    <div className="ann-card-image">
                                        <img src={`http://localhost:4849${ann.image_url}`} alt={ann.title} onError={(e) => e.target.style.display='none'} />
                                    </div>
                                )}
                                <div className="ann-card-body">
                                    <div className="ann-card-meta">
                                        <span className="ann-category-tag">
                                            {ann.ward_number ? `Ward ${ann.ward_number}` : "General Notice"}
                                        </span>
                                        <span className="ann-date-tag">
                                            <Calendar size={14} /> {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="ann-post-title">{ann.title}</h3>
                                    <p className="ann-post-content">{ann.content}</p>
                                    <div className="ann-card-footer">
                                        <div className="post-time">
                                            <Clock size={12} /> {new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-notice">
                        <Megaphone size={48} color="#e2e8f0" />
                        <h3>No recent announcements</h3>
                        <p>Things are quiet in Ward {user?.ward_number || "Sundar"}. Check back later for updates.</p>
                    </div>
                )}
            </main>

            <style>{`
                .ann-feed-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                    gap: 24px;
                }
                @media (max-width: 768px) { .ann-feed-grid { grid-template-columns: 1fr; } }

                .ann-post-card {
                    background: white; border-radius: 20px; overflow: hidden;
                    border: 1px solid #f1f5f9; transition: all 0.3s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    display: flex; flex-direction: column;
                }
                .ann-post-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #dbeafe; }

                .ann-card-image { width: 100%; height: 200px; overflow: hidden; border-bottom: 1px solid #f1f5f9; }
                .ann-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
                .ann-post-card:hover .ann-card-image img { transform: scale(1.05); }

                .ann-card-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
                .ann-card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .ann-category-tag { font-size: 0.7rem; font-weight: 800; color: var(--brand-primary); background: #ecfdf5; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
                .ann-date-tag { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #94a3b8; font-weight: 600; }

                .ann-post-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.3; }
                .ann-post-content { font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

                .ann-card-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .author-info { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: #334155; }
                .author-avatar { width: 24px; height: 24px; background: #e0f2fe; color: #0369a1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; }
                .post-time { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #94a3b8; }

                .empty-state-notice { text-align: center; padding: 100px 20px; background: #f8fafc; border-radius: 24px; border: 2px dashed #e2e8f0; }
                .empty-state-notice h3 { font-size: 1.25rem; color: #1e293b; margin: 16px 0 8px; }
                .empty-state-notice p { color: #64748b; }
                
                .loader-spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid var(--brand-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CitizenAnnouncements;
