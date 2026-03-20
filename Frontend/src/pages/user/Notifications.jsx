import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { Bell, Check, Trash2, Clock, Info } from "lucide-react";
import { markAllNotificationsAsRead } from "../../services/notificationService";
import toast from "react-hot-toast";

const Notifications = () => {
  const { notifications, markAsRead, setNotifications } = useContext(SocketContext);

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notification History</h1>
            <p className="text-slate-500 mt-1">Stay updated with your latest alerts and activities.</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Check size={18} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-full mb-6">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No notifications yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto">When you receive alerts, updates, or messages, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markAsRead(notif.id)}
                className={`group relative bg-white p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  notif.isRead 
                    ? "border-slate-100 opacity-80" 
                    : "border-slate-200 shadow-md shadow-slate-200/50 scale-[1.01] bg-gradient-to-r from-white to-slate-50/30"
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                )}
                
                <div className="flex gap-5">
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    notif.isRead ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600"
                  }`}>
                    {notif.type === 'overdueComplaint' ? <Clock size={24} /> : <Info size={24} />}
                  </div>

                  <div className="grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-lg transition-colors ${notif.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                        {notif.title || "Update"}
                      </h4>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {getTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-base leading-relaxed ${notif.isRead ? "text-slate-500" : "text-slate-600"}`}>
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Check size={20} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
