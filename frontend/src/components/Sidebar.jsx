import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  LogOut,
  Leaf,
  Menu,
  X,
  Users,
  Package,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.userRole || "buyer";
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= SIDEBAR DATA ================= */

  const sidebarData = {
    buyer: {
      title: "Buyer Dashboard",
      portal: "Buyer Portal",
      dashboard: "/buyer-dashboard",

      links: [
        {
          name: "Dashboard",
          path: "/buyer-dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "My Orders",
          path: "/orders",
          icon: ShoppingBag,
        },
        {
          name: "My Profile",
          path: "/profile",
          icon: User,
        },
      ],
    },

    farmer: {
      title: "Farmer Dashboard",
      portal: "Farmer Portal",
      dashboard: "/farmer-dashboard",

      links: [
        {
          name: "Dashboard",
          path: "/farmer-dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "My Products",
          path: "/my-products",
          icon: Package,
        },
        {
          name: "Orders",
          path: "/farmer-orders",
          icon: ClipboardList,
        },
        {
          name: "My Profile",
          path: "/profile",
          icon: User,
        },
      ],
    },

    admin: {
      title: "Admin Dashboard",
      portal: "Admin Portal",
      dashboard: "/admin-dashboard",

      links: [
        {
          name: "Dashboard",
          path: "/admin-dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Users",
          path: "/users",
          icon: Users,
        },
        {
          name: "Products",
          path: "/products",
          icon: Package,
        },
        {
          name: "My Profile",
          path: "/profile",
          icon: User,
        },
      ],
    },
  };

  const currentSidebar = sidebarData[role] || sidebarData.buyer;

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

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

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}

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
              {currentSidebar.title}
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

      {/* ================= MOBILE OVERLAY ================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}

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

        {/* ================= LOGO ================= */}

        <div className="h-24 px-6 flex items-center gap-3 border-b border-white/10">

          <div className="w-12 h-12 rounded-2xl bg-[#fdd835] flex items-center justify-center">
            <Leaf size={26} className="text-[#006400]" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Digital Mandi
            </h1>

            <p className="text-xs text-[#dce8d5]">
              {currentSidebar.portal}
            </p>
          </div>

        </div>

        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 px-4 py-6 space-y-2">

          {currentSidebar.links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3
                  px-4 py-3.5
                  rounded-xl
                  transition
                  ${
                    location.pathname === link.path
                      ? "bg-white/10"
                      : "hover:bg-white/10"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {link.name}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* ================= LOGOUT ================= */}

        <div className="p-4 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center justify-center
              gap-2
              px-6 py-3.5
              rounded-full
              bg-red-700
              hover:bg-red-800
              text-white
              font-semibold
              cursor-pointer
              transition
            "
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;