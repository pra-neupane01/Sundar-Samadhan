import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Search, ShieldAlert, UserCheck, UserX } from "lucide-react";
import "./ManageUsers.css";

const ManageUsers = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    if (userId === user?.id) {
      toast.error("You cannot block your own account.");
      return;
    }

    setUpdatingId(userId);
    try {
      const res = await api.put(
        "/admin/toggle-user-status",
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(isActive ? "User blocked successfully" : "User unblocked successfully");
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: !isActive } : u))
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error.response?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === user?.id) {
      toast.error("You cannot change your own role.");
      return;
    }

    setUpdatingId(userId);
    try {
      const res = await api.put(
        "/admin/update-role",
        { user_id: userId, new_role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="manage-users-page">
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
              <h1>Manage Users</h1>
              <p>View, block, or change roles for all platform users.</p>
            </div>
          </header>

          <div className="table-actions">
            <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, email, or role..." 
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
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User / Email</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={!u.is_active ? "row-blocked" : ""}>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{u.full_name}</span>
                          <span className="user-email">{u.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="date-text">
                          {new Date(u.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.is_active ? 'active' : 'blocked'}`}>
                          {u.is_active ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`role-select role-${u.role}`}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={updatingId === u.id || u.id === user?.id}
                        >
                          <option value="citizen">Citizen</option>
                          <option value="municipal">Municipal</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className={`action-btn ${u.is_active ? 'btn-block' : 'btn-unblock'}`}
                          onClick={() => handleToggleStatus(u.id, u.is_active)}
                          disabled={updatingId === u.id || u.id === user?.id}
                        >
                          {u.is_active ? <><UserX size={16}/> Block</> : <><UserCheck size={16}/> Unblock</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <ShieldAlert size={48} />
                <h3>No users found</h3>
                <p>Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
