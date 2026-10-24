import { useEffect, useState } from "react";
import api from "../utils/api";
import { Search, MessageCircle, Loader2 } from "lucide-react";

export default function ChatList({ onSelectChat, }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(
          "/api/messages/conversations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(response.data || []);
      } catch (err) {
        console.error("Conversations fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filtered = conversations.filter((c) =>
    c.otherUser?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#006400]" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4e8]">
          <MessageCircle size={28} className="text-[#006400]" />
        </div>
        <h3 className="text-sm font-bold text-[#033303] mb-1">No chats yet</h3>
        <p className="text-xs text-[#788174]">
          Order karein ya farmer se contact karein chat shuru karne ke liye.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-[#edf0e7] p-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa296]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-full border border-[#e2e7dc] bg-[#fafbf8] pl-9 pr-3 py-2 text-xs outline-none focus:border-[#8da94d]"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((conv) => {
          const otherUser = conv.otherUser;
          const unread = conv.unreadCount || 0;

          return (
            <button
              key={conv._id}
              onClick={() => onSelectChat(conv)}
              className="flex w-full items-center gap-3 border-b border-[#f5f7f0] px-3 py-3 text-left transition hover:bg-[#f8faf5] cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3e5] text-[#2f8f1f] font-bold text-sm">
                  {otherUser?.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-bold text-[#033303]">
                    {otherUser?.fullName || "User"}
                  </p>
                  <span className="shrink-0 text-[10px] text-[#8a9285] capitalize">
                    {otherUser?.userRole}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[#788174]">
                  {conv.lastMessage || "Start a conversation"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}