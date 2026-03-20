import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Search, ShieldAlert, UserCheck, UserX, Users, ChevronDown } from "lucide-react";

const Badge = ({ role }) => {
  const map = {
    admin:     { bg: "#f3e8ff", color: "#7c3aed", label: "Admin" },
    municipal: { bg: "#eff6ff", color: "#2563eb", label: "Municipal" },
    citizen:   { bg: "#f0fdf4", color: "#16a34a", label: "Citizen" },
  };
  const s = map[role] || { bg: "#f1f5f9", color: "#64748b", label: role };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 12px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700 }}>
      {s.label}
    </span>
  );
};

const ManageUsers = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [updatingId, setUpId]   = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/all-users");
      if (r.data.success) setUsers(r.data.users || []);
    } catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  const handleToggle = async (uid, isActive) => {
    if (uid === user?.id) { toast.error("You cannot block your own account."); return; }
    setUpId(uid);
    try {
      const r = await api.put("/admin/toggle-user-status", { user_id: uid });
      if (r.data.success) {
        toast.success(isActive ? "User blocked." : "User unblocked.");
        setUsers(prev => prev.map(u => u.id === uid ? { ...u, is_active: !isActive } : u));
      }
    } catch (e) { toast.error(e.response?.data?.message || "Failed."); }
    finally { setUpId(null); }
  };

  const handleRole = async (uid, newRole) => {
    if (uid === user?.id) { toast.error("Cannot change your own role."); return; }
    setUpId(uid);
    try {
      const r = await api.put("/admin/update-role", { user_id: uid, new_role: newRole });
      if (r.data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
      }
    } catch (e) { toast.error(e.response?.data?.message || "Failed."); }
    finally { setUpId(null); }
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell">
      <div className="content-container">

        {/* Header */}
        <div className="page-header-row" style={{ marginBottom: "32px" }}>
          <div>
            <h1 className="page-title">Manage Users</h1>
            <p className="page-subtitle">Control access, roles, and account status for all platform users.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
              <span style={{ color: "#94a3b8" }}>Total accounts:</span>
              <strong style={{ color: "#1e293b", marginLeft: "6px" }}>{users.length}</strong>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} className="search-icon" />
            <input type="text" placeholder="Search by name, email, or role…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-spinner-v2"><div className="spinner-ring"></div><p>Loading users…</p></div>
        ) : filtered.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Ward</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ opacity: updatingId === u.id ? 0.5 : 1, transition: "opacity 0.2s" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "38px", height: "38px", borderRadius: "50%",
                          background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                          color: "white", display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 800, fontSize: "1rem", flexShrink: 0
                        }}>{u.full_name?.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>{u.full_name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select
                          style={{
                            appearance: "none", border: "none", background: "transparent",
                            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                            color: u.role === "admin" ? "#7c3aed" : u.role === "municipal" ? "#2563eb" : "#16a34a",
                            paddingRight: "16px",
                          }}
                          value={u.role}
                          onChange={e => handleRole(u.id, e.target.value)}
                          disabled={updatingId === u.id || u.id === user?.id}
                        >
                          <option value="citizen">Citizen</option>
                          <option value="municipal">Municipal</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.87rem" }}>
                      {u.ward_number ? `Ward ${u.ward_number}` : "—"}
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.87rem" }}>
                      {new Date(u.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <span style={{
                        background: u.is_active ? "#f0fdf4" : "#fef2f2",
                        color: u.is_active ? "#16a34a" : "#dc2626",
                        border: `1px solid ${u.is_active ? "#a7f3d0" : "#fecaca"}`,
                        padding: "3px 12px", borderRadius: "999px",
                        fontSize: "0.78rem", fontWeight: 700,
                      }}>
                        {u.is_active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(u.id, u.is_active)}
                        disabled={updatingId === u.id || u.id === user?.id}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          padding: "6px 14px", borderRadius: "8px", fontSize: "0.82rem",
                          fontWeight: 600, cursor: "pointer", border: "none",
                          background: u.is_active ? "#fef2f2" : "#f0fdf4",
                          color: u.is_active ? "#dc2626" : "#16a34a",
                          transition: "all 0.2s",
                        }}
                      >
                        {u.is_active ? <><UserX size={15} /> Block</> : <><UserCheck size={15} /> Unblock</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-v2">
            <div className="empty-icon"><Users size={36} /></div>
            <h3>No users found</h3>
            <p>Try adjusting your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
