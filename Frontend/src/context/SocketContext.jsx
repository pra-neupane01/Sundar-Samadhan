import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

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

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
