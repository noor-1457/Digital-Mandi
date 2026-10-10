import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
import Sidebar from "../components/Sidebar.jsx";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  // const { products } = useContext(ShopContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ✅ Current user ka role check karein
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isFarmer = user?.userRole === "farmer";
  const isBuyer = user?.userRole === "buyer";

  // ================= FETCH ORDER =================
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrder(response.data.order);
      setError("");
    } catch (err) {
      console.error("Order fetch error:", err);
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // ================= UPDATE STATUS =================
  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setOrder(response.data.order);
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ================= TIMELINE STEPS =================
  const timelineSteps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: Package },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = (status) => {
    if (status === "cancelled") return -1;
    return timelineSteps.findIndex((s) => s.key === status);
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <Clock size={14} />,
          label: "Pending",
        };
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Truck size={14} />,
          label: "Confirmed",
        };
      case "delivered":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle2 size={14} />,
          label: "Delivered",
        };
      case "cancelled":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: <XCircle size={14} />,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: null,
          label: status,
        };
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Sidebar />
        <section className="lg:ml-70 px-4 py-4 sm:px-6">
          <div className="text-center">
            <Loader2
              size={40}
              className="mx-auto mb-4 animate-spin text-[#006400]"
            />
            <p className="font-medium text-[#52604b]">Loading order...</p>
          </div>
        </section>
      </>
    );
  }

  // ================= ERROR =================
  if (error || !order) {
    return (
      <>
        <Sidebar />
        <section className="lg:ml-70 px-4 py-4 sm:px-6">
          <div className="max-w-md rounded-3xl border border-[#e7eadf] bg-white p-9 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <XCircle size={30} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#033303]">
              Order not found
            </h2>
            <p className="mb-6 text-sm leading-6 text-[#788174]">
              {error || "This order may have been removed or doesn't exist."}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#315f38] px-5 py-3 font-semibold text-white transition hover:bg-[#254c2d] cursor-pointer"
            >
              <ArrowLeft size={17} />
              Go Back
            </button>
          </div>
        </section>
      </>
    );
  }

  const statusStyle = getStatusStyle(order.status);
  const currentStep = getCurrentStepIndex(order.status);

  return (
    <>
      <Sidebar />

      <main className="lg:ml-70 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* ================= BACK BUTTON ================= */}
          <button
            onClick={() => navigate(-1)}
            className="group mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2f8f1f] transition hover:text-[#006400] cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4e8dc] bg-white transition group-hover:border-[#cdd9c0]">
              <ArrowLeft size={15} />
            </span>
            Back to Orders
          </button>

          {/* ================= ORDER HEADER ================= */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf3e5]">
                  <Package size={20} className="text-[#2f8f1f]" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-[#033303] sm:text-3xl">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h1>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#788174]">
                    <Calendar size={12} />
                    {new Date(order.createdAt).toLocaleString("en-PK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {statusStyle.icon}
                {statusStyle.label}
              </span>

              <button
                onClick={fetchOrder}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2e7dc] bg-white text-[#566151] transition hover:bg-[#f8faf5] cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* ================= TIMELINE ================= */}
          {order.status !== "cancelled" && (
            <div className="mb-6 rounded-2xl border border-[#e8ebdf] bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-[#596753]">
                Order Timeline
              </h2>

              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#e9ede2]" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-[#2f8f1f] transition-all duration-500"
                  style={{
                    width:
                      currentStep <= 0
                        ? "0%"
                        : currentStep === 1
                          ? "50%"
                          : "100%",
                  }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  {timelineSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center"
                        style={{ width: "33.333%" }}
                      >
                        <div
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                            isCompleted
                              ? "border-[#2f8f1f] bg-[#2f8f1f] text-white"
                              : "border-[#e9ede2] bg-white text-[#a1a89e]"
                          } ${isCurrent ? "ring-4 ring-[#2f8f1f]/20" : ""}`}
                        >
                          <StepIcon size={16} />
                        </div>

                        <p
                          className={`mt-3 text-xs font-bold ${
                            isCompleted ? "text-[#2f8f1f]" : "text-[#a1a89e]"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= CANCELLED BANNER ================= */}
          {order.status === "cancelled" && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 shrink-0">
                  <XCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-rose-700">Order Cancelled</h3>
                  <p className="text-xs text-rose-600 mt-0.5">
                    This order has been cancelled. If you have any questions,
                    please contact the farmer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= MAIN CONTENT GRID ================= */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              {/* ---- ITEMS ---- */}
              <div className="overflow-hidden rounded-2xl border border-[#e8ebdf] bg-white shadow-sm">
                <div className="border-b border-[#edf0e7] bg-[#fbfcf8] px-5 py-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#596753]">
                    Items ({order.items.length})
                  </h2>
                </div>

                <div className="divide-y divide-[#f0f3eb]">
                  {order.items.map((item, idx) => {
                    const product = item.productId;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 px-5 py-4"
                      >
                        {product?.image && (
                          <img
                            src={
                              product.image.startsWith("http")
                                ? product.image
                                : `http://localhost:8000/${product.image}`
                            }
                            alt={product.name}
                            className="h-16 w-16 rounded-xl object-cover bg-[#f4f6ec]"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#033303]">
                            {product?.name || "Product"}
                          </p>
                          {product?.category && (
                            <p className="mt-0.5 text-xs text-[#788174] capitalize">
                              {product.category}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-[#788174]">
                            Qty:{" "}
                            <span className="font-semibold text-[#033303]">
                              {item.quantity}
                            </span>{" "}
                            × Rs. {item.price}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-[#033303]">
                          Rs. {(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- SHIPPING ADDRESS ---- */}
              {order.shippingAddress && (
                <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5 shadow-sm">
                  <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#596753]">
                    <MapPin size={13} className="text-[#2f8f1f]" />
                    Shipping Address
                  </h2>

                  <div className="space-y-1.5 text-sm">
                    <p className="font-semibold text-[#033303]">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#788174]">
                      <Phone size={12} />
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-[#788174]">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-[#788174]">
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              )}

              {/* ---- NOTES ---- */}
              {order.notes && (
                <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5 shadow-sm">
                  <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#596753]">
                    <FileText size={13} className="text-[#2f8f1f]" />
                    Order Notes
                  </h2>
                  <p className="text-sm text-[#788174] whitespace-pre-line">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-6">
              {/* ---- BUYER/FARMER INFO ---- */}
              {isFarmer && order.buyerId && (
                <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5 shadow-sm">
                  <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#596753]">
                    <User size={13} className="text-[#2f8f1f]" />
                    Buyer Information
                  </h2>

                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-[#033303]">
                      {order.buyerId.fullName}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#788174] text-xs">
                      <Phone size={12} />
                      {order.buyerId.mobileNumber || "N/A"}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#788174] text-xs">
                      <User size={12} />
                      {order.buyerId.email}
                    </p>
                  </div>
                </div>
              )}

              {/* ---- ORDER SUMMARY ---- */}
              <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#596753]">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#788174]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#033303]">
                      Rs. {order.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#788174]">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[#033303]">
                      {order.deliveryFee === 0
                        ? "FREE"
                        : `Rs. ${order.deliveryFee?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="border-t border-[#e9ede2] pt-2.5 flex justify-between">
                    <span className="font-bold text-[#033303]">Total</span>
                    <span className="font-extrabold text-[#006400] text-lg">
                      Rs. {order.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#edf0e7] flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#788174]">
                    <CreditCard size={12} />
                    Payment Method
                  </span>
                  <span className="font-bold text-[#033303]">
                    {order.paymentMethod || "COD"}
                  </span>
                </div>
              </div>

              {/* ================= FARMER ACTIONS ================= */}
              {isFarmer && (
                <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#596753]">
                    Actions
                  </h2>

                  <div className="space-y-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate("confirmed")}
                          disabled={updating}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#006400] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#004d00] disabled:opacity-50 cursor-pointer"
                        >
                          {updating ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                          Accept Order
                        </button>

                        <button
                          onClick={() => handleStatusUpdate("cancelled")}
                          disabled={updating}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                        >
                          <XCircle size={15} />
                          Reject Order
                        </button>
                      </>
                    )}

                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusUpdate("delivered")}
                        disabled={updating}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#006400] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#004d00] disabled:opacity-50 cursor-pointer"
                      >
                        {updating ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        Mark as Delivered
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center">
                        <CheckCircle2
                          size={20}
                          className="mx-auto text-green-600 mb-1"
                        />
                        <p className="text-sm font-bold text-green-700">
                          Order Completed
                        </p>
                      </div>
                    )}

                    {order.status === "cancelled" && (
                      <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-center">
                        <XCircle
                          size={20}
                          className="mx-auto text-rose-600 mb-1"
                        />
                        <p className="text-sm font-bold text-rose-700">
                          Order Cancelled
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= BUYER INFO BOX (for buyer) ================= */}
              {isBuyer && (
                <div className="rounded-2xl border border-[#e8ebdf] bg-[#fbfcf8] p-5 shadow-sm">
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#596753]">
                    Need Help?
                  </h2>
                  <p className="text-xs text-[#788174] leading-5">
                    Contact the farmer directly if you have any questions about
                    this order. Your order status will update automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
