import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, User, LogOut, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Backend logout
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Logout response:", data);

      // Remove frontend authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Go to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if backend request fails,
      // remove local authentication
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  return (
    <>
    {/* MOBILE HEADER */}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#006400] text-white h-20 px-5 flex items-center justify-between shadow-lg">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-[#fdd835] flex items-center justify-center">
            <Leaf size={22} className="text-[#006400]" />
          </div>

          <div>
            <p className="text-xs text-[#dce8d5]">
              Digital Mandi
            </p>

            <h1 className="font-bold">
              Buyer Dashboard
            </h1>
          </div>

        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
        >
          {sidebarOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>


      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-72
          bg-[#006400]
          text-white
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}

        <div className="h-24 px-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-[#fdd835] flex items-center justify-center">
            <Leaf size={26} className="text-[#006400]" />
          </div>

          <div>
            <h1 className="text-xl font-bold">Digital Mandi</h1>

            <p className="text-xs text-[#dce8d5]">Buyer Portal</p>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Dashboard */}

          <Link
            to="/buyer-dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition"
          >
            <LayoutDashboard size={20} />

            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Orders */}

          <Link
            to="/orders"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition"
          >
            <ShoppingBag size={20} />

            <span className="font-medium">My Orders</span>
          </Link>

          {/* Profile */}

          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition"
          >
            <User size={20} />

            <span className="font-medium">My Profile</span>
          </Link>
        </nav>

        {/* LOGOUT */}

        {/* <div className="p-2 mb-2 border-t border-white/10 bg-red-700 rounded-full text-center justify-center items-center"> */}
          <button
            onClick={handleLogout}
                className="group inline-flex mb-3 items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-red-700 text-white font-semibold cursor-pointer"
          >
            <LogOut size={20} />

            <span className="font-medium">Logout</span>
          </button>
        {/* </div> */}
      </aside>
    </>
  );
}

export default Sidebar;
