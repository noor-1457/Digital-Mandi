import { Search, Heart, ShoppingCart, User, Menu, X, Leaf } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { getTotalcartItems, getTotalWishlistItems } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // ==============================
  // ACCOUNT
  // ==============================

  const handleAccountClick = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.userRole === "farmer") {
      window.location.href = "/farmer-dashboard";
    } else if (user.userRole === "buyer") {
      window.location.href = "/buyer-dashboard";
    } else if (user.userRole === "admin") {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/login";
    }
  };

  // ==============================
  // NAVIGATION LINKS
  // ==============================

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/allProducts", label: "All Products" },
    { path: "#", label: "Best Sellers" },
    { path: "/contact", label: "Contact Us" },
  ];

  // ==============================
  // ACTIVE LINK
  // ==============================

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // ==============================
  // CLOSE MOBILE MENU
  // ==============================

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // ==============================
  // SEARCH PRODUCTS
  // ==============================

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    // Agar search empty hai → All Products page pe sab products dikhao
    if (!searchValue) {
      navigate("/allProducts");
      setSearch("");
      setIsOpen(false);
      return;
    }

    // Search ke saath All Products page pe navigate karo
    navigate(`/allProducts?search=${encodeURIComponent(searchValue)}`);

    // Input clear kar do (optional)
    setSearch("");

    // Mobile menu close
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      {/* ================= TOP ROW ================= */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[88px] flex items-center justify-between gap-6">
            {/* ================= LOGO ================= */}
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 shrink-0"
            >
              <div className="relative w-11 h-11 flex items-center justify-center">
                <Leaf size={42} strokeWidth={1.7} className="text-[#006400]" />
                <Leaf
                  size={20}
                  strokeWidth={2}
                  className="absolute bottom-1 right-0 text-[#5b9b58]"
                />
              </div>

              <div className="leading-none">
                <h1 className="text-[24px] sm:text-[27px] font-bold text-[#006400] tracking-tight">
                  Digital Mandi
                </h1>
                <p className="text-[9px] sm:text-[10px] text-[#6b756e] tracking-[0.14em] mt-1">
                  Fresh Produce&nbsp;&nbsp;•&nbsp;&nbsp;Better Living
                </p>
              </div>
            </Link>

            {/* ================= SEARCH BAR (Desktop) ================= */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-[430px]"
            >
              <div className="relative w-full">
                <Search
                  size={19}
                  strokeWidth={2}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#52605a]
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for fruits, vegetables, grains..."
                  className="
                    w-full
                    h-[47px]
                    pl-11
                    pr-5
                    rounded-full
                    border
                    border-[#d5d9d5]
                    bg-white
                    text-sm
                    text-[#263326]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-[#006400]
                    focus:ring-2
                    focus:ring-[#006400]/10
                  "
                />
              </div>
            </form>

            {/* ================= RIGHT ACTIONS ================= */}
            <div className="hidden md:flex items-center gap-6 shrink-0">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative flex flex-col items-center justify-center gap-1
                  text-[#173f32] hover:text-[#006400] transition-colors">
                <Heart size={23} className="text-gray-700" />
                {getTotalWishlistItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalWishlistItems()}
                  </span>
                )}
                <span className="text-[12px] font-medium">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="
                  relative flex flex-col items-center justify-center gap-1
                  text-[#173f32] hover:text-[#006400] transition-colors
                "
              >
                <div className="relative">
                  <ShoppingCart size={23} className="text-gray-700" />
                  {/* ✅ Cart Badge */}
                  {getTotalcartItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalcartItems()}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-medium">Cart</span>
              </Link>

              {/* Account */}
              <button
                onClick={handleAccountClick}
                className="
                  flex flex-col items-center justify-center gap-1
                  text-[#173f32] hover:text-[#006400] transition-colors
                  cursor-pointer
                "
              >
                <User size={23} className="text-gray-700" />
                <span className="text-[12px] font-medium">Account</span>
              </button>
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="
                md:hidden w-10 h-10
                flex items-center justify-center
                rounded-lg bg-[#eef5ed] text-[#15543d]
              "
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM GREEN NAVIGATION ================= */}
      <div className="bg-[#006400]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[55px] flex">
            {/* Desktop Links */}
            <div className="hidden md:flex gap-1 flex-1">
              {navLinks.map((link, index) => (
                <Link
                  key={`${link.label}-${index}`}
                  to={link.path}
                  className={`
                    relative h-[50px] flex items-center px-6
                    text-[14px] font-semibold text-white
                    transition-colors hover:bg-white/5
                    ${isActive(link.path) ? "bg-white/5" : ""}
                  `}
                >
                  {link.label}

                  {isActive(link.path) && (
                    <span
                      className="
                        absolute bottom-0 left-1/2 -translate-x-1/2
                        w-12 h-[3px] rounded-t-full bg-[#d8e78b]
                      "
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="md:hidden flex-1 relative mt-1.5"
            >
              <Search
                size={17}
                className="
                  absolute left-3 top-1/2 -translate-y-1/2 text-white/60
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="
                  w-full h-[36px] pl-9 pr-3
                  rounded-full bg-white/10
                  border border-white/20
                  text-white placeholder:text-white/60
                  text-sm outline-none
                "
              />
            </form>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300
          bg-white shadow-lg
          ${isOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-5 py-4 space-y-1">
          {navLinks.map((link, index) => (
            <Link
              key={`${link.label}-mobile-${index}`}
              to={link.path}
              onClick={handleLinkClick}
              className={`
                block px-4 py-3 rounded-lg text-sm font-medium
                ${
                  isActive(link.path)
                    ? "bg-[#eef5ed] text-[#15543d]"
                    : "text-[#39453f] hover:bg-[#f5f7f4]"
                }
              `}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 my-2" />

          <Link
            to="/wishlist"
            onClick={handleLinkClick}
            className="
              flex items-center gap-3 px-4 py-3 rounded-lg
              text-sm text-[#39453f] hover:bg-[#f5f7f4]
            "
          >
            <Heart size={19} />
            Wishlist
          </Link>

          <Link
            to="/cart"
            onClick={handleLinkClick}
            className="
              flex items-center gap-3 px-4 py-3 rounded-lg
              text-sm text-[#39453f] hover:bg-[#f5f7f4]
            "
          >
            <ShoppingCart size={19} />
            Cart
          </Link>

          <button
            onClick={handleAccountClick}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-sm text-[#39453f] hover:bg-[#f5f7f4] text-left
            "
          >
            <User size={19} />
            Account
          </button>
        </div>
      </div>
    </nav>
  );
};
