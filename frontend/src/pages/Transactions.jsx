import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Loader2, Receipt, ArrowDownRight, ArrowUpRight, Calendar, User } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isFarmer = user?.userRole === "farmer";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/orders/transactions/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Transaction error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Total Amount Calculate karein
  const totalAmount = transactions.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-[#f8f7f2] lg:ml-70 pt-24 lg:pt-6 px-4 sm:px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#033303] sm:text-3xl">
              Transaction History
            </h1>
            <p className="mt-1 text-sm text-[#788174]">
              {isFarmer ? "Aapki total earnings aur payment history." : "Aapke orders ki payment history."}
            </p>
          </div>

          {/* TOTAL BALANCE CARD */}
          <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8   bg-gradient-to-r from-[#006400] via-[#017001] to-[#fdd835]`}>
            <div className="flex items-center gap-3 mb-2">
              <Receipt size={20} className="text-white/80" />
              <p className="text-white/80 font-medium">{isFarmer ? "Total Earned" : "Total Spent"}</p>
            </div>
            <h2 className="text-4xl font-bold">Rs. {totalAmount.toLocaleString()}</h2>
            <p className="text-sm text-white/60 mt-2">
              From {transactions.length} completed order(s)
            </p>
          </div>

          {/* TRANSACTIONS LIST */}
          <div className="bg-white rounded-2xl border border-[#006400] overflow-hidden shadow-sm">
            <div className="bg-[#fbfcf8] border-b border-[#fdd835] px-5 py-4">
              <h3 className="font-bold text-[#033303]">Recent Transactions</h3>
            </div>

            {loading ? (
              <div className="p-10 text-center flex flex-col items-center text-[#006400]">
                <Loader2 size={30} className="animate-spin mb-3" />
                <p>Loading history...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No completed transactions found yet.
              </div>
            ) : (
              <div className="divide-y divide-[#edf0e7]">
                {transactions.map((order) => (
                  <div key={order._id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition">
                    
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isFarmer ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {isFarmer ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                      </div>
                      <div>
                        <p className="font-bold text-[#293829]">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#737b70] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> 
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          {isFarmer ? (
                            <span className="flex items-center gap-1">
                              <User size={12} /> Buyer: {order.buyerId?.fullName || "N/A"}
                            </span>
                          ) : (
                            <span>{order.items.length} Item(s)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold text-lg ${isFarmer ? "text-green-600" : "text-[#293829]"}`}>
                        {isFarmer ? "+" : "-"} Rs. {order.totalAmount.toLocaleString()}
                      </p>
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Delivered
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}