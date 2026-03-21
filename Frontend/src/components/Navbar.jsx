import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { 
  User, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Re-routes dashboard based on user role
  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "municipal") return "/municipal";
    return "/dashboard";
  };

  const navLinks = [
    { label: "Home", path: "/", roles: ["guest", "citizen", "municipal"] },
    { label: "About Us", path: "/about", roles: ["guest"] },
    { label: "Dashboard", path: getDashboardLink(), roles: ["citizen", "municipal", "admin"] },
    { label: "Complaints", path: "/citizen/complaints", roles: ["citizen"] },
    { label: "Manage Complaints", path: "/municipal/complaints", roles: ["municipal"] },
    { label: "Announcements", path: "/municipal/announcements", roles: ["municipal", "citizen"] },
    { label: "Contact", path: "/contact", roles: ["guest", "citizen", "municipal"] },
    
    // Admin Specific Links (Kept for admin usability)
    { label: "Manage Users", path: "/admin/users", roles: ["admin"] },
    { label: "Feedback/Requests", path: "/admin/municipal-requests", roles: ["admin"] },
    { label: "Donations", path: "/admin/all-donations", roles: ["admin"] },
  ];

  const userRole = user?.role || "guest";
  const filteredLinks = navLinks.filter(link => link.roles.includes(userRole));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        {/* Branding (Left Side) */}
        <Link to={user ? getDashboardLink() : "/"} className="navbar-logo">
          <div className="logo-icon">
            <img src="/logo.png" alt="Sundar Samadhan Logo" />
          </div>
          <span className="logo-text">Sundar Samadhan</span>
        </Link>

        {/* Center Links (Text-First) */}
        <div className="navbar-links-desktop">
          {filteredLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions Section (Right Side) */}
        <div className="navbar-actions">
          {/* Prominent Donate CTA */}
          {userRole === "citizen" ? (
            <Link to="/citizen/donate" className="btn-donate-cta">
              Donate
            </Link>
          ) : (userRole === "guest" || !user) ? (
            <Link to="/register" className="btn-donate-cta">
              Donate
            </Link>
          ) : null}

          {user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* User Profile Avatar */}
              <Link to="/profile" className="nav-profile-link" title="My Profile">
                <User size={18} />
              </Link>
              
              {/* Logout Icon */}
              <button onClick={handleLogout} className="nav-icon-link" title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="btn-ghost">Log in</Link>
            </div>
          )}
          
          {/* Mobile Menu Toggle (Hamburger) */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-overlay">
          <div className="mobile-menu">
            {filteredLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="mobile-menu-divider"></div>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="mobile-nav-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="mobile-nav-link" 
                  style={{textAlign: "left", background: "transparent", border: "none", cursor: "pointer"}}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="mobile-nav-link" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
