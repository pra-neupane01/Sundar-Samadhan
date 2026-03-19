import { useContext, useState, useRef, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { Bell, Check, Trash2 } from "lucide-react";

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-200 transition-colors duration-200"
      >
        <Bell size={24} className="text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg shadow-slate-200 border border-slate-100 overflow-hidden z-[200]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-4 hover:bg-slate-50 transition ${
                      notif.isRead ? "opacity-75" : "bg-slate-50/50 font-medium"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm text-slate-800">{notif.message}</p>
                        <span className="text-xs text-slate-500 mt-1 block">
                          {new Date(notif.id).toLocaleTimeString()}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-slate-400 hover:text-green-500 shrink-0"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
