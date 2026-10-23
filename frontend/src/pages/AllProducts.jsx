import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard"; // Apne path ke mutabiq check kar lein
import {
  Search,
  Loader2,
  PackageOpen,
  X,
  MapPin,
  Navigation,
} from "lucide-react";
export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sortByNearby, setSortByNearby] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();
  // Haversine Formula (Distance in Kilometers)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSortByNearby(true);
        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert("Location access denied or unavailable.");
        setIsLocating(false);
      },
    );
  };
  // ================= FILTER & SORT LOGIC =================
  useEffect(() => {
    let result = [...products];

    // 1. Search Filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.location?.toLowerCase().includes(searchLower),
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // 3. ✅ Nearby Sort
    if (sortByNearby && userLocation) {
      result = result.filter((p) => p.latitude && p.longitude); // Sirf woh jin ki location hai

      result.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.latitude,
          a.longitude,
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.latitude,
          b.longitude,
        );
        return distA - distB; // Qareeb wale pehle
      });
    }

    setFilteredProducts(result);
  }, [products, search, selectedCategory, sortByNearby, userLocation]);
  // ================= URL SE SEARCH & CATEGORY NIKALEIN =================
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("search") || "";
    const categoryParam = queryParams.get("category") || "All";

    setSearch(searchParam);

    // Category ko Capitalize karein (e.g. grains -> Grains)
    const formattedCategory =
      categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    setSelectedCategory(categoryParam === "All" ? "All" : formattedCategory);
  }, [location.search]);

  // ================= PRODUCTS FETCH KAREIN =================
  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= FILTER LOGIC =================
  useEffect(() => {
    let result = products;

    // 1. Search Filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.location?.toLowerCase().includes(searchLower),
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    setFilteredProducts(result);
  }, [products, search, selectedCategory]);

  // Categories list dropdown ke liye
  const categories = ["All", "Grains", "Pulses", "Fruits", "Veggies", "Spices"];

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      navigate("/allProducts");
    } else {
      navigate(`/allProducts?category=${cat.toLowerCase()}`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f8f1] pb-16 pt-20 mt-20 lg:mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ================= HEADER & FILTERS ================= */}
          <div className="mb-8 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-[#e8ebdf]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#033303]">
                  {selectedCategory === "All"
                    ? "All Products"
                    : selectedCategory}
                </h1>
                <p className="text-sm text-[#788174] mt-1">
                  Showing {filteredProducts.length} results{" "}
                  {search && `for "${search}"`}
                </p>
              </div>

              {/* Search Bar (Local) */}
              <div className="relative w-full md:w-72">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search in results..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#d5d9d5] bg-[#fafbf8] text-sm outline-none focus:border-[#006400]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-5 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                      selectedCategory === cat
                        ? "bg-[#006400] text-white shadow-md"
                        : "bg-[#edf3e5] text-[#2f8f1f] hover:bg-[#dce6c9]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* ✅ NEAR ME BUTTON */}
              <button
                onClick={handleNearMe}
                disabled={isLocating}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                  sortByNearby
                    ? "bg-[#006400] text-white shadow-md"
                    : "bg-white border border-[#e0e5da] text-[#006400] hover:bg-gray-50"
                }`}
              >
                {isLocating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <MapPin size={14} />
                )}
                {sortByNearby ? "Showing Nearby" : "Near Me"}
              </button>
            </div>
          </div>

          {/* ================= PRODUCTS GRID ================= */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#006400]">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="font-semibold">Fetching fresh produce...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#e8ebdf]">
              <PackageOpen size={50} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-700">
                No products found
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Try changing the category or search term.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryChange("All");
                }}
                className="mt-5 rounded-xl bg-[#006400] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#004d00]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
