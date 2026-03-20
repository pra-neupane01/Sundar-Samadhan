import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { getNotifications, markNotificationAsRead } from "../services/notificationService";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // --- FETCH INITIAL NOTIFICATIONS FROM DB ---
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        if (res.success) {
          // Flatten/normalize the data from DB to match internal structure
          const dbNotifs = res.data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            isRead: n.is_read,
            createdAt: n.created_at
          }));
          setNotifications(dbNotifs);
        }
      } catch (error) {
        console.error("Failed to fetch notifications from DB:", error);
      }
    };
    fetchNotifications();

    // Connect to the backend
    const newSocket = io("http://localhost:4849");
    
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      // Join general user room
      if (user?.id) {
        newSocket.emit("joinUser", user.id);
      }
      
      // If municipal officer, they can manage ALL wards now, so join all ward rooms to get notifications
      if (user?.role === "municipal" || user?.role === "admin") {
        for (let i = 1; i <= 15; i++) {
          newSocket.emit("joinWard", i);
        }
      } else if (user?.ward_number) {
        // For citizens, just join their own ward
        newSocket.emit("joinWard", user.ward_number);
      }
      
      // Join Role Room (triggers overdue check in backend)
      if (user?.role) {
        newSocket.emit("joinRole", user.role);
      }
    });

    // --- NOTIFICATION LISTENERS ---

    const addNotification = (notif) => {
      setNotifications((prev) => [{ ...notif, id: Date.now(), isRead: false }, ...prev]);
    };

    // Citizen: Status Update
    newSocket.on("statusUpdated", (data) => {
      toast.success(`Complaint Status Updated: ${data.message}`);
      addNotification({ type: "statusUpdated", title: "Status Updated", message: data.message, data });
    });

    // Municipal: New Ward Complaint
    newSocket.on("newWardComplaint", (data) => {
      console.log("RECEIVED: newWardComplaint", data);
      toast(`New Complaint in Ward ${data.ward_number}: ${data.title}`, { icon: '📢' });
      addNotification({ type: "newWardComplaint", title: "New Ward Complaint", message: `New complaint in Ward ${data.ward_number}: ${data.title}`, data });
    });

    // Municipal/Ward-based: Overdue Complaint
    newSocket.on("overdueComplaint", (data) => {
      toast.error(`Overdue Complaint Alert (Ward ${data.ward_number}): ${data.message}`);
      addNotification({ type: "overdueComplaint", title: "Overdue Complaint", message: data.message, data });
    });

    // Admin: High Donation
    newSocket.on("highDonation", (data) => {
      toast.success(`High Donation Received: $${data.amount}`);
      addNotification({ type: "highDonation", title: "High Donation", message: `A user donated $${data.amount}!`, data });
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("statusUpdated");
      newSocket.off("newWardComplaint");
      newSocket.off("overdueComplaint");
      newSocket.off("highDonation");
      newSocket.disconnect();
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      // 🔹 Persist in DB
      const res = await markNotificationAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
        );
      }
    } catch (error) {
      console.error("Failed to mark as read in DB:", error);
      // Still update UI for better UX even if DB fails temporarily?
      // For now, only if DB succeeds to keep them synced.
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications, markAsRead, clearAllNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
