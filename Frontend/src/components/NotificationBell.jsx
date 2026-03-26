import { useContext, useState, useRef, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { notifications, markAsRead, clearAllNotifications } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      {/* Bell Button */}
      <button className="notif-bell-btn" onClick={() => setIsOpen(!isOpen)} title="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge-count">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <h4>Notifications</h4>
            {notifications.length > 0 && (
              <button onClick={clearAllNotifications} className="notif-clear-btn">
                <Trash2 size={13} /> Clear all
              </button>
            )}
          </div>

          <div className="notif-dropdown-body">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={28} />
                <p>No notifications yet</p>
              </div>
            ) : (
              <ul className="notif-list">
                {notifications.map((notif) => (
                  <li key={notif.id} className={`notif-item ${notif.isRead ? "read" : "unread"}`}>
                    <div className="notif-item-content">
                      <div className={`notif-dot ${notif.isRead ? "" : "active"}`}></div>
                      <div className="notif-item-text">
                        <p className="notif-message">{notif.message}</p>
                        <span className="notif-time">
                          {notif.createdAt || notif.created_at 
                            ? new Date(notif.createdAt || notif.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: "2-digit", minute: "2-digit" }) 
                            : "Just now"}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <button onClick={() => markAsRead(notif.id)} className="notif-mark-btn" title="Mark as read">
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/notifications" onClick={() => setIsOpen(false)} className="notif-dropdown-footer">
            View All Notifications <ExternalLink size={13} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
