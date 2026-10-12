import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, LogIn } from "lucide-react";
import toast from "react-hot-toast"; // ✅ Toast import
import { useSocket } from "../context/SocketContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
// import notificationSound from "/notification-sound.WAV"; // ✅ Notification sound import
export default function FloatingChat() {
  const navigate = useNavigate();
  const { socket, unreadCounts, clearUnread, totalUnread } = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!token && !!user;
  // ============================================================
  // ✅ TOAST NOTIFICATION — jab naya message aaye
  // ============================================================
  // Yeh useEffect socket pe "newMessage" event sunta hai.
  // Jab dusra user message bhejta hai, toast show hota hai.
  // ============================================================
  useEffect(() => {
    if (!socket || !isLoggedIn) return;

    const handleNewMessage = (message) => {
      // Agar chat panel open hai aur wahi conversation selected hai → toast na dikhayein
      const isCurrentChat =
        isOpen &&
        selectedConversation &&
        (message.senderId === selectedConversation.otherUser?._id ||
          message.conversationId === selectedConversation._id);

      if (isCurrentChat) return;
      // ✅ Sound play karein
      try {
        const audio = new Audio("/notification-sound.WAV");
        audio.volume = 0.5; // 50% volume
        audio.play().catch((err) => {
          console.log("Sound play blocked (browser policy):", err.message);
        });
      } catch (err) {
        console.log("Sound error:", err);
      }
      // Toast show karein
      toast.custom(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              setIsOpen(true);
              // Conversation set karein (agar available hai)
              if (message.conversationId) {
                // Minimal conversation object banayein
                setSelectedConversation({
                  _id: message.conversationId,
                  otherUser: {
                    _id: message.senderId,
                    fullName: message.senderName || "New message",
                  },
                });
              }
            }}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-80 cursor-pointer items-start gap-3 rounded-xl bg-white p-3 shadow-lg border border-[#e8ebdf]`}
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3e5] text-[#2f8f1f] font-bold">
              {message.senderName?.charAt(0).toUpperCase() || "💬"}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#033303]">
                {message.senderName || "New message"}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#788174]">
                {message.text}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="text-[#8a9285] hover:text-[#033303] cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ),
        { duration: 4000, position: "top-right" },
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, isLoggedIn, isOpen, selectedConversation]);

  // ============================================================
  // ✅ "openChat" event — OrderDetail se aata hai
  // ============================================================
  useEffect(() => {
    const handleOpenChat = (e) => {
      if (e.detail?.conversation) {
        setIsOpen(true);
        setSelectedConversation(e.detail.conversation);
      }
    };

    window.addEventListener("openChat", handleOpenChat);
    return () => window.removeEventListener("openChat", handleOpenChat);
  }, []);

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectChat = (conversation) => {
    setSelectedConversation(conversation);
    if (conversation.otherUser?._id) {
      clearUnread(conversation.otherUser._id);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedConversation(null);
  };

  return (
    <>
      {/* ============ FLOATING BUTTON ============ */}
      <button
        onClick={handleButtonClick}
        aria-label="Chat"
        className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#006400] text-white shadow-lg shadow-[#006400]/30 transition-all hover:scale-105 hover:bg-[#004d00] cursor-pointer bottom-4 right-4 sm:bottom-6 sm:right-6"
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

          <div
            className="fixed z-50 bg-white shadow-2xl overflow-hidden
                       sm:bottom-24 sm:right-6 sm:w-80 sm:h-[480px] sm:rounded-2xl sm:border sm:border-[#e8ebdf]
                       bottom-0 right-0 left-0 top-0 sm:left-auto sm:top-auto
                       flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#006400] px-4 py-3 text-white shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <h2 className="text-white text-sm font-bold">Messages</h2>
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
                <ChatWindow
                  conversation={selectedConversation}
                  currentUserId={user._id}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
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
