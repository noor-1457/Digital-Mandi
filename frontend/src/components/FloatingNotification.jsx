import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

export default function FloatingNotification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { socket } = useSocket();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!token && !!user;

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await axios.get("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isLoggedIn]);

  // ================= SOCKET LISTEN =================
  useEffect(() => {
    if (!socket || !isLoggedIn) return;

    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => socket.off("newNotification");
  }, [socket, isLoggedIn]);

  // ================= CLOSE ON OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= MARK ALL READ =================
  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:8000/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) return null; // Login nahi toh bell nahi dikhega

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50" ref={dropdownRef}>
      {/* ================= FLOATING BELL BUTTON ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white border border-[#e8ebdf] shadow-lg text-[#006400] transition-all hover:scale-105 hover:bg-gray-50 cursor-pointer"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ================= DROPDOWN PANEL ================= */}
      {isOpen && (
        <div className="absolute bottom-16 sm:bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e8ebdf] overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#edf0e7] bg-[#fbfcf8]">
            <h3 className="text-sm font-bold text-[#033303]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#2f8f1f] hover:text-[#006400] cursor-pointer"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-[#8a9285]">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => {
                    // Optional: Click karne pe related page pe bhejein
                    if (notif.type === "order") {
                      const isFarmer = user.userRole === "farmer";
                      navigate(isFarmer ? "/farmer-orders" : "/buyer-orders");
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 border-b border-[#edf0e7] flex gap-3 hover:bg-[#f8faf5] transition cursor-pointer ${
                    !notif.isRead ? "bg-[#f0f7ed]/50" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${!notif.isRead ? "bg-[#006400] text-white" : "bg-[#edf3e5] text-[#2f8f1f]"}`}>
                      <Bell size={14} />
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs ${!notif.isRead ? "font-bold text-[#033303]" : "text-[#4a5743]"}`}>
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-[#788174] mt-0.5 leading-5">
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-[#8a9285] mt-1">
                      {new Date(notif.createdAt).toLocaleString("en-PK", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}