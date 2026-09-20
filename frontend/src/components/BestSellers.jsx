import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
                     <div className="bg-[#006400] h-5 w-15 rounded"></div>
 <h2 className="text-2xl sm:text-3xl font-bold text-[#006400]">
              Best Sellers
            </h2>          </div>
          <a
            href="/best-sellers"
            className="flex items-center gap-1 text-sm font-semibold text-[#006400] hover:underline"
          >
            View More <ArrowRight size={16} />
          </a>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default BestSellers;