import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { 
  ArrowLeft, 
  Wallet, 
  Landmark, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  HeartHandshake,
  Search,
  Filter,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MyDonations.css";

const MyDonations = () => {
  const { token, user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donations/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setDonations(res.data.donations);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonations();
    }
  }, [token]);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesStatus = filterStatus === "all" || donation.status === filterStatus;
      const matchesSearch = 
        donation.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.amount.toString().includes(searchTerm) ||
        donation.payment_method?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [donations, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    const totalAmount = donations
      .filter(d => d.status === "success")
      .reduce((sum, d) => sum + d.amount, 0);
    
    return {
      totalAmount,
      totalCount: donations.filter(d => d.status === "success").length,
      points: user?.sundar_points || totalAmount, // Fallback if points not explicitly in user object
    };
  }, [donations, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="status-icon success" size={16} />;
      case "pending":
        return <Clock className="status-icon pending" size={16} />;
      case "failed":
        return <XCircle className="status-icon failed" size={16} />;
      default:
        return null;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
        return <CreditCard size={18} />;
      case "bank":
        return <Landmark size={18} />;
      default:
        return <Wallet size={18} />;
    }
  };

  return (
    <div className="my-donations-container">
      <header className="donations-page-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>
        </div>
        <div className="header-main">
          <h1>Donation History</h1>
          <p>Track your contributions and impact in the community.</p>
        </div>
      </header>

      <div className="donations-stats-grid">
        <div className="donation-stat-card total-donated">
          <div className="stat-icon-bg">
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Donated</span>
            <h2 className="stat-value">${stats.totalAmount}</h2>
          </div>
        </div>
        <div className="donation-stat-card points-earned">
          <div className="stat-icon-bg">
            <Award size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Sundar Points</span>
            <h2 className="stat-value">{stats.points}</h2>
          </div>
        </div>
        <div className="donation-stat-card contribution-count">
          <div className="stat-icon-bg">
            <HeartHandshake size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Successful Donations</span>
            <h2 className="stat-value">{stats.totalCount}</h2>
          </div>
        </div>
      </div>

      <main className="donations-content">
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <div className="filter-label">
              <Filter size={16} />
              <span>Filter Status:</span>
            </div>
            <div className="filter-options">
              {["all", "success", "pending", "failed"].map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Gathering your donation history...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <Calendar size={48} />
            </div>
            <h3>No records found</h3>
            <p>
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your filters or search terms." 
                : "You haven't made any donations yet. Join us in making a difference!"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button className="primary-action-btn" onClick={() => navigate("/dashboard")}>
                Make First Donation
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="donations-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.donation_id}>
                    <td className="date-cell">
                      <span className="main-date">
                        {new Date(donation.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="sub-date">
                        {new Date(donation.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="amount-cell">
                      <span className="currency">$</span>
                      <span className="value">{donation.amount.toLocaleString()}</span>
                    </td>
                    <td>
                        <div className="method-tag">
                        {getPaymentIcon(donation.payment_method)}
                        <span>{donation.payment_method}</span>
                      </div>
                    </td>
                    <td className="id-cell">
                      <code>{donation.transaction_id || "TXN-PENDING"}</code>
                    </td>
                    <td>
                      <span className={`status-pill ${donation.status}`}>
                        {getStatusIcon(donation.status)}
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDonations;
