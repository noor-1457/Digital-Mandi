import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  Leaf,
  MessageSquare,
  MailOpen,
} from "lucide-react";
function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch Data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [statsRes, usersRes, productsRes, ordersRes, contactRes] =
        await Promise.all([
          axios.get("http://localhost:8000/api/admin/stats", config),
          axios.get("http://localhost:8000/api/admin/users", config),
          axios.get("http://localhost:8000/api/admin/products", config),
          axios.get("http://localhost:8000/api/admin/orders", config),
          axios.get("http://localhost:8000/api/contact", config),
        ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
      setContactMessages(contactRes.data.messages);
    } catch (err) {
      console.error("Admin fetch error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleBlockToggle = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(
        `http://localhost:8000/api/admin/users/${userId}/block`,
        {},
        config,
      );
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u)),
      );
    } catch (err) {
      alert("Failed to update user status", err);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <>
      <main className="min-h-screen pt-20 lg:pt-6 px-4 sm:px-6 pb-12 bg-[#f8f7f2]">
        <div className="max-w-7xl mx-auto">
          {/* ================= HEADER ================= */}
          <div className="bg-[#006400] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fdd835] flex items-center justify-center shadow-lg">
                  <Leaf size={28} className="text-[#006400]" />
                </div>
                <div>
                  <p className="text-sm text-[#cbd5c0]">Digital Mandi</p>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Admin Dashboard
                  </h1>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center cursor-pointer gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* ================= TABS NAVIGATION ================= */}
          <div className="flex overflow-x-auto gap-2 mt-8 bg-white p-2 rounded-2xl shadow-sm border border-[#e3e7dc]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "overview"
                  ? "bg-[#006400] text-white shadow-md"
                  : "text-[#52604b] hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "users"
                  ? "bg-[#006400] text-white shadow-md"
                  : "text-[#52604b] hover:bg-gray-50"
              }`}
            >
              <Users size={18} /> Users
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "products"
                  ? "bg-[#006400] text-white shadow-md"
                  : "text-[#52604b] hover:bg-gray-50"
              }`}
            >
              <Package size={18} /> Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "orders"
                  ? "bg-[#006400] text-white shadow-md"
                  : "text-[#52604b] hover:bg-gray-50"
              }`}
            >
              <ShoppingBag size={18} /> Orders
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "messages"
                  ? "bg-[#006400] text-white shadow-md"
                  : "text-[#52604b] hover:bg-gray-50"
              }`}
            >
              <MessageSquare size={18} /> Messages
            </button>
          </div>

          {/* ================= LOADING STATE ================= */}
          {loading ? (
            <div className="mt-12 text-center text-[#737b70]">
              <div className="h-10 w-10 border-4 border-[#006400] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Loading Data...
            </div>
          ) : (
            <div className="mt-6">
              {/* ================= TAB 1: OVERVIEW ================= */}
              {activeTab === "overview" && stats && (
                <div className="space-y-6 animate-fade-in">
                  {/* STATS CARDS */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#607b37] flex items-center justify-center mb-4">
                        <Users size={24} />
                      </div>
                      <p className="text-sm text-[#737b70]">Total Users</p>
                      <h3 className="text-2xl font-bold text-[#293829]">
                        {stats.totalUsers}
                      </h3>
                    </div>

                    <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#f8eee5] text-[#966235] flex items-center justify-center mb-4">
                        <Package size={24} />
                      </div>
                      <p className="text-sm text-[#737b70]">Total Products</p>
                      <h3 className="text-2xl font-bold text-[#293829]">
                        {stats.totalProducts}
                      </h3>
                    </div>

                    <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#607b37] flex items-center justify-center mb-4">
                        <ShoppingBag size={24} />
                      </div>
                      <p className="text-sm text-[#737b70]">Total Orders</p>
                      <h3 className="text-2xl font-bold text-[#293829]">
                        {stats.totalOrders}
                      </h3>
                    </div>

                    <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#2f8f1f] flex items-center justify-center mb-4">
                        <DollarSign size={24} />
                      </div>
                      <p className="text-sm text-[#737b70]">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-[#293829]">
                        Rs. {stats.totalRevenue.toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  {/* BREAKDOWN */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-[#293829] mb-4">
                        User Breakdown
                      </h3>
                      <div className="flex justify-between items-center p-4 bg-[#f8f9f5] rounded-xl mb-2">
                        <span className="font-medium text-[#52604b]">
                          Farmers
                        </span>
                        <span className="font-bold text-[#006400] text-xl">
                          {stats.totalFarmers}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-[#f8f9f5] rounded-xl">
                        <span className="font-medium text-[#52604b]">
                          Buyers
                        </span>
                        <span className="font-bold text-[#006400] text-xl">
                          {stats.totalBuyers}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                      <ShieldCheck size={48} className="text-[#006400] mb-3" />
                      <h3 className="text-lg font-bold text-[#293829]">
                        System Healthy
                      </h3>
                      <p className="text-sm text-[#737b70] mt-1">
                        All services are running smoothly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: USERS ================= */}
              {activeTab === "users" && (
                <div className="bg-white border border-[#e3e7dc] rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9f5] text-[#52604b] text-sm">
                      <tr>
                        <th className="p-4 font-semibold">User Details</th>
                        <th className="p-4 font-semibold">Role</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0e7]">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-[#fafbf8]">
                          <td className="p-4">
                            <p className="font-bold text-[#293829]">
                              {u.fullName}
                            </p>
                            <p className="text-xs text-[#737b70]">{u.email}</p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.userRole === "farmer"
                                  ? "bg-green-100 text-green-700"
                                  : u.userRole === "buyer"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {u.userRole}
                            </span>
                          </td>
                          <td className="p-4">
                            {u.isBlocked ? (
                              <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                                <ShieldAlert size={14} /> Blocked
                              </span>
                            ) : (
                              <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                                <ShieldCheck size={14} /> Active
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleBlockToggle(u._id)}
                              className={`text-xs px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                                u.isBlocked
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {u.isBlocked ? "Unblock" : "Block"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ================= TAB 3: PRODUCTS ================= */}
              {activeTab === "products" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                  {products.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white border border-[#e3e7dc] rounded-2xl p-4 flex gap-4 shadow-sm hover:-translate-y-1 transition-all"
                    >
                      <img
                        src={
                          p.image?.startsWith("http")
                            ? p.image
                            : `http://localhost:8000/${p.image}`
                        }
                        alt={p.name}
                        className="w-20 h-20 rounded-xl object-cover bg-[#f8f9f5]"
                      />
                      <div>
                        <h4 className="font-bold text-[#293829] line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#737b70] mt-0.5">
                          By: {p.farmer?.fullName || "Unknown"}
                        </p>
                        <p className="text-sm font-bold text-[#006400] mt-2">
                          Rs. {p.price}
                        </p>
                        <p className="text-[10px] bg-gray-100 text-gray-500 inline-block px-2 py-0.5 rounded mt-1">
                          Stock: {p.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ================= TAB 4: ORDERS ================= */}
              {activeTab === "orders" && (
                <div className="bg-white border border-[#e3e7dc] rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9f5] text-[#52604b] text-sm">
                      <tr>
                        <th className="p-4 font-semibold">Order ID</th>
                        <th className="p-4 font-semibold">Buyer</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0e7]">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-[#fafbf8]">
                          <td className="p-4 text-xs font-mono text-[#52604b]">
                            #{o._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="p-4 text-sm font-bold text-[#293829]">
                            {o.buyerId?.fullName || "Deleted User"}
                          </td>
                          <td className="p-4 font-bold text-[#006400]">
                            Rs. {o.totalAmount}
                          </td>
                          <td className="p-4 text-xs text-[#737b70]">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#52604b] bg-[#f8f9f5] border border-[#e3e7dc] px-2 py-1 rounded-md">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ================= TAB 5: MESSAGES ================= */}
              {activeTab === "messages" && (
                <div className="space-y-4 animate-fade-in">
                  {contactMessages.length === 0 ? (
                    <div className="bg-white rounded-2xl border p-10 text-center text-gray-500">
                      No messages yet.
                    </div>
                  ) : (
                    contactMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${
                          msg.status === "unread"
                            ? "border-[#006400] border-l-4"
                            : "border-[#e3e7dc]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-[#293829] text-lg">
                              {msg.subject}
                            </h4>
                            <p className="text-sm text-[#52604b]">
                              From:{" "}
                              <span className="font-semibold">{msg.name}</span>{" "}
                              ({msg.email})
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-400">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                            {msg.status === "unread" && (
                              <button
                                onClick={async () => {
                                  await axios.put(
                                    `http://localhost:8000/api/contact/${msg._id}/read`,
                                    {},
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  setContactMessages((prev) =>
                                    prev.map((m) =>
                                      m._id === msg._id
                                        ? { ...m, status: "read" }
                                        : m,
                                    ),
                                  );
                                }}
                                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold hover:bg-green-200 cursor-pointer"
                              >
                                <MailOpen size={12} /> Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-[#737b70] bg-[#f8f9f5] p-3 rounded-xl mt-3">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;
