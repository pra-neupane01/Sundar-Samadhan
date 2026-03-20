import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Search, Calendar, Building2, Banknote, DollarSign } from "lucide-react";

const AdminDonations = () => {
  const { token } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchDonations(); }, [token]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/all-donations", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setDonations(res.data.donations || []);
    } catch (e) { toast.error("Failed to load donation history."); }
    finally { setLoading(false); }
  };

  const filteredDonations = donations.filter((d) => {
    const term = searchTerm.toLowerCase();
    return d.full_name?.toLowerCase().includes(term) || d.email?.toLowerCase().includes(term) || d.campaign_name?.toLowerCase().includes(term);
  });

  const totalAmount = donations.reduce((s, d) => s + Number(d.amount || 0), 0);

  return (
    <div className="page-shell">
      <Toaster position="top-right" />
      <div className="content-container">

        {/* Header */}
        <div className="page-header-row" style={{ marginBottom: "32px" }}>
          <div>
            <h1 className="page-title">Donation Ledger</h1>
            <p className="page-subtitle">Full history of successful donations across the platform.</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ textAlign: "center", padding: "10px 20px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Total Collected</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#16a34a" }}>Rs. {Math.round(totalAmount)}</div>
            </div>
            <div style={{ textAlign: "center", padding: "10px 20px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Transactions</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e293b" }}>{donations.length}</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} className="search-icon" />
            <input type="text" placeholder="Search by name, email, or campaign…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-spinner-v2"><div className="spinner-ring"></div><p>Loading donations…</p></div>
        ) : filteredDonations.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
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
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: "linear-gradient(135deg,#10b981,#34d399)",
                          color: "white", display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0
                        }}>{(d.full_name || "A").charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>{d.full_name || "Anonymous"}</div>
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.87rem" }}>
                        <Calendar size={14} />
                        {new Date(d.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569", fontSize: "0.87rem" }}>
                        <Building2 size={14} /> {d.campaign_name || "General Fund"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#16a34a", fontSize: "0.95rem" }}>Rs. {d.amount}</span>
                    </td>
                    <td>
                      <span className="badge badge-resolved"><span className="badge-dot"></span> Success</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-v2">
            <div className="empty-icon"><Banknote size={36} /></div>
            <h3>No donations found</h3>
            <p>Adjust your search or no donations have been made yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDonations;
