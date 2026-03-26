import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { Bell, Check, Trash2, Clock, Info, ExternalLink } from "lucide-react";
import { markAllNotificationsAsRead } from "../../services/notificationService";
import toast, { Toaster } from "react-hot-toast";

const Notifications = () => {
  const { notifications, markAsRead, setNotifications, clearAllNotifications } = useContext(SocketContext);

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="page-shell">
      <Toaster position="top-right" />
      <div className="content-container" style={{ maxWidth: "800px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h1 className="page-title">Notification History</h1>
            <p className="page-subtitle">Stay updated with your latest alerts and activities.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {notifications.length > 0 && (
                <button 
                    onClick={clearAllNotifications}
                    className="btn btn-ghost btn-sm text-red-600"
                >
                    <Trash2 size={16} /> Clear All
                </button>
            )}
            {notifications.some(n => !n.isRead) && (
                <button
                onClick={handleMarkAllRead}
                className="btn btn-secondary btn-sm"
                >
                <Check size={16} /> Mark all read
                </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state-v2 card">
            <div className="empty-icon">
              <Bell size={40} />
            </div>
            <h3>No notifications yet</h3>
            <p>Your timeline is clear. Important updates and alerts will appear here.</p>
          </div>
        ) : (
          <div className="notif-full-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markAsRead(notif.id)}
                className={`card notif-card-item ${notif.isRead ? "read" : "unread"}`}
              >
                <div className="notif-card-body">
                  <div className={`notif-type-icon ${notif.isRead ? "read" : "unread"}`}>
                    {notif.type === 'overdueComplaint' ? <Clock size={20} /> : <Info size={20} />}
                  </div>

                  <div className="notif-card-content">
                    <div className="notif-card-header">
                      <h4 className="notif-card-title">{notif.title || "Update"}</h4>
                      <span className="notif-card-time">{getTimeAgo(notif.id)}</span>
                    </div>
                    <p className="notif-card-message">{notif.message}</p>
                  </div>

                  {!notif.isRead && (
                    <div className="notif-status-indicator">
                        <Check size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .notif-full-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .notif-card-item {
            padding: 20px !important;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .notif-card-item.unread {
            border-left: 4px solid var(--brand-primary);
            background: linear-gradient(to right, #ffffff, #f8fafc);
            transform: scale(1.01);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .notif-card-item.read {
            opacity: 0.75;
            background: #ffffff;
        }
        .notif-card-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .notif-card-body {
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }
        .notif-type-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .notif-type-icon.unread {
            background: var(--surface-base);
            color: var(--brand-primary);
        }
        .notif-type-icon.read {
            background: #f1f5f9;
            color: #94a3b8;
        }
        .notif-card-content {
            flex: 1;
        }
        .notif-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        .notif-card-title {
            font-size: 1rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
        }
        .notif-card-time {
            font-size: 0.75rem;
            font-weight: 600;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .notif-card-message {
            font-size: 0.93rem;
            line-height: 1.5;
            color: #475569;
            margin: 0;
        }
        .notif-status-indicator {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f0fdf4;
            color: #16a34a;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.2s;
        }
        .notif-card-item:hover .notif-status-indicator {
            opacity: 1;
            transform: scale(1);
        }
      `}</style>
    </div>
  );
};

export default Notifications;
