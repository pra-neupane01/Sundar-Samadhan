import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { 
  Home, 
  ClipboardList, 
  Heart, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Users, 
  FileCheck,
  Megaphone,
  LayoutDashboard
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  if (!user) return null;

  const getDashboardLink = () => {
    if (!user) return "/about";
    if (user.role === "admin") return "/admin";
    if (user.role === "municipal") return "/municipal";
    return "/dashboard";
  };

  const navLinks = [
    { 
      label: "About Us", 
      path: "/about", 
      icon: <Users size={18} />,
      roles: ["citizen", "municipal", "admin", "guest"]
    },
    { 
      label: "Dashboard", 
      path: getDashboardLink(), 
      icon: <LayoutDashboard size={18} />,
      roles: ["citizen", "municipal", "admin"]
    },
    // Citizen Links
    { 
      label: "Complaints", 
      path: "/citizen/complaints", 
      icon: <ClipboardList size={18} />,
      roles: ["citizen"] 
    },
    { 
      label: "Donate", 
      path: "/citizen/donate", 
      icon: <Heart size={18} />,
      roles: ["citizen"] 
    },
    { 
      label: "My Donations", 
      path: "/citizen/donations", 
      icon: <Heart size={18} />,
      roles: ["citizen"] 
    },
    // Municipal Links
    { 
      label: "Manage Complaints", 
      path: "/municipal/complaints", 
      icon: <ClipboardList size={18} />,
      roles: ["municipal"] 
    },
    { 
      label: "Announcements", 
      path: "/municipal/announcements", 
      icon: <Megaphone size={18} />,
      roles: ["municipal", "citizen"] 
    },
    // Admin Links
    { 
      label: "Manage Users", 
      path: "/admin/users", 
      icon: <Users size={18} />,
      roles: ["admin"] 
    },
    { 
      label: "Review Requests", 
      path: "/admin/municipal-requests", 
      icon: <FileCheck size={18} />,
      roles: ["admin"] 
    },
    { 
        label: "All Donations", 
        path: "/admin/all-donations", 
        icon: <Heart size={18} />,
        roles: ["admin"] 
    },
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
        {/* Branding */}
        <Link to={user ? getDashboardLink() : "/about"} className="navbar-logo">
          <div className="logo-icon">SS</div>
          <span className="logo-text">Sundar Samadhan</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links-desktop">
          {filteredLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${isActive(link.path) ? "active" : ""}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Actions Section */}
        <div className="navbar-actions">
          {user ? (
            <>
              <NotificationBell />
              <Link to="/profile" className={`nav-icon-link profile-link ${isActive("/profile") ? "active" : ""}`} title="My Profile">
                <User size={22} />
              </Link>
              <button onClick={handleLogout} className="nav-icon-link logout-btn-nav" title="Logout">
                <LogOut size={22} />
              </button>
            </>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Join us</Link>
            </div>
          )}
          
          {/* Mobile Menu Toggle */}
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
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="mobile-menu-divider"></div>
            <Link 
              to="/profile" 
              className="mobile-nav-link" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>My Profile</span>
            </Link>
            <button onClick={handleLogout} className="mobile-nav-link logout-text-nav">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
