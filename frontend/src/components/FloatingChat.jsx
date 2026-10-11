import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, LogIn } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function FloatingChat() {
  const navigate = useNavigate();
  const { socket, unreadCounts, clearUnread, totalUnread } = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!token && !!user;

  // Login nahi hai toh socket bhi nahi — button still dikhe lekin login option
  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  // Chat select hone pe unread clear karein
  const handleSelectChat = (conversation) => {
    setSelectedConversation(conversation);
    clearUnread(conversation.otherUser._id);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedConversation(null);
  };

useEffect(() => {
  const handleOpenChat = (e) => {
    setIsOpen(true);
    setSelectedConversation(e.detail.conversation);
  };

  window.addEventListener("openChat", handleOpenChat);
  return () => window.removeEventListener("openChat", handleOpenChat);
}, []);

  return (
    <>
      {/* ============ FLOATING BUTTON ============ */}
      <button
        onClick={handleButtonClick}
        aria-label="Chat"
        className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#006400] text-white shadow-lg shadow-[#006400]/30 transition-all hover:scale-105 hover:bg-[#004d00] cursor-pointer ${
          isOpen ? "bottom-4 right-4 sm:bottom-6 sm:right-6" : "bottom-4 right-4 sm:bottom-6 sm:right-6"
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}

        {/* Unread badge */}
        {!isOpen && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      {/* ============ CHAT PANEL ============ */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          />

          <div className="fixed z-50 bg-white shadow-2xl overflow-hidden
                          /* Desktop */
                          sm:bottom-24 sm:right-6 sm:w-80 sm:h-[480px] sm:rounded-2xl sm:border sm:border-[#e8ebdf]
                          /* Mobile — full screen */
                          bottom-0 right-0 left-0 top-0 sm:left-auto sm:top-auto
                          flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#006400] px-4 py-3 text-white shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <h3 className="text-sm font-bold">Messages</h3>
              </div>
              <button
                onClick={handleClose}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {!isLoggedIn ? (
                // ===== NOT LOGGED IN =====
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4e8]">
                    <LogIn size={26} className="text-[#006400]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#033303] mb-1">
                    Login Required
                  </h3>
                  <p className="text-xs text-[#788174] mb-5">
                    Chat karne ke liye login karein.
                  </p>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate("/login", {
                        state: { from: window.location.pathname },
                      });
                    }}
                    className="rounded-xl bg-[#006400] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#004d00] cursor-pointer"
                  >
                    Login / Register
                  </button>
                </div>
              ) : selectedConversation ? (
                // ===== CHAT WINDOW =====
                <ChatWindow
                  conversation={selectedConversation}
                  currentUserId={user._id}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                // ===== CHAT LIST =====
                <ChatList
                  onSelectChat={handleSelectChat}
                  currentUserId={user._id}
                  unreadCounts={unreadCounts}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}