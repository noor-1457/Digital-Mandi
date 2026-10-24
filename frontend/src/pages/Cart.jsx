import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { Navbar } from "../components/Navbar.jsx";
import { Minus, Plus, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";

export const CartItems = () => {
  const { cartItems, remFromCart, addToCart, removeFromCart } = useContext(ShopContext);
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
        const response = await api.get("/api/products");

        const data = response.data;
        const allProducts =
          data?.products || data?.data || (Array.isArray(data) ? data : []);

        const filtered = allProducts.filter((p) => cartItems[p._id] > 0);
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
    return image.startsWith("http") ? image : `${api.baseURL}/${image}`;
  };

  const subtotal = cartProducts.reduce(
    (sum, product) => sum + Number(product.price) * cartItems[product._id],
    0
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-28 min-h-screen text-center text-gray-500">
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
        <div className="pt-28 min-h-[80vh] flex flex-col items-center justify-center px-4">
          <div className="bg-white border border-gray-100 p-8 rounded-3xl text-center max-w-md w-full shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Add some fresh products from Digital Mandi.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#006400] hover:bg-[#024202] text-white px-6 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2 w-full justify-center"
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
      <div className="pt-33 pb-16 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#033303] mb-6">
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
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Top Section (Mobile pe image + details ek sath) */}
                  <div className="flex gap-4 w-full sm:w-auto">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-50 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 capitalize">
                        {product.category}
                      </p>
                      <p className="text-[#006400] font-bold mt-1 text-sm sm:text-base">
                        Rs. {product.price}
                      </p>
                    </div>

                    {/* Remove button for Mobile (Top Right) */}
                    <button
                      onClick={() => removeFromCart ? removeFromCart(product._id) : remFromCart(product._id)}
                      className="sm:hidden text-gray-400 hover:text-red-500 self-start p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Bottom Section (Mobile pe Quantity + Total ek row mein) */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-auto pt-3 sm:pt-0 border-t border-gray-50 sm:border-0 w-full sm:w-auto">
                    
                    {/* Quantity */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                      <button
                        onClick={() => remFromCart(product._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-red-500"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-[#006400]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total Price */}
                    <p className="font-bold text-[#033303] text-base">
                      Rs. {(Number(product.price) * quantity).toLocaleString()}
                    </p>

                    {/* Remove button for Desktop (Far Right) */}
                    <button
                      onClick={() => removeFromCart ? removeFromCart(product._id) : remFromCart(product._id)}
                      className="hidden sm:block text-gray-400 hover:text-red-500 transition ml-2"
                      title="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= RIGHT: SUMMARY ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e8ebdf] rounded-2xl shadow-sm p-6 sticky top-28">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({Object.keys(cartItems).length} items)</span>
                  <span className="font-semibold text-gray-800">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-xs font-semibold text-[#2f8f1f] bg-[#edf3e5] px-2 py-0.5 rounded">
                    To be calculated
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between items-center font-bold text-[#033303] text-lg">
                  <span>Total</span>
                  <span className="text-2xl text-[#006400]">Rs. {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-[#006400] hover:bg-[#024202] text-white py-3.5 rounded-xl font-bold transition shadow-md shadow-[#006400]/20 active:scale-[0.98]"
              >
                PROCEED TO CHECKOUT
              </button>

              <button
                onClick={() => navigate("/")}
                className="cursor-pointer w-full mt-4 text-[#006400] text-sm font-semibold hover:underline"
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