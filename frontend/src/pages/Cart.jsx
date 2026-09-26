import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar.jsx";
import { X, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";

export const CartItems = () => {
  const { cartItems, remFromCart, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      const ids = Object.keys(cartItems);
      if (ids.length === 0) {
        setCartProducts([]);
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

        const filtered = allProducts.filter(
          (p) => cartItems[p._id] > 0
        );
        setCartProducts(filtered);
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cartItems]);

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/150?text=No+Image";
    return image.startsWith("http")
      ? image
      : `http://localhost:8000/${image}`;
  };

  const subtotal = cartProducts.reduce(
    (sum, product) =>
      sum + Number(product.price) * cartItems[product._id],
    0
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-[100px] text-center text-gray-500">
          Loading cart...
        </div>
      </>
    );
  }

  // ================= EMPTY CART =================
  if (cartProducts.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-[100px] min-h-screen flex flex-col items-center justify-center px-4">
          <div className="bg-gray-100 p-10 rounded-2xl text-center max-w-md w-full">
            <ShoppingBag
              size={70}
              className="mx-auto text-gray-400 mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Add some fresh products from Digital Mandi.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#006400] hover:bg-[#024202] text-white px-6 py-2.5 rounded-full transition inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  // ================= CART =================
  return (
    <>
      <Navbar />
      <div className="pt-[100px] pb-16 px-3 sm:px-6 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT: ITEMS ================= */}
          <div className="lg:col-span-2 space-y-4">

            {cartProducts.map((product) => {
              const quantity = cartItems[product._id];

              return (
                <div
                  key={product._id}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Image */}
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-gray-50"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {product.category}
                    </p>
                    <p className="text-[#006400] font-bold mt-1.5 text-sm sm:text-base">
                      Rs. {product.price}
                    </p>
                  </div>

                  {/* Qty + Total + Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => remFromCart(product._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-[20px] text-center text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total */}
                    <p className="font-bold text-[#123f32] text-sm sm:text-base min-w-[70px] text-right">
                      Rs. {Number(product.price) * quantity}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => remFromCart(product._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= RIGHT: SUMMARY ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 sticky top-[100px]">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">
                    Rs. {subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-xs text-gray-400">
                    To be calculated
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                  <span>Total</span>
                  <span>Rs. {subtotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-[#006400] hover:bg-[#024202] text-white py-3 rounded-full font-semibold transition"
              >
                PROCEED TO CHECKOUT
              </button>

              <button
                onClick={() => navigate("/")}
                className="cursor-pointer w-full mt-3 text-[#006400] text-sm font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItems;