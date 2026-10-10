import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Navbar } from "../components/Navbar.jsx";
import axios from "axios";
import { MapPin, Phone, User, CreditCard, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, products, clearCart } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ cartItems object ko products ke saath merge karein
  const cartProducts = products.filter((p) => cartItems[p._id] > 0);

  // Subtotal
  const subtotal = cartProducts.reduce(
    (sum, p) => sum + Number(p.price) * cartItems[p._id],
    0,
  );

  const deliveryFee = subtotal > 2000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  // Agar cart khaali hai toh redirect
  if (cartProducts.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const orderData = {
        items: cartProducts.map((p) => ({
          productId: p._id,
          quantity: cartItems[p._id],
          price: Number(p.price),
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        subtotal,
        deliveryFee,
        totalAmount: total,
      };

      const response = await axios.post(
        "http://localhost:8000/api/orders/create-order",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Order placed successfully!");
      clearCart();
      navigate(`/order-success/${response.data.order._id}`, {
        state: { order: response.data.order },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Order place nahi ho saka. Please try again.",
      );
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f8f1] pb-16 pt-25">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold text-[#033303] mb-6">
            Checkout
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
          >
            {/* ================= LEFT: SHIPPING ================= */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5">
                <h2 className="font-bold text-[#033303] mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[#2f8f1f]" />
                  Shipping Details
                </h2>

                <div className="space-y-3">
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                    />
                  </div>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      required
                      className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                    />
                  </div>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete Address"
                    required
                    className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] px-4 py-2.5 text-sm outline-none focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                  />

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] px-4 py-2.5 text-sm outline-none focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                  />

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Order notes (optional)"
                    rows={3}
                    className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] px-4 py-2.5 text-sm outline-none focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20 resize-none"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5">
                <h2 className="font-bold text-[#033303] mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#2f8f1f]" />
                  Payment Method
                </h2>

                <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-[#006400] bg-[#f0f7ed] cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                  />
                  <div>
                    <p className="font-semibold text-[#033303] text-sm">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-[#788174]">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ================= RIGHT: SUMMARY ================= */}
            <div className="rounded-2xl border border-[#e8ebdf] bg-white p-5 h-fit lg:sticky lg:top-25">
              <h2 className="font-bold text-[#033303] mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#2f8f1f]" />
                Order Summary
              </h2>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {cartProducts.map((p) => (
                  <div key={p._id} className="flex justify-between text-xs">
                    <span className="text-[#788174] truncate flex-1 pr-2">
                      {p.name} × {cartItems[p._id]}
                    </span>
                    <span className="font-semibold text-[#033303] shrink-0">
                      Rs.{" "}
                      {(Number(p.price) * cartItems[p._id]).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-[#e9ede2] pt-3">
                <div className="flex justify-between text-[#788174]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#033303]">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#788174]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#033303]">
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#e9ede2] pt-2.5">
                  <span className="font-bold text-[#033303]">Total</span>
                  <span className="font-extrabold text-[#006400] text-lg">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-[#006400] py-3 font-semibold text-white hover:bg-[#004d00] disabled:bg-[#7a8277] disabled:cursor-not-allowed transition cursor-pointer"
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order • Rs. ${total.toLocaleString()}`}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
