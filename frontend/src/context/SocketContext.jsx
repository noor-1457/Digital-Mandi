import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// ✅ Socket ko component ke bahar rakhein (singleton)
let globalSocket = null;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const isConnecting = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Login nahi hai → kuch na karein
    if (!token || !user) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
        setSocket(null);
      }
      return;
    }

    // ✅ Agar socket already connected hai toh dobara connect na karein
    if (globalSocket?.connected) {
      setSocket(globalSocket);
      return;
    }

    // ✅ Multiple connect attempts rok
    if (isConnecting.current) return;
    isConnecting.current = true;

    // Naya socket banayein
    const newSocket = io("http://localhost:8000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      isConnecting.current = false;
    });

    newSocket.on("connect_error", (err) => {
      console.warn("⚠️ Socket connection warning:", err.message);
      isConnecting.current = false;
    });

    newSocket.on("newMessage", (message) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [message.senderId]: (prev[message.senderId] || 0) + 1,
      }));
    });

    globalSocket = newSocket;
    setSocket(newSocket);

    // ✅ Cleanup — StrictMode ke dauraan socket ko disconnect NA karein
    return () => {
      // Yeh cleanup sirf tab chalega jab component truly unmount ho
      // StrictMode mein double-invoke hota hai, isliye hum kuch nahi karte
    };
  }, []);

  // Logout hone pe socket disconnect karein
  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !user) {
        if (globalSocket) {
          globalSocket.disconnect();
          globalSocket = null;
          setSocket(null);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const clearUnread = (userId) => {
    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const totalUnread = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        unreadCounts,
        clearUnread,
        totalUnread,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};