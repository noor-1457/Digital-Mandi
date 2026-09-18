import { useState } from "react";
// import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);
      data.append("location", formData.location);
      data.append("image", formData.image);

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add product");
      }

      console.log("Product created:", result);

      toast.success("Product added successfully!");
      // Form reset
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        location: "",
        image: null,
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    // YAHAN FIX HAI: lg:ml-72 add kiya gaya hai taaki sidebar ke saath overlap na ho
    <div className="min-h-screen bg-[#f5f7f2] lg:ml-72 pt-20 lg:pt-0">
      <div className="px-4 py-6 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#006400] md:text-3xl">
            Add Product
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Add your agricultural product for buyers.
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

            {/* Price + Quantity (Grid Layout) */}
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
                  Quantity
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
                <option value="Other">Other</option>
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
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                className="cursor-pointer w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#006400] file:text-white hover:file:bg-[#004d00]"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="cursor-pointer w-full rounded-lg bg-[#006400] px-6 py-3.5 font-semibold text-white transition hover:bg-[#004d00] md:w-auto md:min-w-[200px]"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
