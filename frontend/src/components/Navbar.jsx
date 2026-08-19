import {
  Home,
  ShoppingBasket,
  Info,
  LogIn,
  UserPlus,
  Menu,
  X,
  Leaf,
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // NAVIGATION LINKS

  const navLinks = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/products",
      label: "Products",
      icon: ShoppingBasket,
    },
    {
      path: "/about",
      label: "About",
      icon: Info,
    },
  ];

  // CHECK ACTIVE ROUTE

  const isActive = (path) => location.pathname === path;

  // Close mobile menu after navigation
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#006400] backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 group"
          >

            {/* Logo icon */}
            <div className="relative">

              <div className="w-11 h-11 rounded-2xl bg-[#fdd835] flex items-center justify-center shadow-md shadow-black/10 group-hover:scale-105 transition-all duration-300">

                <Leaf
                  size={24}
                  strokeWidth={2}
                  className="text-[#006400]"
                />

              </div>

            </div>


            {/* Logo text */}
            <div className="leading-tight">

              <h1 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Digital Mandi
              </h1>

              <p className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-[#ffeb3b] font-medium">
                Smart Agricultural Marketplace
              </p>

            </div>

          </Link>

            {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">

            {navLinks.map((link) => {

              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    group relative flex items-center gap-2
                    px-4 py-2.5 rounded-xl
                    text-sm font-medium
                    transition-all duration-300

                    ${
                      isActive(link.path)
                        ? "text-white bg-white/[0.08]"
                        : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                    }
                  `}
                >

                  <Icon
                    size={17}
                    strokeWidth={2}
                    className={`
                      transition-all duration-300

                      ${
                        isActive(link.path)
                          ? "text-[#ffeb3b]"
                          : "text-white/45 group-hover:text-[#ffeb3b]"
                      }
                    `}
                  />

                  {link.label}


                  {/* Active indicator */}
                  <span
                    className={`
                      absolute bottom-1 left-1/2
                      -translate-x-1/2
                      h-[2px]
                      rounded-full
                      bg-[#a7c957]
                      transition-all duration-300

                      ${
                        isActive(link.path)
                          ? "w-5"
                          : "w-0 group-hover:w-5"
                      }
                    `}
                  />

                </Link>
              );
            })}

          </div>

           {/* Right side  */}

          <div className="hidden md:flex items-center gap-2">

            {/* Login */}
            <Link
              to="/login"
              className={`
                flex items-center gap-2
                px-4 py-2.5
                rounded-xl
                text-sm font-medium
                transition-all duration-300

                ${
                  isActive("/login")
                    ? "text-[#c7df8b] bg-white/[0.08]"
                    : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                }
              `}
            >

              <LogIn size={17} />

              Login

            </Link>


            {/* Register */}
            <Link
              to="/register"
              className="
                group
                flex items-center gap-2
                px-5 py-2.5
                rounded-full
                bg-[#fdd835]
                hover:bg-[#ffeb3b]
                text-[#263326]
                text-sm font-semibold
                shadow-md shadow-black/10
                transition-all duration-300
                hover:-translate-y-0.5
              "
            >

              <UserPlus
                size={17}
                className="group-hover:scale-110 transition-transform duration-300"
              />

              Register

            </Link>

          </div>

        {/* Mobile Navigation*/}

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              md:hidden
              w-10 h-10
              flex items-center justify-center
              rounded-xl
              bg-white/[0.08]
              border border-white/10
              text-white
              hover:bg-white/[0.13]
              transition-all duration-300
            "
            aria-label="Toggle navigation menu"
          >

            {isOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}

          </button>

        </div>

      </div>

          {/* Mobile view */}

      <div
        className={`
          md:hidden
          overflow-hidden
          transition-all duration-300 ease-in-out
          border-t border-white/10

          ${
            isOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >

        <div className="bg-[#202a1f] px-5 py-5 space-y-2">

          {/* Mobile navigation links */}

          {navLinks.map((link) => {

            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3
                  px-4 py-3.5
                  rounded-xl
                  text-sm font-medium
                  transition-all duration-300

                  ${
                    isActive(link.path)
                      ? "bg-white/[0.08] text-[#c7df8b]"
                      : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                  }
                `}
              >

                <Icon
                  size={19}
                  className={
                    isActive(link.path)
                      ? "text-[#a7c957]"
                      : "text-white/40"
                  }
                />

                {link.label}

              </Link>
            );
          })}


          {/* Mobile Login */}

          <Link
            to="/login"
            onClick={handleLinkClick}
            className="
              flex items-center gap-3
              px-4 py-3.5
              rounded-xl
              text-sm font-medium
              text-white/65
              hover:text-white
              hover:bg-white/[0.06]
              transition-all duration-300
            "
          >

            <LogIn
              size={19}
              className="text-white/40"
            />

            Login

          </Link>


          {/* Mobile Register */}

          <Link
            to="/register"
            onClick={handleLinkClick}
            className="
              flex items-center justify-center gap-2
              mt-3
              px-5 py-3.5
              rounded-full
              bg-[#a7c957]
              hover:bg-[#b8d875]
              text-[#263326]
              font-semibold
              transition-all duration-300
            "
          >

            <UserPlus size={19} />

            Register

          </Link>

        </div>

      </div>

    </nav>
  );
};