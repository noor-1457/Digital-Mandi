import { LayoutDashboard, Users, User, LogOut, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function BuyerDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    // Backend logout
    const response = await fetch(
      "http://localhost:8000/api/auth/logout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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
    <main className="min-h-screen bg-[#f8f7f2] pt-24 px-4 sm:px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-[#006400] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#fdd835] flex items-center justify-center">
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
              className="flex items-center justify-center cursor-pointer gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* WELCOME */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#293829]">
            Welcome, Admin 👋
          </h2>

          <p className="mt-1 text-[#737b70]">
            Manage and monitor the Digital Mandi platform.
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {/* USERS */}
          <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#607b37] flex items-center justify-center">
              <Users size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#293829]">Users</h3>

            <p className="mt-1 text-sm text-[#737b70]">
              Manage registered farmers and buyers.
            </p>
          </div>

          {/* PROFILE */}
          <Link
            to="/profile"
            className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#f8eee5] text-[#966235] flex items-center justify-center">
              <User size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#293829]">
              My Profile
            </h3>

            <p className="mt-1 text-sm text-[#737b70]">
              View and update admin profile information.
            </p>
          </Link>

          {/* DASHBOARD STATUS */}
          <div className="bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#607b37] flex items-center justify-center">
              <LayoutDashboard size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#293829]">
              Platform Overview
            </h3>

            <p className="mt-1 text-sm text-[#737b70]">
              Buyer control panel is ready.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BuyerDashboard;
