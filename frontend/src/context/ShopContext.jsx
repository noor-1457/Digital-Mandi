import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Shop context create ho raha hai taaki data poori app me access ho sake
export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  // Products aur loading state ki management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search input aur selected category filter ki states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ================= USER =================

  // LocalStorage se user ka data check aur parse karne ka function
  const getUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error reading user:", error);
      return null;
    }
  };

  // User state jo page load hote hi getUser() function se chalegi
  const [user, setUser] = useState(getUser());

  // ================= USER-SPECIFIC KEYS =================

  // Har user ke liye alag unique localStorage cart key banana (Guest vs Logged In User)
  const getCartKey = (currentUser) => {
    return currentUser?._id
      ? `cartItems_${currentUser._id}`
      : "cartItems_guest";
  };

  // Har user ke liye alag unique localStorage wishlist key banana
  const getWishlistKey = (currentUser) => {
    return currentUser?._id
      ? `wishlistItems_${currentUser._id}`
      : "wishlistItems_guest";
  };

  // ================= CART =================

  // Cart state initialization - yeh page load par local storage se purana cart data uthayegi
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

  // Wishlist state initialization - yeh page load par local storage se purani wishlist uthayegi
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
  // Login/logout ke baad localStorage se har 1 second baad automated user detect karega.

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getUser();

      setUser((previousUser) => {
        const previousId = previousUser?._id || null;
        const currentId = currentUser?._id || null;

        // Agar user ID badal gayi hai to state update hogi
        if (previousId !== currentId) {
          return currentUser;
        }

        return previousUser;
      });
    };

    // Har 1 second baad chalne wala interval lagaya hai
    const interval = setInterval(checkUser, 1000);

    // Component unmount hote hi interval saaf ho jayega taaki memory leak na ho
    return () => clearInterval(interval);
  }, []);

  // ================= LOAD USER CART/WISHLIST =================

  // Jab bhi user change ya log-in hoga, uske mutabiq uska personal cart aur wishlist reload hoga
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

  // Cart me koi bhi tabdeeli aate hi automatic local storage me save ho jayega
  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(getCartKey(user), JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems, user]);

  // ================= SAVE WISHLIST =================

  // Wishlist me koi bhi tabdeeli aate hi automatic local storage me save ho jayega
  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(getWishlistKey(user), JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }, [wishlistItems, user]);

  // ================= FETCH PRODUCTS =================

  // Backend API se saare products load karne ka function
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:8000/api/products");

      const data = response.data;

      // Alag alag backend response format ke hisab se safe extraction
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

  // Pehli dafa page load hote hi saare products backend se fetch honge
  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD TO CART =================

  // Item cart me daalne ya uski quantity +1 badhane ke liye
  const addToCart = (productId) => {
    if (!productId) return;

    setCartItems((previousCart) => ({
      ...previousCart,
      [productId]: (previousCart[productId] || 0) + 1,
    }));
  };

  // ================= REMOVE FROM CART =================
  // Quantity ek kam karne ke liye. Agar 1 bachi ho to poora delete karna.

  const remFromCart = (productId) => {
    setCartItems((previousCart) => {
      const currentQuantity = previousCart[productId] || 0;

      // Agar item 1 hi bacha hai to use cart se poora ghayab kar do
      if (currentQuantity <= 1) {
        const updatedCart = { ...previousCart };
        delete updatedCart[productId];

        return updatedCart;
      }

      // Warna quantity me se 1 minus kar do
      return {
        ...previousCart,
        [productId]: currentQuantity - 1,
      };
    });
  };

  // ================= REMOVE ENTIRELY =================

  // Cart se bina quantity dekhe kisi product ko mukammal khatam karna
  const removeFromCart = (productId) => {
    setCartItems((previousCart) => {
      const updatedCart = { ...previousCart };

      delete updatedCart[productId];

      return updatedCart;
    });
  };

  // ================= UPDATE QUANTITY =================

  // Direct manual quantity set karne ke liye (input box ke liye)
  const updateQuantity = (productId, quantity) => {
    if (!productId) return;
    if (quantity < 1) return;

    setCartItems((previousCart) => ({
      ...previousCart,
      [productId]: quantity,
    }));
  };

  // ================= CLEAR CART =================

  // Cart khali karne ka function
  const clearCart = () => {
    setCartItems({});
  };

  // ================= CLEAR WISHLIST =================

  // Wishlist khali karne ka function
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // ================= TOGGLE WISHLIST =================

  // Wishlist me item add ya remove karne ke liye (Ek hi button se toggle)
  const toggleWishlist = (productId) => {
    if (!productId) return;

    setWishlistItems((previousWishlist) => {
      // Agar pehle se maujood hai to nikal do
      if (previousWishlist.includes(productId)) {
        return previousWishlist.filter((id) => id !== productId);
      }

      // Warna naya product id wishlist array me add kar do
      return [...previousWishlist, productId];
    });
  };

  // ================= CHECK WISHLIST =================

  // Yeh check karne ke liye ke product wishlist me hai ya nahi (Heads up for red heart icon)
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // ================= REMOVE FROM WISHLIST =================

  // Wishlist se item ko nikal bahar karne ke liye
  const removeFromWishlist = (productId) => {
    setWishlistItems((previousWishlist) =>
      previousWishlist.filter((id) => id !== productId),
    );
  };

  // ================= TOTAL AMOUNT =================

  // Cart me maujood saare products ka total price calculate karne ke liye
  const getTotalAmt = () => {
    let total = 0;

    for (const productId in cartItems) {
      const product = products.find((item) => item._id === productId);

      if (product) {
        total += product.price * cartItems[productId];
      }
    }

    return total;
  };

  // ================= TOTAL CART ITEMS =================

  // Cart me total kitni items (quantities) ho chuki hain count karne ke liye
  const getTotalcartItems = () => {
    let total = 0;

    for (const productId in cartItems) {
      total += cartItems[productId];
    }

    return total;
  };

  // ================= TOTAL WISHLIST ITEMS =================

  // Wishlist me total kitne products hain unka size batane ke liye
  const getTotalWishlistItems = () => {
    return wishlistItems.length;
  };

  // ================= FILTER PRODUCTS =================

  // Search query aur category filter ke mutabiq products ko filter out karna
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    // Name, description, category ya location me se kahin bhi search term match ho jaye
    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText) ||
      product.location?.toLowerCase().includes(searchText);
    // Ya to 'All' category ho ya phir specific category match kare
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  // ================= CONTEXT VALUE =================
  // Yeh saare functions aur states poori app me use karne ke liye export ho rahe hain
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
    <ShopContext.Provider value={ContextValue}>{children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
