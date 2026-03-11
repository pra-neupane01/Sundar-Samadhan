import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import "./MyComplaints.css";

const MyComplaints = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const response = await api.get("/complaints/my-complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setComplaints(response.data.complaint || []);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "resolved":
        return "status-resolved";
      default:
        return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock size={14} />;
      case "processing":
        return <AlertCircle size={14} />;
      case "resolved":
        return <CheckCircle2 size={14} />;
      default:
        return null;
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="my-complaints-page">
      {/* Navbar */}
      <nav className="dashboard-navbar" style={{ padding: "0 2rem", minHeight: "72px" }}>
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span>
            <span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan</span>
        </div>

        <div className="navbar-user-section">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="complaints-content">
        <div className="complaints-container">
          <header className="page-header">
            <div className="header-text">
              <h1>My Complaints</h1>
              <p>Track the status of issues you've reported</p>
            </div>
            <button 
              className="btn-primary create-btn"
              onClick={() => navigate("/citizen/complaint/create")}
            >
              Lodge New Complaint
            </button>
          </header>

          <div className="table-actions">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search complaints..." 
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
                <p>Loading your complaints...</p>
              </div>
            ) : filteredComplaints.length > 0 ? (
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Title & Category</th>
                    <th>Date Filed</th>
                    <th>Ward</th>
                    <th>Status</th>
                    <th>Actions</th>
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
                        <span className="ward-badge">Ward {complaint.ward_number}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusStyle(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" title="View Details">
                            <Eye size={18} />
                          </button>
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
                    : "You haven't submitted any complaints yet."}
                </p>
                {!searchTerm && filterStatus === "all" && (
                   <button 
                   className="btn-secondary mt-4"
                   onClick={() => navigate("/citizen/complaint/create")}
                 >
                   File Your First Complaint
                 </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;
