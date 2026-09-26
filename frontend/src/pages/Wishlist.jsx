import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar.jsx";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
} from "lucide-react";

export const Wishlist = () => {
  const {
    wishlistItems,
    toggleWishlist,
    addToCart,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Wishlist products fetch karo
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/products"
        );

        const data = response.data;
        const allProducts =
          data?.products ||
          data?.data ||
          (Array.isArray(data) ? data : []);

        const filtered = allProducts.filter((p) =>
          wishlistItems.includes(p._id)
        );

        setWishlistProducts(filtered);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/150?text=No+Image";
    return image.startsWith("http")
      ? image
      : `http://localhost:8000/${image}`;
  };

  const handleAddToCart = (id) => {
    addToCart(id);
    navigate("/cart");
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-[100px] text-center text-gray-500">
          Loading wishlist...
        </div>
      </>
    );
  }

  // ================= EMPTY =================
  if (wishlistProducts.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-[100px] min-h-screen flex flex-col items-center justify-center px-4">
          <div className="bg-gray-100 p-10 rounded-2xl text-center max-w-md w-full">
            <Heart
              size={70}
              className="mx-auto text-gray-400 mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Save your favourite products here for later.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#006400] hover:bg-[#024202] text-white px-6 py-2.5 rounded-full transition inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Explore Products
            </button>
          </div>
        </div>
      </>
    );
  }

  // ================= WISHLIST =================
  return (
    <>
      <Navbar />
      <div className="pt-[100px] pb-16 px-3 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="text-red-500" size={26} fill="currentColor" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Wishlist
          </h1>
          <span className="text-sm text-gray-500">
            ({wishlistProducts.length} items)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-40 object-cover bg-gray-50"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />

                {/* Remove icon */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow transition"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                  {product.category}
                </p>

                <div className="flex items-center gap-1 mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={
                          i < Math.floor(product.rating || 4.5)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < Math.floor(product.rating || 4.5)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviews || 0})
                  </span>
                </div>

                <p className="text-[#006400] font-bold mt-2 text-base">
                  Rs. {product.price}
                </p>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-[#006400] hover:bg-[#024202] text-white text-xs font-semibold py-2.5 rounded-lg transition"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;