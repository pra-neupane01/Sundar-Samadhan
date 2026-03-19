import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Home, Award, Save, Clock, HelpCircle } from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { user, token, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    role: user?.role || "",
    wardNumber: user?.ward_number || "",
    sundarPoints: user?.sundar_points || 0,
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // GET profile
        const profRes = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (profRes.data.success) {
          const u = profRes.data.user;
          setProfile({
            fullName: u.full_name,
            email: u.email,
            role: u.role,
            wardNumber: u.ward_number || "",
            sundarPoints: u.sundar_points || 0,
          });
          // Update global state if backend data is fresher
          updateUser({
              ...user,
              full_name: u.full_name,
              ward_number: u.ward_number,
              sundar_points: u.sundar_points
          });
        }

        // GET history
        const histRes = await api.get("/user/points-history", {
            headers: { Authorization: `Bearer ${token}` },
          });
        if (histRes.data.success) {
          setHistory(histRes.data.history || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(
        "/user/update-profile",
        {
          fullName: profile.fullName,
          wardNumber: profile.wardNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Profile updated!");
        const updated = res.data.user;
        updateUser({
            ...user,
            full_name: updated.full_name,
            ward_number: updated.ward_number,
            sundar_points: updated.sundar_points
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(
        "/user/change-password",
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Password changed successfully!");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const getBackLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "municipal") return "/municipal";
    return "/dashboard";
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <nav className="dashboard-navbar" style={{ padding: "0 2rem", minHeight: "72px" }}>
        <div className="navbar-brand">
          <div className="logo-text-icon">
            <span className="logo-letter">S</span>
            <span className="logo-letter">S</span>
          </div>
          <span className="brand-text">Sundar Samadhan</span>
        </div>

        <div className="navbar-user-section">
          <Link to={getBackLink()} className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-grid">
          
          {/* Left Panel: Stats */}
          <div className="profile-card">
            <div className="avatar-large">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{profile.fullName}</h2>
            <span className="profile-role">{profile.role}</span>
            
            <div className="points-badge-large">
              <span className="points-label">Total Points Earned</span>
              <span className="points-value">{profile.sundarPoints}</span>
              <Award size={20} style={{ color: '#d97706', marginTop: '4px' }}/>
            </div>

            <div style={{ marginTop: '24px', width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                <p style={{ fontSize: '13px', color: '#64748b' }}> Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()} </p>
            </div>
          </div>

          {/* Right Panel: Forms & History */}
          <div className="profile-main">
            
            {/* Account Settings */}
            <div className="main-section">
              <div className="section-header">
                <div className="header-icon-box"><User size={20}/></div>
                <h3>Account Settings</h3>
              </div>
              
              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={profile.fullName} 
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={profile.email} disabled title="Email cannot be changed"/>
                </div>

                <div className="form-group">
                    <label>Assigned Ward</label>
                    <select 
                        value={profile.wardNumber} 
                        onChange={(e) => setProfile({...profile, wardNumber: e.target.value})}
                    >
                        <option value="">No Ward</option>
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(w => (
                            <option key={w} value={w}>Ward {w}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                  <label>Account Role</label>
                  <input type="text" value={profile.role.toUpperCase()} disabled />
                </div>

                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Updating..." : "Save Profile Changes"}
                </button>
              </form>
            </div>

            {/* Security Section */}
            <div className="main-section">
              <div className="section-header">
                <div className="header-icon-box"><Save size={20}/></div>
                <h3>Security & Password</h3>
              </div>
              
              <form onSubmit={handleChangePassword} className="edit-form" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.oldPassword} 
                    onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={passwords.newPassword} 
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwords.confirmPassword} 
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Points History */}
            <div className="main-section">
              <div className="section-header">
                <div className="header-icon-box"><Clock size={20}/></div>
                <h3>Sundar Points History</h3>
              </div>
                
              <div className="history-table-container">
                {history.length > 0 ? (
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(item => (
                        <tr key={item.donation_id}>
                          <td className="history-date">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td>Donation Case #{item.donation_id}</td>
                          <td className="history-amount">+{item.amount} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-history">
                    <HelpCircle size={40} style={{ opacity: 0.3 }}/>
                    <p>No activity found. Donations earn you Sundar Points!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
