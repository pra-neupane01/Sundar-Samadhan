import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { ArrowLeft, Wallet, Landmark, CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MyDonations.css";

const MyDonations = () => {
  const { token } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="status-icon success" size={18} />;
      case "pending":
        return <Clock className="status-icon pending" size={18} />;
      case "failed":
        return <XCircle className="status-icon failed" size={18} />;
      default:
        return null;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
        return <CreditCard size={20} />;
      case "bank":
        return <Landmark size={20} />;
      default:
        return <Wallet size={20} />;
    }
  };

  return (
    <div className="my-donations-container">
      <header className="donations-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1>My Donation History</h1>
      </header>

      <main className="donations-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <HeartHandshake size={64} className="empty-icon" />
            <h3>No Donations Yet</h3>
            <p>Your contributions help make our community better. Every donation counts!</p>
            <button className="donate-now-btn" onClick={() => navigate("/dashboard")}>
              Donate Now
            </button>
          </div>
        ) : (
          <div className="donations-list-wrapper">
            <table className="donations-table">
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
                {donations.map((donation) => (
                  <tr key={donation.donation_id}>
                    <td>
                      {new Date(donation.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="amount-cell">${donation.amount}</td>
                    <td>
                      <div className="method-cell">
                        {getPaymentIcon(donation.payment_method)}
                        <span>{donation.payment_method}</span>
                      </div>
                    </td>
                    <td className="transaction-id">{donation.transaction_id || "N/A"}</td>
                    <td>
                      <div className={`status-badge ${donation.status}`}>
                        {getStatusIcon(donation.status)}
                        <span>{donation.status}</span>
                      </div>
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
