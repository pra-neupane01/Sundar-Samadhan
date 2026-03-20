import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Check, X, FileText, User, Mail, Hash, Calendar, Loader2, ExternalLink } from "lucide-react";

const MunicipalRequests = () => {
    const { token } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/municipal-requests");
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
    }, []);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Loading requests...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Municipal Officer Requests</h1>
                <p className="text-slate-500 mt-1">Review and verify documents submitted by users to become Municipal Officers.</p>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200 shadow-sm">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No applications found</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">Pending applications for municipal officer roles will appear here once submitted by users.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                            {/* Status Badge */}
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-xs font-bold uppercase tracking-wider ${
                                req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {req.status}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                                    {req.full_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{req.full_name}</h3>
                                    <p className="text-sm text-slate-500">{req.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Hash size={16} className="text-slate-400" />
                                    <span>Applying for <strong>Ward {req.ward_number}</strong></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>Submitted on {new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Document Link */}
                            <a 
                                href={`http://localhost:4849${req.document_url}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-bold transition-all border border-slate-200 mb-6 group-hover:border-blue-200 group-hover:bg-blue-50/30"
                            >
                                <FileText size={18} />
                                View Document
                                <ExternalLink size={14} className="opacity-40" />
                            </a>

                            {req.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleAction(req.id, 'approved')}
                                        disabled={actionLoading}
                                        className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                                    >
                                        <Check size={18} />
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req.id, 'rejected')}
                                        disabled={actionLoading}
                                        className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold transition-all disabled:opacity-50"
                                    >
                                        <X size={18} />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {req.status !== 'pending' && req.admin_message && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Admin Remark</p>
                                    <p className="text-sm text-slate-600 italic">"{req.admin_message}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MunicipalRequests;
