import { useEffect, useState } from "react";
import axios from "axios";

const BuyerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/products"
      );

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

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Browse Products
      </h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              <h2 className="text-lg font-semibold mt-3">
                {product.name}
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                {product.description}
              </p>

              <p className="font-bold mt-2">
                Rs. {product.price}
              </p>

              <p className="text-sm text-gray-500">
                Available: {product.quantity}
              </p>

              <p className="text-sm text-gray-500">
                Location: {product.location}
              </p>

              <p className="text-sm text-green-700 mt-1">
                Category: {product.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerProducts;