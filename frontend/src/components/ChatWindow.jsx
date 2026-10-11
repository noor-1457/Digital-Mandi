import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useSocket } from "../context/SocketContext";

export default function ChatWindow({ conversation, currentUserId, onBack }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const otherUser = conversation.otherUser;
  const conversationId = conversation._id;

  // Messages fetch karein
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/messages/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data || []);

        // Read mark karein
        await axios.put(
          `http://localhost:8000/api/messages/read/${conversationId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Messages fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // Sirf is conversation ke messages
      if (
        message.conversationId === conversationId ||
        message.senderId === otherUser._id
      ) {
        setMessages((prev) => [...prev, message]);

        // Read mark karein
        const token = localStorage.getItem("token");
        axios.put(
          `http://localhost:8000/api/messages/read/${conversationId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    };

    const handleTyping = (data) => {
      if (data.userId === otherUser._id) {
        setOtherTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      if (data.userId === otherUser._id) {
        setOtherTyping(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);
    socket.on("userStoppedTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
    };
  }, [socket, conversationId, otherUser._id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    const messageText = text.trim();
    setText("");

    try {
      // ✅ Socket se bhejein (real-time)
      if (socket) {
        socket.emit("sendMessage", {
          receiverId: otherUser._id,
          text: messageText,
        });
      } else {
        // Fallback: REST API
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/messages/send",
          { receiverId: otherUser._id, text: messageText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => [...prev, response.data]);
      }

      // Typing stop
      socket?.emit("stopTyping", { receiverId: otherUser._id });
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleTypingChange = (e) => {
    setText(e.target.value);

    if (socket) {
      socket.emit("typing", {
        receiverId: otherUser._id,
        conversationId,
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId: otherUser._id });
      }, 1500);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#edf0e7] bg-[#fbfcf8] px-3 py-2.5">
        <button
          onClick={onBack}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#52604b] hover:bg-[#f0f4e8] cursor-pointer"
        >
          <ArrowLeft size={15} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf3e5] text-[#2f8f1f] font-bold text-xs">
          {otherUser?.fullName?.charAt(0).toUpperCase() || "?"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-[#033303]">
            {otherUser?.fullName || "User"}
          </p>
          <p className="text-[10px] text-[#8a9285] capitalize">
            {otherTyping ? "typing..." : otherUser?.userRole}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#fafbf8] p-3 space-y-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 size={20} className="animate-spin text-[#006400]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-[#8a9285]">
            Koi message nahi. Pehla message bhejein!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                    isMe
                      ? "bg-[#006400] text-white rounded-br-md"
                      : "bg-white text-[#033303] border border-[#e8ebdf] rounded-bl-md"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`mt-1 text-[9px] ${
                      isMe ? "text-white/70" : "text-[#8a9285]"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("en-PK", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-[#edf0e7] bg-white p-2"
      >
        <input
          type="text"
          value={text}
          onChange={handleTypingChange}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-[#e2e7dc] bg-[#fafbf8] px-3 py-2 text-xs outline-none focus:border-[#8da94d]"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006400] text-white transition hover:bg-[#004d00] disabled:opacity-50 cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}