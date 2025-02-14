import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8001", {
      auth: {
        token: localStorage.getItem("token"), // Send JWT token
      },
    });

    setSocket(newSocket);

    // Log connection status
    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;