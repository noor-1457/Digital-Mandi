import {
  Package,
  PlusCircle,
  User,
  Leaf,
  ArrowRight,
  Wheat,
} from "lucide-react";

import { Link } from "react-router-dom";

function FarmerDashboard() {
 

  return (
    <main className="min-h-screen bg-[#f8f7f2]">

      {/* MAIN CONTENT */}

      <section className="lg:ml-72 min-h-screen pt-24 lg:pt-0">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {/* TOP HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-[#7a8277]">Welcome back 👋</p>

              <h2 className="text-3xl font-bold text-[#293829] mt-1">
                Farmer Dashboard
              </h2>
            </div>

            {/* PROFILE SHORTCUT */}

            <Link
              to="/profile"
              className="flex items-center gap-3 bg-white border border-[#e3e7dc] px-4 py-3 rounded-xl hover:shadow-md transition"
            >
              <div className="w-9 h-9 rounded-full bg-[#eef3e4] flex items-center justify-center">
                <User size={18} className="text-[#607b37]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#293829]">
                  My Profile
                </p>

                <p className="text-xs text-[#8a9186]">View account</p>
              </div>
            </Link>
          </div>

          {/* WELCOME CARD */}

          <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#fdd835] to-[#006400] p-[1px] shadow-lg">
            <div className="rounded-[23px] bg-[#fffef8] p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef3e4] text-[#607b37] text-xs font-semibold">
                    <Wheat size={14} />
                    Farmer Account
                  </span>

                  <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-[#293829]">
                    Welcome to Digital Mandi!
                  </h3>

                  <p className="mt-2 text-[#737b70] max-w-xl">
                    Manage your farm, products and profile from your farmer
                    dashboard.
                  </p>
                </div>

                <Link
                  to="/add-product"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#006400] hover:bg-[#004d00] text-white font-semibold transition-all hover:-translate-y-0.5"
                >
                  Add Product
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* DASHBOARD CARDS*/}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {/* MY PRODUCTS */}

            <Link
              to="/products"
              className="group bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#607b37] flex items-center justify-center">
                <Package size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#293829]">
                My Products
              </h3>

              <p className="mt-1 text-sm text-[#737b70]">
                Manage your agricultural products.
              </p>

              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#607b37]">
                View Products
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>

            {/* ADD PRODUCT */}

            <Link
              to="/add-product"
              className="group bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fff8d9] text-[#b28a00] flex items-center justify-center">
                <PlusCircle size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#293829]">
                Add Product
              </h3>

              <p className="mt-1 text-sm text-[#737b70]">
                Add your farm products to the marketplace.
              </p>

              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#b28a00]">
                Add Product
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>

            {/* PROFILE */}

            <Link
              to="/profile"
              className="group bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f8eee5] text-[#966235] flex items-center justify-center">
                <User size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#293829]">
                My Profile
              </h3>

              <p className="mt-1 text-sm text-[#737b70]">
                View and update your farm profile.
              </p>

              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#966235]">
                View Profile
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          </div>

          {/* ACCOUNT STATUS*/}

          <div className="mt-8 bg-white border border-[#e3e7dc] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef3e4] text-[#607b37] flex items-center justify-center">
                <Leaf size={24} />
              </div>

              <div>
                <h3 className="font-bold text-[#293829]">Farmer Account</h3>

                <p className="text-sm text-[#737b70]">
                  Your farmer account is active and ready to use.
                </p>
              </div>

              <span className="ml-auto hidden sm:block px-3 py-1 rounded-full bg-[#eef3e4] text-[#607b37] text-xs font-semibold">
                Active
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FarmerDashboard;
