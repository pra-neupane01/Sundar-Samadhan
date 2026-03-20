import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { 
    User, Mail, Home, Award, Save, Clock, ShieldAlert, 
    Lock, CheckCircle, Smartphone, MapPin, FileText,
    ArrowRight, Loader2, Info
} from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
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
  const [municipalRequest, setMunicipalRequest] = useState(null);
  const [appFile, setAppFile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profRes = await api.get("/user/profile");
        
        if (profRes.data.success) {
          const u = profRes.data.user;
          setProfile({
            fullName: u.full_name,
            email: u.email,
            role: u.role,
            wardNumber: u.ward_number || "",
            sundarPoints: u.sundar_points || 0,
          });
          updateUser({
              ...user,
              full_name: u.full_name,
              ward_number: u.ward_number,
              sundar_points: u.sundar_points
          });
        }

        // Only fetch history if not admin
        if (user?.role !== 'admin') {
            const histRes = await api.get("/user/points-history");
            if (histRes.data.success) {
              setHistory(histRes.data.history || []);
            }
        }

        // Only fetch municipal request if citizen
        if (user?.role === 'citizen') {
            const reqRes = await api.get("/user/my-municipal-request");
            if (reqRes.data.success) {
              setMunicipalRequest(reqRes.data.data);
            }
        }
      } catch (error) {
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
      const res = await api.put("/user/update-profile", {
        fullName: profile.fullName,
        wardNumber: profile.wardNumber,
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        const updated = res.data.user;
        updateUser({
            ...user,
            full_name: updated.full_name,
            ward_number: updated.ward_number,
            sundar_points: updated.sundar_points
        });
      }
    } catch (error) {
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
    setSaving(true);
    try {
      const res = await api.put("/user/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      if (res.data.success) {
        toast.success("Password changed successfully!");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleMunicipalApply = async (e) => {
    e.preventDefault();
    if (!appFile) {
      toast.error("Please upload a verification document");
      return;
    }

    const formData = new FormData();
    formData.append("document", appFile);
    formData.append("ward_number", profile.wardNumber);

    setSaving(true);
    try {
      const res = await api.post("/user/apply-municipal", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Verification request submitted!");
        setMunicipalRequest(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
      return (
          <div className="page-shell">
              <div className="loading-spinner-v2">
                  <div className="spinner-ring"></div>
                  <p>Securing your profile...</p>
              </div>
          </div>
      );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="page-shell">
      <Toaster position="top-right" />
      <div className="content-container profile-container">
        
        {/* Profile Header */}
        <div className="profile-header-card card">
            <div className="profile-header-bg"></div>
            <div className="profile-header-content">
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar-main">
                        {profile.fullName.charAt(0)}
                    </div>
                </div>
                <div className="profile-identity">
                    <h1 className="profile-full-name">{profile.fullName}</h1>
                    <div className="profile-badges">
                        <span className={`role-badge role-${profile.role}`}>
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                        </span>
                        {!isAdmin && (
                            <span className="points-badge">
                                <Award size={14} /> {profile.sundarPoints} Sundar Points
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="profile-grid-layout">
            {/* Main Form Section */}
            <div className="profile-form-area">
                <div className="card profile-card-padding">
                    <div className="section-head">
                        <User size={20} className="text-blue-600" />
                        <h3>Personal Information</h3>
                    </div>
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group-v2">
                            <label className="form-label">Full Name</label>
                            <div className="form-input-wrap">
                                <User size={16} className="input-icon-v2" />
                                <input 
                                    className="form-control-v2" 
                                    type="text" 
                                    value={profile.fullName} 
                                    onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="form-group-v2">
                            <label className="form-label">Email Address</label>
                            <div className="form-input-wrap">
                                <Mail size={16} className="input-icon-v2" />
                                <input 
                                    className="form-control-v2 disabled" 
                                    type="email" 
                                    value={profile.email} 
                                    disabled 
                                    title="Email cannot be changed"
                                />
                            </div>
                        </div>

                        <div className="form-group-v2">
                            <label className="form-label">Assigned Ward</label>
                            <div className="form-input-wrap">
                                <Home size={16} className="input-icon-v2" />
                                <select 
                                    className="form-control-v2" 
                                    value={profile.wardNumber} 
                                    onChange={(e) => setProfile({...profile, wardNumber: e.target.value})}
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(w => 
                                        <option key={w} value={w}>Ward {w}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-fit" disabled={saving}>
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </form>
                </div>

                <div className="card profile-card-padding" style={{ marginTop: "24px" }}>
                    <div className="section-head">
                        <Lock size={20} className="text-blue-600" />
                        <h3>Account Security</h3>
                    </div>
                    <form onSubmit={handleChangePassword} className="profile-form">
                        <div className="form-row-v2">
                            <div className="form-group-v2 flex-1">
                                <label className="form-label">Current Password</label>
                                <input 
                                    className="form-control-v2" 
                                    type="password" 
                                    value={passwords.oldPassword} 
                                    onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} 
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="form-row-v2">
                            <div className="form-group-v2 flex-1">
                                <label className="form-label">New Password</label>
                                <input 
                                    className="form-control-v2" 
                                    type="password" 
                                    value={passwords.newPassword} 
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                            <div className="form-group-v2 flex-1">
                                <label className="form-label">Confirm New Password</label>
                                <input 
                                    className="form-control-v2" 
                                    type="password" 
                                    value={passwords.confirmPassword} 
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
                                    placeholder="Re-enter new password"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-secondary w-fit" disabled={saving}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>

            {/* Sidebar Section */}
            <div className="profile-sidebar-area">
                {!isAdmin && user?.role === 'citizen' && (
                    <div className="card profile-card-padding mb-6">
                        <div className="section-head">
                            <ShieldAlert size={20} className="text-amber-600" />
                            <h3>Official Verification</h3>
                        </div>
                        
                        {!municipalRequest ? (
                            <form onSubmit={handleMunicipalApply} className="verification-form">
                                <p className="sidebar-text">Apply to become a Municipal Officer for Ward {profile.wardNumber}.</p>
                                <div className="file-upload-box">
                                    <input 
                                        type="file" 
                                        id="muni-doc"
                                        onChange={(e) => setAppFile(e.target.files[0])} 
                                        className="file-input-hidden"
                                    />
                                    <label htmlFor="muni-doc" className="file-label-v2">
                                        <FileText size={24} className="mb-2 text-slate-400" />
                                        <span>{appFile ? appFile.name : "Select Document"}</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                                    Apply Now
                                </button>
                            </form>
                        ) : (
                            <div className={`verification-status status-${municipalRequest.status}`}>
                                <div className="status-label-wrap">
                                    <div className="status-dot"></div>
                                    <span className="status-text">{municipalRequest.status.toUpperCase()}</span>
                                </div>
                                <p className="status-desc">
                                    {municipalRequest.status === 'pending' ? "Our administrators are reviewing your documents." : 
                                     municipalRequest.status === 'approved' ? "Verified! You now have Municipal access." : 
                                     `Request Rejected: ${municipalRequest.admin_message || "Invalid documents."}`}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {!isAdmin && history.length > 0 && (
                    <div className="card profile-card-padding">
                        <div className="section-head">
                            <Clock size={20} className="text-indigo-600" />
                            <h3>Points Activity</h3>
                        </div>
                        <div className="points-history-list">
                            {history.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="history-item-row">
                                    <div className="history-info">
                                        <span className="history-date">{new Date(item.created_at).toLocaleDateString()}</span>
                                        <span className="history-reason">{item.reason || "Donation Reward"}</span>
                                    </div>
                                    <span className="history-pts">+{item.amount}</span>
                                </div>
                            ))}
                            {history.length > 5 && (
                                <button className="view-more-history">View All Activity</button>
                            )}
                        </div>
                    </div>
                )}

                <div className="card profile-card-padding mt-6 bg-slate-50 border-slate-100">
                    <div className="section-head">
                        <Info size={18} className="text-slate-400" />
                        <h3 className="text-slate-600">Privacy Notice</h3>
                    </div>
                    <p className="sidebar-text">Your personal data is encrypted and managed according to government security standards. Some information is shared with ward officials for complaint resolution.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
