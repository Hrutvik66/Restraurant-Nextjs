// socketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"; // Import Socket type

interface SocketContextType {
  socket: Socket | null;
}
// Create Socket Context
const SocketContext = createContext<SocketContextType>({
  socket: null,
}); // Specify the type

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Socket Provider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null); // Specify the type

  useEffect(() => {
    const newSocket = io("http://localhost:3001"); // Connect to your server
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Clean up the socket connection when unmounting
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};
