import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Search, Building2, Calendar, Banknote } from "lucide-react";

const AdminDonations = () => {
  const { token } = useContext(AuthContext);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDonations();
  }, [token]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/all-donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDonations(res.data.donations || []);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donation history.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.full_name?.toLowerCase().includes(term) ||
      d.email?.toLowerCase().includes(term) ||
      d.campaign_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="manage-users-page" style={{ paddingBottom: '3rem' }}>
      <Toaster position="top-right" />
      <nav className="dashboard-navbar" style={{ padding: "0 2rem", minHeight: "72px" }}>
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span><span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan Admin</span>
        </div>
        <div className="navbar-user-section">
          <Link to="/admin" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="users-content">
        <div className="users-container">
          <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="header-text">
              <h1>All Donations</h1>
              <p>View complete history of successful donations made across the platform.</p>
            </div>
          </header>

          <div className="table-actions">
            <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, email, or campaign..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="users-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading donations...</p>
              </div>
            ) : filteredDonations.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Date</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{d.full_name || "Anonymous"}</span>
                          <span className="user-email">{d.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="date-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} />
                          {new Date(d.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                          <Building2 size={14} />
                          {d.campaign_name || "General Fund"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>
                          Rs. {d.amount}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Banknote size={12} />
                          Success
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <Banknote size={48} />
                <h3>No donations found</h3>
                <p>Try adjusting your search query or no donations have been made yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonations;
