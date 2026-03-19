import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "./WardComplaints.css";

const WardComplaints = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchWardComplaints = async () => {
      try {
        const wardNumber = user?.ward_number || 1;
        const response = await api.get(`/complaints/get-complaints-by-ward/${wardNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setComplaints(response.data.complaint || []);
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
  }, [token, user]);

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

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "status-pending";
      case "processing": return "status-processing";
      case "resolved": return "status-resolved";
      default: return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return <Clock size={14} />;
      case "processing": return <AlertCircle size={14} />;
      case "resolved": return <CheckCircle2 size={14} />;
      default: return null;
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="ward-complaints-page">
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
          <Link to="/municipal" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="complaints-content">
        <div className="complaints-container">
          <header className="page-header">
            <div className="header-text">
              <h1>Ward {user?.ward_number || 1} Complaints</h1>
              <p>Manage and update all complaints in your designated ward.</p>
            </div>
          </header>

          <div className="table-actions">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by title or category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-wrapper">
              <Filter size={18} className="filter-icon" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="complaints-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading complaints...</p>
              </div>
            ) : filteredComplaints.length > 0 ? (
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Title & Category</th>
                    <th>Date Filed</th>
                    <th>Citizen ID</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.complaint_id}>
                      <td>
                        <div className="complaint-info">
                          <span className="complaint-title">{complaint.title}</span>
                          <span className="complaint-category">{complaint.category || "General"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="date-text">
                          {new Date(complaint.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td>
                        <span className="citizen-text" title={complaint.created_by}>
                          {complaint.created_by.split("-")[0]}...
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusStyle(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <select 
                            className="status-select"
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
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <AlertCircle size={48} />
                <h3>No complaints found</h3>
                <p>
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your filters or search terms."
                    : "No complaints have been lodged in this ward yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardComplaints;
