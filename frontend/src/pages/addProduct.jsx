import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { id } = useParams(); // URL mein id ho to edit mode
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    location: "",
    image: null,
  });

  const [existingImage, setExistingImage] = useState(""); // edit mode mein purani image
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // ---------- EDIT MODE: purana product fetch karo ----------
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      setFetching(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${id}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          quantity: data.quantity || "",
          location: data.location || "",
          image: null, // naya image sirf tab jab user select kare
        });

        setExistingImage(data.image || "");
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message);
        navigate("/myProducts");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, navigate]);

  // ---------- Input change ----------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ---------- Submit: POST (add) ya PUT (edit) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔥 ADD PRODUCT HANDLE SUBMIT RUNNING");

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);
      data.append("location", formData.location);

      // Image sirf tab bhejo jab user ne nayi select ki ho
      if (formData.image) {
        data.append("image", formData.image);
      }

      const url = isEditMode
        ? `http://localhost:8000/api/products/${id}`
        : "http://localhost:8000/api/products";

      const method = isEditMode ? "PUT" : "POST";

      const token = localStorage.getItem("token");
      console.log("🔥 URL:", url);
      console.log("🔥 METHOD:", method);
      console.log("🔥 TOKEN:", token ? "TOKEN EXISTS" : "NO TOKEN");
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEditMode ? "Failed to update product" : "Failed to add product"),
        );
      }
        window.location.href = "/myProducts";

      toast.success(
        isEditMode
          ? "Product updated successfully!"
          : "Product added successfully!",
      );

      // Add mode mein form reset
      if (!isEditMode) {
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          quantity: "",
          location: "",
          image: null,
        });
      } else {
        window.location.href = "/myProducts";
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Loading state (edit mode mein fetch hotay waqt) ----------
  if (fetching) {
    return (
      <div className="min-h-screen bg-[#f5f7f2] lg:ml-72 pt-20 lg:pt-0 flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f2] lg:ml-72 pt-20 lg:pt-0">
      <div className="px-4 py-6 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006400] md:text-3xl">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            {isEditMode
              ? "Update your product details."
              : "Add your agricultural product for buyers."}
          </p>
          
        </div>

        {/* Form Card */}
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Fresh Tomatoes"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-[#006400] focus:ring-1 focus:ring-[#006400]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="4"
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-[#006400] focus:ring-1 focus:ring-[#006400]"
              />
            </div>

            {/* Price + Quantity */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-[#006400] focus:ring-1 focus:ring-[#006400]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-[#006400] focus:ring-1 focus:ring-[#006400]"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="cursor-pointer w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-[#006400] focus:ring-1 focus:ring-[#006400]"
              >
                <option value="">Select Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Pulses">Pulses</option>
                <option value="Seeds">Seeds</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lahore, Punjab"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-[#006400] focus:ring-1 focus:ring-[#006400]"
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Image
              </label>

              {/* Edit mode mein purani image ka preview */}
              {isEditMode && existingImage && (
                <div className="mb-3 flex items-center gap-4">
                  <img
                    src={existingImage}
                    alt="Current"
                    className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                  />
                </div>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!isEditMode} // edit mein optional
                className="cursor-pointer w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#006400] file:text-white hover:file:bg-[#004d00]"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full rounded-lg bg-[#006400] px-6 py-3.5 font-semibold text-white transition hover:bg-[#004d00] disabled:opacity-60 md:w-auto md:min-w-[200px]"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => navigate("/myProducts")}
                  className="cursor-pointer rounded-lg border border-gray-300 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
