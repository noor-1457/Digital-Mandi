import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useCallback } from "react";
import { Navbar } from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // FILTER STATES
  // ==============================

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [availability, setAvailability] = useState(
    searchParams.get("availability") || ""
  );
  const [freshness, setFreshness] = useState(
    searchParams.get("freshness") || ""
  );

  const [showFilters, setShowFilters] = useState(false);

  // ==============================
  // STABLE SEARCH PARAMS STRING
  // ==============================
  // searchParams object ka reference har render pe badal sakta hai.
  // Isliye hum ek stable string banate hain jo sirf tab change hoti hai
  // jab actual query values change hon.

  const searchParamsString = searchParams.toString();

  // ==============================
  // SYNC FILTER STATES WITH URL
  // ==============================

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setLocation(searchParams.get("location") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setAvailability(searchParams.get("availability") || "");
    setFreshness(searchParams.get("freshness") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  // ==============================
  // FETCH PRODUCTS
  // ==============================

const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams(searchParamsString);
    const fullUrl = `http://localhost:8000/api/products?${params.toString()}`;

    console.log("🔥 FETCH URL:", fullUrl);

    const response = await fetch(fullUrl);

    console.log("🔥 RESPONSE STATUS:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    console.log("🔥 PRODUCTS COUNT:", data.length);

    setProducts(data);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, [searchParamsString]);

useEffect(() => {
  fetchProducts();
}, [fetchProducts]);

  // ==============================
  // APPLY FILTERS
  // ==============================
const handleApplyFilters = (e) => {
  e.preventDefault();

  const params = new URLSearchParams();

  const search = searchParams.get("search");
  if (search) params.set("search", search);

  if (category) params.set("category", category);
  if (location.trim()) params.set("location", location.trim());
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (availability) params.set("availability", availability);
  if (freshness) params.set("freshness", freshness);

  // 👇👇👇 YAHAN STRING BHEJO — OBJECT NAHI
  setSearchParams(params.toString());

  setShowFilters(false);
};

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    setCategory("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("");
    setFreshness("");

    // Navbar ka search preserve rahega
    const search = searchParams.get("search");
    if (search) {
      setSearchParams({ search });
    } else {
      setSearchParams({});
    }

    setShowFilters(false);
  };

  // ==============================
  // CHECK IF ANY FILTER IS ACTIVE
  // ==============================

  const hasActiveFilters =
    category || location || minPrice || maxPrice || availability || freshness;

  const searchQuery = searchParams.get("search") || "";

  return (
    <div className="min-h-screen bg-[#f5f7f2]">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= MAIN ================= */}
      <main className="pt-[143px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ================= HEADER ================= */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#006400]">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Browse Products"}
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-600">
              {searchQuery
                ? "Showing products matching your search."
                : "Find fresh agricultural products from local farmers."}
            </p>
          </div>

          {/* ================= FILTER BUTTON ================= */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="
                h-12
                px-6
                rounded-full
                bg-[#006400]
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-[#004d00]
                transition
                cursor-pointer
              "
            >
              <SlidersHorizontal size={19} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
              )}
            </button>
          </div>

          {/* ================= FILTER PANEL ================= */}
          {showFilters && (
            <form
              onSubmit={handleApplyFilters}
              className="
                bg-white
                rounded-2xl
                p-5
                md:p-6
                mb-8
                border
                border-gray-100
                shadow-sm
              "
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#173f32]">
                  Filter Products
                </h2>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    text-red-500
                    hover:text-red-700
                    cursor-pointer
                  "
                >
                  <X size={16} />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      outline-none
                      focus:border-[#006400]
                    "
                  >
                    <option value="">All Categories</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                    <option value="seeds">Seeds</option>
                    <option value="pulses">Pulses</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lahore"
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#006400]
                    "
                  />
                </div>

                {/* AVAILABILITY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>

                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      outline-none
                      focus:border-[#006400]
                    "
                  >
                    <option value="">All Products</option>
                    <option value="available">Available Only</option>
                  </select>
                </div>

                {/* MIN PRICE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min price"
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#006400]
                    "
                  />
                </div>

                {/* MAX PRICE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max price"
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#006400]
                    "
                  />
                </div>

                {/* FRESHNESS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Freshness
                  </label>

                  <select
                    value={freshness}
                    onChange={(e) => setFreshness(e.target.value)}
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      outline-none
                      focus:border-[#006400]
                    "
                  >
                    <option value="">Any Time</option>
                    <option value="today">Added Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* APPLY */}
              <button
                type="submit"
                className="
                  mt-6
                  w-full
                  sm:w-auto
                  px-8
                  py-3
                  rounded-full
                  bg-[#006400]
                  hover:bg-[#004d00]
                  text-white
                  font-semibold
                  transition
                  cursor-pointer
                "
              >
                Apply Filters
              </button>
            </form>
          )}

          {/* ================= RESULTS HEADER ================= */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#173f32]">
                {searchQuery ? "Search Results" : "All Products"}
              </h2>

              {!loading && (
                <p className="text-sm text-gray-500 mt-1">
                  {products.length} product
                  {products.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </div>

          {/* ================= PRODUCTS ================= */}
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                No products found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {searchQuery
                  ? `No products match "${searchQuery}". Try a different search.`
                  : "Try changing your search or filters."}
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4
              "
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default AllProducts;