import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, FileText, Map as MapIcon, Megaphone, 
  HelpCircle, Plus, Shield, ShieldAlert, History
} from "lucide-react";
import "../../components/DashboardLayout.css";

const CommunityMap = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <div className="nav-item" onClick={() => navigate("/citizen/complaints")}>
            <FileText size={20} />
            My Reports
          </div>
          <div className="nav-item" onClick={() => navigate("/citizen/announcements")}>
            <Megaphone size={20} />
            Announcements
          </div>
          <div className="nav-item active">
            <MapIcon size={20} fill="#d1fae5" />
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
        <div className="content-container-full" style={{ padding: "0 20px" }}>
            <div style={{ marginBottom: "24px" }}>
                <h1 className="ar-title" style={{ fontSize: "2.2rem" }}>Community Map</h1>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                    Explore reported issues and city developments in Sundarharaicha Municipality, Morang, Nepal.
                </p>
            </div>

            <div className="card" style={{ height: "calc(100vh - 250px)", minHeight: "600px", padding: "0", overflow: "hidden", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57053.84752531649!2d87.31168297053896!3d26.65282436449195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6928e8334417%3A0x633190898687a4a9!2sSundar%20Haraicha!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sundarharaicha Municipality Map"
                />
            </div>
            
            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                <div className="card" style={{ background: "#f8fafc" }}>
                    <h4 style={{ color: "#1e293b", marginBottom: "8px" }}>Map Legend</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Pending Issues</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--brand-secondary)" }}></div>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>In Progress</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></div>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Resolved Projects</span>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <h4 style={{ color: "#166534", marginBottom: "8px" }}>Municipality Info</h4>
                    <p style={{ fontSize: "0.85rem", color: "#15803d" }}>
                        Sundarharaicha is a municipality in Morang District. It remains committed to providing efficient services to all its citizens.
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityMap;
