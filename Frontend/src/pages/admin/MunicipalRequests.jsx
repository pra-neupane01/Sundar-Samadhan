import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { Check, X, FileText, User, Mail, Hash, Calendar, Loader2, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";

const MunicipalRequests = () => {
    const { token } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/municipal-requests", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setRequests(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [token]);

    const handleAction = async (id, status) => {
        const message = status === 'approved' 
            ? "Are you sure you want to APPROVE this user as a Municipal Officer?" 
            : "Are you sure you want to REJECT this request?";
        
        if (!window.confirm(message)) return;

        let adminMessage = "";
        if (status === 'rejected') {
            adminMessage = window.prompt("Reason for rejection (optional):") || "";
        }

        try {
            setActionLoading(id);
            const res = await api.put(`/admin/municipal-requests/${id}`, {
                status,
                admin_message: adminMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`Request ${status} successfully`);
                fetchRequests();
            }
        } catch (error) {
            toast.error("Failed to process request");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="page-shell">
            <Toaster position="top-right" />
            <div className="content-container">
                <div style={{ marginBottom: "32px" }}>
                    <h1 className="page-title">Verification Center</h1>
                    <p className="page-subtitle">Review and verify applications for Municipal Officer roles.</p>
                </div>

                {loading ? (
                    <div className="loading-spinner-v2">
                        <div className="spinner-ring"></div>
                        <p>Loading applications...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="empty-state-v2">
                        <div className="empty-icon"><FileText size={40} /></div>
                        <h3>No applications found</h3>
                        <p>Pending applications for municipal officer roles will appear here once submitted.</p>
                    </div>
                ) : (
                    <div className="grid-v2">
                        {requests.map((req) => (
                            <div key={req.id} className="card mr-card">
                                {/* Status Header */}
                                <div className="mr-status-bar">
                                    <span className={`badge ${
                                        req.status === 'pending' ? 'badge-pending' :
                                        req.status === 'approved' ? 'badge-resolved' :
                                        'badge-urgent'
                                    }`}>
                                        <span className="badge-dot"></span>
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                    <span className="mr-date">
                                        <Calendar size={12} />
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="mr-user-box">
                                    <div className="mr-avatar">
                                        {req.full_name.charAt(0)}
                                    </div>
                                    <div className="mr-user-details">
                                        <h3 className="mr-user-name">{req.full_name}</h3>
                                        <p className="mr-user-email">{req.email}</p>
                                    </div>
                                </div>

                                <div className="mr-info-grid">
                                    <div className="mr-info-item">
                                        <Hash size={16} />
                                        <span>Target: <strong>Ward {req.ward_number}</strong></span>
                                    </div>
                                    <div className="mr-info-item">
                                        <ShieldCheck size={16} />
                                        <span>Identity Verified</span>
                                    </div>
                                </div>

                                {/* Document View */}
                                <div className="mr-doc-section">
                                    <p className="mr-doc-label">Compliance Document</p>
                                    <a 
                                        href={`http://localhost:4849${req.document_url}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="mr-doc-link"
                                    >
                                        <FileText size={18} />
                                        <span>Review Document</span>
                                        <ExternalLink size={14} className="mr-external-icon" />
                                    </a>
                                </div>

                                {req.status === 'pending' && (
                                    <div className="mr-actions">
                                        <button 
                                            onClick={() => handleAction(req.id, 'approved')}
                                            disabled={actionLoading === req.id}
                                            className="btn btn-success btn-sm w-full"
                                        >
                                            <Check size={16} /> Approve Access
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            disabled={actionLoading === req.id}
                                            className="btn btn-ghost btn-sm w-full text-red-600"
                                        >
                                            <X size={16} /> Reject Request
                                        </button>
                                    </div>
                                )}

                                {req.status !== 'pending' && req.admin_message && (
                                    <div className="mr-remark">
                                        <AlertCircle size={14} />
                                        <span>Remark: "{req.admin_message}"</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 24px;
                }
                .mr-card {
                    padding: 24px !important;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    transition: transform 0.2s;
                }
                .mr-card:hover {
                    transform: translateY(-4px);
                }
                .mr-status-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .mr-date {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 500;
                }
                .mr-user-box {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .mr-avatar {
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, #1e293b, #334155);
                    color: white;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 800;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .mr-user-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }
                .mr-user-email {
                    font-size: 0.85rem;
                    color: #64748b;
                    margin: 0;
                }
                .mr-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    padding: 12px;
                    background: #f8fafc;
                    border-radius: 12px;
                }
                .mr-info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    color: #475569;
                }
                .mr-doc-section {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .mr-doc-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    margin: 0;
                }
                .mr-doc-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px;
                    background: white;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 14px;
                    color: #1e293b;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.15s;
                }
                .mr-doc-link:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                    color: #2563eb;
                }
                .mr-external-icon {
                    margin-left: auto;
                    opacity: 0.4;
                }
                .mr-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: auto;
                }
                .mr-remark {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    padding: 12px;
                    background: #f1f5f9;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    color: #475569;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default MunicipalRequests;
