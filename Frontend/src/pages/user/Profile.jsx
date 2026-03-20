import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Home, Award, Save, Clock, HelpCircle, BadgeCheck, ShieldAlert } from "lucide-react";
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
  const [municipalRequest, setMunicipalRequest] = useState(null);
  const [appFile, setAppFile] = useState(null);
  const [appWard, setAppWard] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // GET profile
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

        // GET history
        const histRes = await api.get("/user/points-history");
        if (histRes.data.success) {
          setHistory(histRes.data.history || []);
        }

        // GET municipal request
        const reqRes = await api.get("/user/my-municipal-request");
        if (reqRes.data.success) {
          setMunicipalRequest(reqRes.data.data);
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
        }
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
      const res = await api.put(
        "/user/change-password",
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }
      );

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
    if (!appFile || !profile.wardNumber) {
      toast.error("Please provide both a document and your ward number");
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
        toast.success("Application submitted successfully!");
        setMunicipalRequest(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setSaving(false);
    }
  };

  const getBackLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "municipal") return "/municipal";
    return "/dashboard";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-grid">
          <div className="profile-card">
            <div className="avatar-large">{profile.fullName.charAt(0)}</div>
            <h2 className="profile-name">{profile.fullName}</h2>
            <span className="profile-role">{profile.role}</span>
            <div className="points-badge-large">
              <span className="points-label">Sundar Points</span>
              <span className="points-value">{profile.sundarPoints}</span>
            </div>
          </div>

          <div className="profile-main">
            <div className="main-section">
              <div className="section-header"><h3>Account Settings</h3></div>
              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-group"><label>Full Name</label><input type="text" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} /></div>
                <div className="form-group"><label>Assigned Ward</label>
                  <select value={profile.wardNumber} onChange={(e) => setProfile({...profile, wardNumber: e.target.value})}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(w => <option key={w} value={w}>Ward {w}</option>)}
                  </select>
                </div>
                <button type="submit" className="save-btn" disabled={saving}>Save Changes</button>
              </form>
            </div>

            {profile.role === 'citizen' && (
              <div className="main-section">
                <div className="section-header"><h3>Become a Municipal Officer</h3></div>
                {!municipalRequest ? (
                  <form onSubmit={handleMunicipalApply} className="edit-form">
                    <p className="text-sm text-slate-500 mb-4">Upload documents to verify your eligibility.</p>
                    <input type="file" onChange={(e) => setAppFile(e.target.files[0])} required className="mb-4" />
                    <button type="submit" className="save-btn" disabled={saving}>Apply Now</button>
                  </form>
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    municipalRequest.status === 'pending' ? 'bg-amber-50 border-amber-200' : 
                    municipalRequest.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <h4 className="font-bold">Status: {municipalRequest.status.toUpperCase()}</h4>
                    <p className="text-sm mt-2">
                       {municipalRequest.status === 'pending' ? "Under review..." : 
                        municipalRequest.status === 'approved' ? "Approved! You are now a Municipal Officer." : 
                        `Rejected: ${municipalRequest.admin_message || 'N/A'}`}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="main-section">
              <div className="section-header"><h3>Security</h3></div>
              <form onSubmit={handleChangePassword} className="edit-form">
                <div className="form-group"><label>Old Password</label><input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} /></div>
                <div className="form-group"><label>New Password</label><input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} /></div>
                <button type="submit" className="save-btn" disabled={saving}>Change Password</button>
              </form>
            </div>

            <div className="main-section">
              <div className="section-header"><h3>Points History</h3></div>
              <div className="history-table-container">
                {history.length > 0 ? (
                  <table className="history-table">
                    <tbody>
                      {history.map(item => (
                        <tr key={item.created_at}>
                          <td>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td>+{item.amount} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-slate-500 p-4">No history yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
