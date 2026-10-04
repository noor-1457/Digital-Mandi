import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ================= USER =================

  const getUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error reading user:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getUser());

  // ================= USER-SPECIFIC KEYS =================

  const getCartKey = (currentUser) => {
    return currentUser?._id
      ? `cartItems_${currentUser._id}`
      : "cartItems_guest";
  };

  const getWishlistKey = (currentUser) => {
    return currentUser?._id
      ? `wishlistItems_${currentUser._id}`
      : "wishlistItems_guest";
  };

  // ================= CART =================

  const [cartItems, setCartItems] = useState(() => {
    const currentUser = getUser();
    const key = getCartKey(currentUser);

    try {
      const savedCart = localStorage.getItem(key);
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Error loading cart:", error);
      return {};
    }
  });

  // ================= WISHLIST =================

  const [wishlistItems, setWishlistItems] = useState(() => {
    const currentUser = getUser();
    const key = getWishlistKey(currentUser);

    try {
      const savedWishlist = localStorage.getItem(key);
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  });

  // ================= CHECK USER CHANGE =================
  // Login/logout ke baad localStorage se user detect karega.

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getUser();

      setUser((previousUser) => {
        const previousId = previousUser?._id || null;
        const currentId = currentUser?._id || null;

        if (previousId !== currentId) {
          return currentUser;
        }

        return previousUser;
      });
    };

    const interval = setInterval(checkUser, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= LOAD USER CART/WISHLIST =================

  useEffect(() => {
    const cartKey = getCartKey(user);
    const wishlistKey = getWishlistKey(user);

    try {
      const savedCart = localStorage.getItem(cartKey);
      const savedWishlist = localStorage.getItem(wishlistKey);

      setCartItems(savedCart ? JSON.parse(savedCart) : {});
      setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : []);
    } catch (error) {
      console.error("Error loading user cart/wishlist:", error);

      setCartItems({});
      setWishlistItems([]);
    }
  }, [user?._id]);

  // ================= SAVE CART =================

  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(
        getCartKey(user),
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems, user]);

  // ================= SAVE WISHLIST =================

  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(
        getWishlistKey(user),
        JSON.stringify(wishlistItems)
      );
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }, [wishlistItems, user]);

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8000/api/products"
      );

      const data = response.data;

      const productList =
        data?.products ||
        data?.data ||
        (Array.isArray(data) ? data : []);

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

    setCartItems((previousCart) => ({
      ...previousCart,
      [productId]: (previousCart[productId] || 0) + 1,
    }));
  };

  // ================= REMOVE FROM CART =================
  // Quantity -1

  const remFromCart = (productId) => {
    setCartItems((previousCart) => {
      const currentQuantity = previousCart[productId] || 0;

      if (currentQuantity <= 1) {
        const updatedCart = { ...previousCart };
        delete updatedCart[productId];

        return updatedCart;
      }

      return {
        ...previousCart,
        [productId]: currentQuantity - 1,
      };
    });
  };

  // ================= REMOVE ENTIRELY =================

  const removeFromCart = (productId) => {
    setCartItems((previousCart) => {
      const updatedCart = { ...previousCart };

      delete updatedCart[productId];

      return updatedCart;
    });
  };

  // ================= UPDATE QUANTITY =================

  const updateQuantity = (productId, quantity) => {
    if (!productId) return;
    if (quantity < 1) return;

    setCartItems((previousCart) => ({
      ...previousCart,
      [productId]: quantity,
    }));
  };

  // ================= CLEAR CART =================

  const clearCart = () => {
    setCartItems({});

    if (user) {
      localStorage.removeItem(getCartKey(user));
    }
  };

  // ================= CLEAR WISHLIST =================

  const clearWishlist = () => {
    setWishlistItems([]);

    if (user) {
      localStorage.removeItem(getWishlistKey(user));
    }
  };

  // ================= TOGGLE WISHLIST =================

  const toggleWishlist = (productId) => {
    if (!productId) return;

    setWishlistItems((previousWishlist) => {
      if (previousWishlist.includes(productId)) {
        return previousWishlist.filter(
          (id) => id !== productId
        );
      }

      return [...previousWishlist, productId];
    });
  };

  // ================= CHECK WISHLIST =================

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // ================= REMOVE FROM WISHLIST =================

  const removeFromWishlist = (productId) => {
    setWishlistItems((previousWishlist) =>
      previousWishlist.filter((id) => id !== productId)
    );
  };

  // ================= TOTAL AMOUNT =================

  const getTotalAmt = () => {
    let total = 0;

    for (const productId in cartItems) {
      const product = products.find(
        (item) => item._id === productId
      );

      if (product) {
        total += product.price * cartItems[productId];
      }
    }

    return total;
  };

  // ================= TOTAL CART ITEMS =================

  const getTotalcartItems = () => {
    let total = 0;

    for (const productId in cartItems) {
      total += cartItems[productId];
    }

    return total;
  };

  // ================= TOTAL WISHLIST ITEMS =================

  const getTotalWishlistItems = () => {
    return wishlistItems.length;
  };

  // ================= FILTER PRODUCTS =================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText) ||
      product.location?.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() ===
        selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ================= CONTEXT VALUE =================

  const ContextValue = {
    // Products
    products,
    filteredProducts,
    loading,
    fetchProducts,

    // Search / Category
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,

    // User
    user,
    setUser,

    // Cart
    cartItems,
    addToCart,
    remFromCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmt,
    getTotalcartItems,

    // Wishlist
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    clearWishlist,
    getTotalWishlistItems,
  };

  return (
    <ShopContext.Provider value={ContextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;