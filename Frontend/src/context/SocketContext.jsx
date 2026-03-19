import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

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
        for (let i = 1; i <= 10; i++) {
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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, markAsRead, clearAllNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
