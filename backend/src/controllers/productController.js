import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// ======================================================
// CREATE PRODUCT
// ======================================================
const createProduct = async (req, res, next) => {
  try {
    console.log("\n========== CREATE PRODUCT ==========");

    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);
    console.log("REQ.USER:", req.user);
    console.log("REQ.USER ID:", req.user?._id);

    const {
      name,
      description,
      price,
      category,
      quantity,
      location,
    } = req.body;

    // Get image path from Multer
    const image = req.file?.path;

    console.log("Multer Image Path:", image);

    if (!image) {
      throw new ApiError(400, "Product image is required");
    }

    // Upload image to Cloudinary
    console.log("Uploading image to Cloudinary...");

    const productImage = await uploadOnCloudinary(image);

    console.log("Cloudinary Response:", productImage);

    if (!productImage) {
      throw new ApiError(400, "Product image upload failed");
    }

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication required");
    }

    // Create product
    const newProduct = new Product({
      name,
      description,
      price,
      image: productImage.url,
      category,
      quantity,
      location,
      farmer: req.user._id,
    });

    console.log("NEW PRODUCT BEFORE SAVE:", newProduct);

    await newProduct.save();

    console.log("PRODUCT SAVED SUCCESSFULLY:", newProduct._id);
    console.log("==================================\n");

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("\n❌ CREATE PRODUCT ERROR:");
    console.error(error);

    // ApiError ko error middleware/controller tak bhejo
    next(error);
  }
};


// ======================================================
// GET ALL PRODUCTS
// ======================================================
// ======================================================
// GET ALL PRODUCTS / SEARCH / FILTER PRODUCTS
// ======================================================

const getProducts = async (req, res, next) => {
  try {
    console.log("\n========== GET / SEARCH PRODUCTS ==========");

    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      availability,
      freshness,
    } = req.query;

    console.log("Search:", search);
    console.log("Category:", category);
    console.log("Location:", location);
    console.log("Min Price:", minPrice);
    console.log("Max Price:", maxPrice);
    console.log("Availability:", availability);
    console.log("Freshness:", freshness);

    const filter = {};

    // ==========================================
    // SEARCH BY KEYWORD
    // ==========================================

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // ==========================================
    // FILTER BY CATEGORY
    // ==========================================

    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    // ==========================================
    // FILTER BY LOCATION
    // ==========================================

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // ==========================================
    // FILTER BY PRICE RANGE
    // ==========================================

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // ==========================================
    // FILTER BY AVAILABILITY
    // ==========================================

    if (availability === "available") {
      filter.quantity = { $gt: 0 };
    }

    // ==========================================
    // FILTER BY FRESHNESS
    // ==========================================

    if (freshness) {
      const now = new Date();
      let dateLimit;

      if (freshness === "today") {
        dateLimit = new Date();
        dateLimit.setHours(0, 0, 0, 0);
      }

      if (freshness === "week") {
        dateLimit = new Date();
        dateLimit.setDate(now.getDate() - 7);
      }

      if (freshness === "month") {
        dateLimit = new Date();
        dateLimit.setDate(now.getDate() - 30);
      }

      if (dateLimit) {
        filter.createdAt = { $gte: dateLimit };
      }
    }

    // ==========================================
    // GET PRODUCTS
    // ==========================================

    const products = await Product.find(filter)
      .populate("farmer", "name email")
      .sort({ createdAt: -1 });

    console.log("Products Found:", products.length);
    console.log("=========================================\n");

    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ GET / SEARCH PRODUCTS ERROR:", error);
    next(error);
  }
};


// ======================================================
// GET PRODUCT BY ID
// ======================================================
const getProductById = async (req, res, next) => {
  try {
    console.log("\n========== GET PRODUCT BY ID ==========");

    const productId = req.params.id;

    console.log("Product ID:", productId);

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    console.log("Product Found:", product._id);

    return res.status(200).json(product);
  } catch (error) {
    console.error("❌ GET PRODUCT BY ID ERROR:", error);

    next(error);
  }
};


// ======================================================
// UPDATE PRODUCT
// ======================================================
const updateProduct = async (req, res, next) => {
  try {
    console.log("\n========== UPDATE PRODUCT ==========");

    const productId = req.params.id;

    console.log("Product ID:", productId);
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    const {
      name,
      description,
      price,
      category,
      quantity,
      location,
    } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      quantity,
      location,
    };

    // Agar new image select ki gayi hai
    if (req.file?.path) {
      console.log("New image detected:", req.file.path);
      console.log("Uploading new image to Cloudinary...");

      const productImage = await uploadOnCloudinary(req.file.path);

      console.log("Cloudinary Response:", productImage);

      if (!productImage) {
        throw new ApiError(400, "Product image upload failed");
      }

      updateData.image = productImage.url;

      console.log("New Image URL:", updateData.image);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    console.log("PRODUCT UPDATED:", updatedProduct._id);
    console.log("===================================\n");

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("\n❌ UPDATE PRODUCT ERROR:");
    console.error(error);

    next(error);
  }
};


// ======================================================
// DELETE PRODUCT
// ======================================================
const deleteProduct = async (req, res, next) => {
  try {
    console.log("\n========== DELETE PRODUCT ==========");

    const productId = req.params.id;

    console.log("Product ID:", productId);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new ApiError(404, "Product not found");
    }

    console.log("PRODUCT DELETED:", deletedProduct._id);
    console.log("===================================\n");

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("\n❌ DELETE PRODUCT ERROR:");
    console.error(error);

    next(error);
  }
};


// ======================================================
// GET MY PRODUCTS
// ======================================================
const getMyProducts = async (req, res, next) => {
  try {
    console.log("\n========== GET MY PRODUCTS ==========");

    console.log("REQ.USER:", req.user);
    console.log("FARMER ID:", req.user?._id);

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication required");
    }

    const products = await Product.find({
      farmer: req.user._id,
    });

    console.log("My Products Found:", products.length);

    return res.status(200).json(products);
  } catch (error) {
    console.error("\n❌ GET MY PRODUCTS ERROR:");
    console.error(error);

    next(error);
  }
};


export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};