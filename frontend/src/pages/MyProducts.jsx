import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        "http://localhost:8000/api/products/my-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteProducts = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `http://localhost:8000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh only logged-in farmer's products
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f2] lg:ml-72 pt-20 lg:pt-0">
      <div className="px-4 py-6 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006400] md:text-3xl">
            My Products
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Manage your agricultural products for buyers.
          </p>
        </div>

        {/* Product List */}
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#006400]/20 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#006400]/40 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-[#006400] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-3.5">
                    <h2 className="line-clamp-1 text-base font-semibold text-gray-800">
                      {product.name}
                    </h2>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                          Price
                        </p>

                        <p className="text-base font-bold text-[#006400]">
                          PKR {product.price}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                          Quantity
                        </p>

                        <p className="text-sm font-semibold text-gray-700">
                          {product.quantity} kg
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/edit-product/${product._id}`)
                        }
                        className="flex-1 rounded-lg border border-[#006400] py-1.5 text-xs font-medium text-[#006400] transition-all duration-300 hover:bg-[#006400] hover:text-white active:scale-95"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => DeleteProducts(product._id)}
                        className="flex-1 cursor-pointer rounded-lg bg-red-600 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:bg-red-700 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProducts;