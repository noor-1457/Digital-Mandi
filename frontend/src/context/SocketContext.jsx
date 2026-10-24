import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import api from "../utils/api"; // ✅ Nayi api file import ki

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// ✅ Singleton socket (StrictMode double-connect se bachne ke liye)
let globalSocket = null;

// ✅ URL .env se uthayein
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const isConnecting = useRef(false);

  // ============================================================
  // ✅ LOGIN HONE PE UNREAD COUNTS FETCH KAREIN
  // ============================================================
  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ axios ki jagah api use kiya (baseURL khud handle karega)
      const response = await api.get("/api/messages/conversations");

      // ✅ Har conversation ka unreadCount nikaal kar map banayein
      const counts = {};
      response.data.forEach((conv) => {
        if (conv.unreadCount > 0 && conv.otherUser?._id) {
          counts[conv.otherUser._id] = conv.unreadCount;
        }
      });

      setUnreadCounts(counts);
    } catch (err) {
      console.error("Unread counts fetch error:", err);
    }
  };

  // ============================================================
  // ✅ SOCKET CONNECTION
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
        setSocket(null);
      }
      setUnreadCounts({});
      return;
    }

    // ✅ Pehle unread counts fetch karein
    fetchUnreadCounts();

    // Agar socket already connected hai toh reuse karein
    if (globalSocket?.connected) {
      setSocket(globalSocket);
      return;
    }

    if (isConnecting.current) return;
    isConnecting.current = true;

    // ✅ SOCKET_URL variable use kiya
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      isConnecting.current = false;

      fetchUnreadCounts();
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

    return () => {};
  }, []);

  // ============================================================
  // ✅ localStorage change pe (login/logout) dobara check
  // ============================================================
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
        setUnreadCounts({});
      } else {
        fetchUnreadCounts();
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
        fetchUnreadCounts,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};