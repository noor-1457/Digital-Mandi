import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f8f1] flex items-center justify-center pb-16 pt-[100px] px-4">
        <div className="max-w-lg w-full rounded-2xl border border-[#e8ebdf] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 size={44} className="text-[#006400]" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#033303] mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-sm text-[#788174] mb-6">
            Your order has been placed successfully. The farmer will confirm it
            soon.
          </p>

          {order && (
            <div className="mb-6 rounded-xl border border-[#edf0e7] bg-[#fbfcf8] p-4 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#788174]">Order ID</span>
                <span className="font-semibold text-[#033303] truncate ml-2">
                  #{order._id?.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#788174]">Total Amount</span>
                <span className="font-semibold text-[#006400]">
                  Rs. {order.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#788174]">Payment</span>
                <span className="font-semibold text-[#033303]">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => navigate("/buyer-orders")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e0e5da] bg-white py-3 text-sm font-bold text-[#566151] hover:bg-[#f8faf5] cursor-pointer"
            >
              <Package size={15} />
              View My Orders
            </button>
            <button
              onClick={() => navigate("/buyer-products")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006400] py-3 text-sm font-bold text-white hover:bg-[#004d00] cursor-pointer"
            >
              Continue Shopping
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}