import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  MapPin,
  Calendar,
} from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";

export default function BuyerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  // ================= FETCH ORDERS =================
  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      console.error("Buyer orders fetch error:", err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= AUTO REFRESH (every 30s) =================
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ================= STATUS STYLES =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <Clock size={13} />,
          label: "Pending",
          hint: "Waiting for farmer to confirm",
        };
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Truck size={13} />,
          label: "Confirmed",
          hint: "Farmer is preparing your order",
        };
      case "delivered":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle2 size={13} />,
          label: "Delivered",
          hint: "Order delivered successfully",
        };
      case "cancelled":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: <XCircle size={13} />,
          label: "Cancelled",
          hint: "Order was cancelled by farmer",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: null,
          label: status,
          hint: "",
        };
    }
  };

  // ================= FILTER + COUNTS =================
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
        <Sidebar />
        <section className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f1] px-4 pt-[100px]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#dce6c9] border-t-[#006400]" />
            <p className="font-medium text-[#52604b]">Loading your orders...</p>
          </div>
        </section>
      </>
    );
  }

  // ================= EMPTY STATE =================
  if (orders.length === 0) {
    return (
      <>
        <Sidebar />
        <section className="min-h-screen bg-[#f8f7f2] lg:ml-70 pt-20 lg:pt-6 px-4 sm:px-6 pb-12">
          <div className="max-w-md rounded-3xl border border-[#e7eadf] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f4e8]">
              <ShoppingBag size={36} className="text-[#006400]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#033303]">
              No Orders Yet
            </h2>
            <p className="mb-6 text-sm text-[#788174]">
              Start shopping fresh produce from local farmers.
            </p>
            <button
              onClick={() => navigate("/buyer-products")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#006400] px-6 py-3 font-semibold text-white transition hover:bg-[#004d00] cursor-pointer"
            >
              Browse Products
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </>
    );
  }

  // ================= MAIN UI =================
  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-[#f8f7f2] lg:ml-70 pt-20 lg:pt-6 px-4 sm:px-6 pb-12]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* ================= HEADER ================= */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-[#033303] sm:text-3xl">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-[#788174]">
                Track your orders and their status
              </p>
            </div>

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-[#e2e7dc] bg-white px-4 py-2 text-xs font-bold text-[#2f8f1f] transition hover:bg-[#f8faf5] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* ================= ERROR ================= */}
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          {/* ================= FILTER TABS ================= */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
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

          {/* ================= ORDERS LIST ================= */}
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-[#e8ebdf] bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4e8]">
                <Package size={28} className="text-[#006400]" />
              </div>
              <h2 className="text-xl font-bold text-[#033303] mb-1">
                No {filter !== "all" ? filter : ""} orders
              </h2>
              <p className="text-sm text-[#788174]">
                Try a different filter or start shopping.
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
                    {/* ================= HEADER ================= */}
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
                        <p className="text-[11px] text-[#8a9285] inline-flex items-center gap-1">
                          <Calendar size={11} />
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
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* ================= STATUS HINT ================= */}
                    <div
                      className={`flex items-center gap-2 border-b border-[#edf0e7] px-5 py-2.5 ${statusStyle.bg}`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full bg-white ${statusStyle.text}`}
                      >
                        {statusStyle.icon}
                      </div>
                      <p
                        className={`text-xs font-semibold ${statusStyle.text}`}
                      >
                        {statusStyle.hint}
                      </p>
                    </div>

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
                              {product?.location && (
                                <p className="mt-0.5 text-[10px] text-[#8a9285] inline-flex items-center gap-1">
                                  <MapPin size={10} />
                                  {product.location}
                                </p>
                              )}
                            </div>

                            <p className="shrink-0 text-sm font-bold text-[#033303]">
                              Rs.{" "}
                              {(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* ================= DELIVERY ADDRESS ================= */}
                    {order.shippingAddress && (
                      <div className="border-t border-[#edf0e7] px-5 py-3">
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={13}
                            className="mt-0.5 text-[#2f8f1f] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-[#8a9285]">
                              Delivery Address
                            </p>
                            <p className="text-xs text-[#033303] mt-0.5">
                              {order.shippingAddress.fullName} •{" "}
                              {order.shippingAddress.phone}
                            </p>
                            <p className="text-xs text-[#788174]">
                              {order.shippingAddress.address},{" "}
                              {order.shippingAddress.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= FOOTER ================= */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e7] bg-[#fbfcf8] px-5 py-3.5">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#8a9285]">
                            Payment
                          </p>
                          <p className="text-xs font-bold text-[#033303]">
                            {order.paymentMethod || "COD"}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-[#e2e7dc]" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#8a9285]">
                            Total
                          </p>
                          <p className="text-lg font-extrabold text-[#006400]">
                            Rs. {order.totalAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Status message */}
                      <div>
                        {order.status === "pending" && (
                          <p className="text-[11px] text-[#8a9285] italic">
                            ⏳ Waiting for farmer confirmation
                          </p>
                        )}
                        {order.status === "confirmed" && (
                          <p className="text-[11px] text-blue-600 italic">
                            🚚 Farmer confirmed! Preparing your order
                          </p>
                        )}
                        {order.status === "delivered" && (
                          <p className="text-[11px] text-green-600 italic">
                            ✅ Delivered! Enjoy your fresh produce
                          </p>
                        )}
                        {order.status === "cancelled" && (
                          <p className="text-[11px] text-rose-600 italic">
                            ❌ Order was cancelled
                          </p>
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
