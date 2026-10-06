import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  Filter,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function FarmerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/orders/farmer-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Farmer orders fetch error:", err);
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================= UPDATE STATUS =================
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? response.data.order : o)),
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // ================= STATUS STYLES =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <Clock size={13} />,
        };
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Package size={13} />,
        };
      case "delivered":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle2 size={13} />,
        };
      case "cancelled":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: <XCircle size={13} />,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: null,
        };
    }
  };

  // ================= FILTERS + COUNTS =================
  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // ================= LOADING =================
  if (loading) {
    return (
      <>
      <Sidebar/>
        <section className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f1] px-4 pt-[100px]">
          <div className="text-center">
            <Loader2
              size={40}
              className="mx-auto mb-4 animate-spin text-[#006400]"
            />
            <p className="font-medium text-[#52604b]">Loading your orders...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
    <Sidebar/>
      <main className="min-h-screen bg-[#f8f7f2] lg:ml-70 pt-20 lg:pt-6 px-4 sm:px-6 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* ================= HEADER ================= */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-[#033303] sm:text-3xl">
                Incoming Orders
              </h1>
              <p className="mt-1 text-sm text-[#788174]">
                Manage orders from your buyers
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2e7dc] bg-white px-4 py-2">
              <Package size={16} className="text-[#2f8f1f]" />
              <span className="text-sm font-bold text-[#033303]">
                {counts.all}
              </span>
              <span className="text-xs text-[#788174]">total</span>
            </div>
          </div>

          {/* ================= ERROR ================= */}
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          {/* ================= FILTER TABS ================= */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-1.5 text-xs font-semibold text-[#788174]">
              <Filter size={13} />
              Filter:
            </div>

            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  filter === tab.key
                    ? "bg-[#006400] text-white shadow-sm"
                    : "border border-[#e2e7dc] bg-white text-[#566151] hover:bg-[#f8faf5]"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    filter === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-[#edf3e5] text-[#2f8f1f]"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          {/* ================= EMPTY STATE ================= */}
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-[#e8ebdf] bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4e8]">
                <Package size={28} className="text-[#006400]" />
              </div>
              <h2 className="text-xl font-bold text-[#033303] mb-1">
                No {filter !== "all" ? filter : ""} orders
              </h2>
              <p className="text-sm text-[#788174]">
                Orders will appear here when buyers place them.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusStyle = getStatusStyle(order.status);

                return (
                  <div
                    key={order._id}
                    className="overflow-hidden rounded-2xl border border-[#e8ebdf] bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* ================= ORDER HEADER ================= */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e7] bg-[#fbfcf8] px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf3e5]">
                          <Package size={16} className="text-[#2f8f1f]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a9285]">
                            Order ID
                          </p>
                          <p className="font-bold text-[#033303] text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-[11px] text-[#8a9285]">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-PK",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {statusStyle.icon}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* ================= BUYER INFO ================= */}
                    {order.buyerId && (
                      <div className="border-b border-[#edf0e7] px-5 py-3.5">
                        <div className="grid gap-2.5 sm:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f4e8]">
                              <User size={12} className="text-[#2f8f1f]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] text-[#8a9285]">
                                Buyer
                              </p>
                              <p className="truncate text-xs font-semibold text-[#033303]">
                                {order.buyerId.fullName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f4e8]">
                              <Phone size={12} className="text-[#2f8f1f]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] text-[#8a9285]">
                                Phone
                              </p>
                              <p className="truncate text-xs font-semibold text-[#033303]">
                                {order.buyerId.mobileNumber || "N/A"}
                              </p>
                            </div>
                          </div>

                          {order.shippingAddress && (
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f4e8]">
                                <MapPin size={12} className="text-[#2f8f1f]" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] text-[#8a9285]">
                                  Deliver to
                                </p>
                                <p className="truncate text-xs font-semibold text-[#033303]">
                                  {order.shippingAddress.city}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ================= ITEMS ================= */}
                    <div className="divide-y divide-[#f0f3eb] px-5">
                      {order.items.map((item, idx) => {
                        const product = item.productId;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 py-3"
                          >
                            {product?.image && (
                              <img
                                src={
                                  product.image.startsWith("http")
                                    ? product.image
                                    : `http://localhost:8000/${product.image}`
                                }
                                alt={product.name}
                                className="h-14 w-14 rounded-xl object-cover bg-[#f4f6ec]"
                              />
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#033303]">
                                {product?.name || "Product"}
                              </p>
                              <p className="mt-0.5 text-xs text-[#788174]">
                                Qty:{" "}
                                <span className="font-semibold text-[#033303]">
                                  {item.quantity}
                                </span>{" "}
                                × Rs. {item.price}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-bold text-[#033303]">
                              Rs.{" "}
                              {(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* ================= FOOTER + ACTIONS ================= */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e7] bg-[#fbfcf8] px-5 py-3.5">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8a9285]">
                          Total Amount
                        </p>
                        <p className="text-lg font-extrabold text-[#006400]">
                          Rs. {order.totalAmount?.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "confirmed")
                              }
                              disabled={updating === order._id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006400] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#004d00] disabled:opacity-50 cursor-pointer"
                            >
                              {updating === order._id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              Accept Order
                            </button>

                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "cancelled")
                              }
                              disabled={updating === order._id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          </>
                        )}

                        {order.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "delivered")
                            }
                            disabled={updating === order._id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#006400] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#004d00] disabled:opacity-50 cursor-pointer"
                          >
                            {updating === order._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            Mark as Delivered
                          </button>
                        )}

                        {order.status === "delivered" && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                            <CheckCircle2 size={13} />
                            Order Completed
                          </span>
                        )}

                        {order.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600">
                            <XCircle size={13} />
                            Order Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
