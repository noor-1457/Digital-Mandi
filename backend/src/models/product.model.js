import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
  },
  location: {
    type: String,
    required: [true, "Product location is required"],
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
