import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// ✅ Singleton socket (StrictMode double-connect se bachne ke liye)
let globalSocket = null;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const isConnecting = useRef(false);

  // ============================================================
  // ✅ LOGIN HONE PE UNREAD COUNTS FETCH KAREIN
  // ============================================================
  // Jab user login karta hai, toh API se saari conversations laayein
  // aur unka unreadCount nikaal kar state mein set karein.
  // Isse purane unread messages bhi count honge.
  // ============================================================
  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:8000/api/messages/conversations",
        { headers: { Authorization: `Bearer ${token}` } },
      );

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

    const newSocket = io("http://localhost:8000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      isConnecting.current = false;

      // ✅ Socket connect hone ke baad bhi counts refresh karein
      // (taake jo messages socket connect hone se pehle aaye woh bhi count hon)
      fetchUnreadCounts();
    });

    newSocket.on("connect_error", (err) => {
      console.warn("⚠️ Socket connection warning:", err.message);
      isConnecting.current = false;
    });

    // ✅ Naya message aaye toh unread count badhayein
    newSocket.on("newMessage", (message) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [message.senderId]: (prev[message.senderId] || 0) + 1,
      }));
    });

    globalSocket = newSocket;
    setSocket(newSocket);

    // Cleanup — StrictMode ke dauraan socket disconnect na karein
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
        // ✅ Login hua — unread counts fetch karein
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
        fetchUnreadCounts, // ✅ Export karein taake ChatList bhi use kar sake
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};