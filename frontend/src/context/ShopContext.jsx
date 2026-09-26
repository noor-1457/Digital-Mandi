import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import toast from "react-hot-toast";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ================= CART =================
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {};
  });

  // ================= WISHLIST =================
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });

  // ================= PERSIST =================
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/products");

      const data = response.data;
      const productList =
        data?.products || data?.data || (Array.isArray(data) ? data : []);

      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD TO CART =================
  const addToCart = (productId) => {
    if (!productId) return;
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  // ================= REMOVE FROM CART =================
  const remFromCart = (productId) => {
    setCartItems((prev) => {
      const currentQuantity = prev[productId] || 0;
      if (currentQuantity <= 1) {
        const updatedCart = { ...prev };
        delete updatedCart[productId];
        return updatedCart;
      }
      return { ...prev, [productId]: currentQuantity - 1 };
    });
  };

  // ================= TOGGLE WISHLIST =================
  const toggleWishlist = (productId) => {
    if (!productId) return;
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // ================= IS IN WISHLIST =================
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // ================= REMOVE FROM WISHLIST =================
  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((id) => id !== productId));
  };

  // ================= TOTALS =================
  const getTotalAmt = () => {
    let total = 0;
    for (const productId in cartItems) {
      const product = products.find((item) => item._id === productId);
      if (product) total += product.price * cartItems[productId];
    }
    return total;
  };

  const getTotalcartItems = () => {
    let total = 0;
    for (const productId in cartItems) total += cartItems[productId];
    return total;
  };

  const getTotalWishlistItems = () => wishlistItems.length;

  // ================= FILTER =================
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText) ||
      product.location?.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // ================= CONTEXT =================
  const ContextValue = {
    products,
    filteredProducts,
    loading,
    fetchProducts,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    cartItems,
    addToCart,
    remFromCart,
    getTotalAmt,
    getTotalcartItems,
    // ✅ Wishlist
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    getTotalWishlistItems,
  };

  return (
    <ShopContext.Provider value={ContextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
