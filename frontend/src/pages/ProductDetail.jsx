import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  User,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { products, loading, addToCart, toggleWishlist, isInWishlist } =
    useContext(ShopContext);

  const product = products.find((item) => item._id === productId);

 // ✅ Login check
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!token && !!user;

  const requireLogin = (action) => {
    if (!isLoggedIn) {
      // login page pe bhejein, aur "from" bhi pass karein taake wapas aa sake
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    action();
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f1] px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#dce6c9] border-t-[#006400]" />

            <p className="font-medium text-[#52604b]">
              Finding something fresh...
            </p>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // ================= PRODUCT NOT FOUND =================
  if (!product) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f1] px-4">
          <div className="max-w-md rounded-3xl border border-[#e7eadf] bg-white p-9 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4e8] text-[#006400]">
              <Sprout size={30} />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-[#033303]">
              Product not found
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-500">
              This product may have been removed or is no longer available.
            </p>

            <button
              onClick={() => navigate("/buyer-products")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#315f38] px-5 py-3 font-semibold text-white transition hover:bg-[#254c2d]"
            >
              <ArrowLeft size={17} />
              Browse products
            </button>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // ================= PRODUCT DATA =================

  const inWishlist = isInWishlist(product._id);

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `http://localhost:8000/${product.image}`;

  const stock = Number(product.quantity) || 0;

  // ================= ADD TO CART =================

  const handleAddToCart = () => {
 requireLogin(() => {
      addToCart(product._id);
    });
  };
//================Add to wishlist================
  const handleWishlist = () => {
    requireLogin(() => {
      toggleWishlist(product._id);
    });
  };
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f8f1] pb-10 mt-[138px]">
        <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 lg:px-8">
          {/* ================= BACK BUTTON ================= */}

          <button
            onClick={() => navigate(-1)}
            className="group mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2f8f1f] transition hover:text-[#006400]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4e8dc] bg-white transition group-hover:border-[#cdd9c0]">
              <ArrowLeft size={15} />
            </span>
            Back to products
          </button>

          {/* ================= PRODUCT CARD ================= */}

          <div className="overflow-hidden rounded-2xl border border-[#e8ebdf] bg-white shadow-[0_12px_40px_-30px_rgba(34,58,32,0.3)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* ================= IMAGE SECTION ================= */}

            <div className="relative bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#f4f6ec_67%,#edf1e4_100%)] p-4 sm:p-6 lg:p-8">
              {/* Fresh Tag */}
              <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-[#2f8f1f] shadow-sm backdrop-blur">
                <Sprout size={12} />
                Fresh from the farm
              </div>

              {/* Wishlist Icon */}
              <button
                onClick={() => requireLogin(() => handleWishlist(product._id))}
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 ${
                  inWishlist
                    ? "border-rose-100 text-rose-500"
                    : "border-[#e9ebe4] text-gray-500 hover:text-rose-500"
                }`}
              >
                <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
              </button>

              {/* Product Image */}
              {/* Product Image */}
              <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-white sm:h-[340px]">
                <img
                  src={imageUrl}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://via.placeholder.com/600?text=No+Image";
                  }}
                  className="h-full w-full rounded-xl object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>

              {/* Image Bottom Tag */}
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#77816e]">
                <ShieldCheck size={13} className="text-[#668653]" />A little
                closer to the people who grow your food
              </div>
            </div>

            {/* ================= DETAILS SECTION ================= */}
            <div className="flex flex-col p-4 sm:p-6 lg:p-8">
              {/* Category + Stock Tags */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                {/* Category */}
                <span className="rounded-full bg-[#edf3e5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2f8f1f]">
                  {product.category || "Farm fresh"}
                </span>

                {/* Stock */}
                {stock > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f7ed] px-2.5 py-1 text-[10px] font-semibold text-[#2f8f1f]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2f8f1f]" />
                    In stock
                  </span>
                )}

                {stock <= 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Out of stock
                  </span>
                )}
              </div>

              {/* ================= NAME + PRICE SIDE BY SIDE ================= */}

              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left: Name + Location */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-extrabold leading-tight tracking-tight text-[#000000] sm:text-2xl">
                    {product.name}
                  </h1>

                  {product.location && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#788174]">
                      <MapPin size={14} className="text-[#2f8f1f]" />
                      {product.location}
                    </div>
                  )}
                </div>

                {/* Right: Price */}
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#788174]">
                    Today's price
                  </p>

                  <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#000000]">
                    Rs. {Number(product.price).toLocaleString()}
                  </p>

                  <span className="text-xs text-[#8b9385]">per kg</span>
                </div>
              </div>

              {/* ================= DESCRIPTION ================= */}

              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-[#596753]">
                  About this product
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#737c70] line-clamp-3">
                  {product.description ||
                    "A fresh selection from our local farmers."}
                </p>
              </div>

              {/* ================= FARMER ================= */}

              {product.farmer && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#edf0e7] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf3e5] text-[#2f8f1f]">
                    <User size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-[#8a9285]">
                      Grown and supplied by
                    </p>

                    <p className="mt-0.5 truncate text-sm font-bold text-[#000000]">
                      {product.farmer?.name ||
                        product.farmer?.fullName ||
                        "Local farmer"}
                    </p>
                  </div>

                  <BadgeCheck size={17} className="text-[#2f8f1f]" />
                </div>
              )}

              {/* ================= ACTION BUTTONS ================= */}

              <div className="mt-auto pt-5">
                <div className="grid gap-2 sm:grid-cols-[0.9fr_1.1fr]">
                  {/* Wishlist */}
                  <button
                onClick={() => requireLogin(() => handleWishlist(product._id))}
                    className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                      inWishlist
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-[#e0e5da] bg-white text-[#566151] hover:bg-[#f8faf5]"
                    }`}
                  >
                    <Heart
                      size={15}
                      fill={inWishlist ? "currentColor" : "none"}
                    />
                    {inWishlist ? "Saved" : "Wishlist"}
                  </button>

                  {/* Add To Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={stock <= 0}
                    className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#006400] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#004d00] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart size={15} />
                    {stock > 0 ? "Add to cart" : "Out of stock"}
                  </button>
                </div>

                <p className="mt-2.5 text-center text-[10px] text-[#939b8e]">
                  Supporting local growers, one basket at a time
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
