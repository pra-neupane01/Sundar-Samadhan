import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { 
  ArrowLeft, MapPin, Clock, Tag, User, 
  CheckCircle2, CircleDashed, AlertCircle, FileText
} from "lucide-react";
import "../../components/DashboardLayout.css";

const ComplaintDetails = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // We reuse the my-complaints endpoint but filter on client side or use a generic one if available
                // For now, let's assume there's a detailed endpoint or we fetch all and find
                const res = await api.get(`/complaints/my-complaints?limit=all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    const found = res.data.complaint.find(c => (c.complaint_id || c.id).toString() === id);
                    setComplaint(found);
                }
            } catch (error) {
                console.error("Error fetching complaint details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) fetchDetails();
    }, [token, id]);

    if (loading) return <div className="loading-state-full">Loading history...</div>;
    if (!complaint) return <div className="error-state-full">Complaint not found.</div>;

    return (
        <div className="dashboard-shell">
            <div className="main-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
                <header style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "20px" }}>
                    <button className="btn-icon-ar" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="ar-title" style={{ fontSize: "2rem" }}>Report History</h1>
                        <p style={{ color: "#64748b" }}>Detailed timeline and information for Ticket #SS-{id.substring(0,6).toUpperCase()}</p>
                    </div>
                </header>

                <div className="card" style={{ padding: "32px", marginBottom: "32px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                        <div className="ar-tag" style={{ background: "var(--brand-primary-light)", color: "var(--brand-primary)" }}>{complaint.category}</div>
                        <span className="pill" style={{ background: "#e2e8f0", color: "#475569", textTransform: "capitalize" }}>{complaint.status}</span>
                    </div>

                    <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "#1e293b" }}>{complaint.title}</h2>
                    <p style={{ color: "#475569", lineHeight: "1.7", marginBottom: "28px", fontSize: "1.05rem" }}>{complaint.description}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", padding: "24px", background: "#f8fafc", borderRadius: "16px" }}>
                        <div className="detail-item">
                            <Tag size={18} color="#64748b" />
                            <div>
                                <div className="detail-label">WARD</div>
                                <div className="detail-val">Ward {complaint.ward_number}</div>
                            </div>
                        </div>
                        <div className="detail-item">
                            <MapPin size={18} color="#64748b" />
                            <div>
                                <div className="detail-label">LOCATION</div>
                                <div className="detail-val">{complaint.address || "Sundarharaicha"}</div>
                            </div>
                        </div>
                        <div className="detail-item">
                            <Clock size={18} color="#64748b" />
                            <div>
                                <div className="detail-label">SUBMITTED</div>
                                <div className="detail-val">{new Date(complaint.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {complaint.image_url && (
                    <div className="card" style={{ padding: "32px", marginBottom: "32px" }}>
                        <h3 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "1.2rem" }}>Evidence Photo</h3>
                        <img 
                            src={`http://localhost:4849${complaint.image_url}`} 
                            alt="Complaint Evidence" 
                            style={{ width: "100%", borderRadius: "16px", border: "1px solid #e2e8f0", maxHeight: "450px", objectFit: "cover" }}
                            onError={(e) => e.target.style.display='none'}
                        />
                    </div>
                )}

                <div className="card" style={{ padding: "32px" }}>
                    <h3 style={{ marginBottom: "24px", color: "#1e293b" }}>Status Timeline</h3>
                    <div className="timeline-stepper" style={{ marginLeft: "10px" }}>
                        <div className="step-line" style={{ left: "15px", background: complaint.status === 'resolved' ? '#059669' : '#e2e8f0' }}></div>
                        
                        <div className="timeline-step">
                            <div className="step-icon bg-green"><CheckCircle2 size={16} /></div>
                            <div className="step-content">
                                <h4>Report Submitted</h4>
                                <p>Initial report focused on {complaint.category} was received by the city portal.</p>
                                <span className="time-sub">{new Date(complaint.created_at).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className={`step-icon ${complaint.status !== 'pending' ? 'bg-green' : 'bg-gray'}`}>
                                {complaint.status !== 'pending' ? <CheckCircle2 size={16} /> : <CircleDashed size={16} />}
                            </div>
                            <div className="step-content">
                                <h4>Department Verified</h4>
                                <p>Municipality staff confirmed the report and assigned it to the Ward {complaint.ward_number} field team.</p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className={`step-icon ${complaint.status === 'processing' || complaint.status === 'resolved' ? 'bg-light-green' : 'bg-gray'}`}>
                                {complaint.status === 'processing' ? <CircleDashed size={16} className="text-emerald-700" /> : <CheckCircle2 size={16} />}
                            </div>
                            <div className="step-content">
                                <h4>Action in Progress</h4>
                                <p>Maintenance crew is actively working on the reported issue.</p>
                            </div>
                        </div>

                        <div className="timeline-step" style={{ paddingBottom: 0 }}>
                            <div className={`step-icon ${complaint.status === 'resolved' ? 'bg-green' : 'bg-gray'}`}>
                                <CheckCircle2 size={16} />
                            </div>
                            <div className="step-content">
                                <h4 style={{ color: complaint.status === 'resolved' ? '#1e293b' : '#94a3b8' }}>Issue Resolved</h4>
                                <p>Works completed and final inspection successful.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .detail-item { display: flex; gap: 12px; align-items: flex-start; }
                .detail-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 2px; }
                .detail-val { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
                .time-sub { font-size: 0.8rem; color: #94a3b8; margin-top: 4px; display: block; }
                .error-state-full, .loading-state-full {
                    display: flex; align-items: center; justify-content: center; height: 300px; color: #64748b;
                }
            `}</style>
        </div>
    );
};

export default ComplaintDetails;
