import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Create Product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            quantity,
            location
        } = req.body;

        // Get image path from Multer
        const image = req.file?.path;

        if (!image) {
            throw new ApiError(400, "Product image is required");
        }

        // Upload image to Cloudinary
        const productImage = await uploadOnCloudinary(image);

        console.log("Product Image Path:", image);
        console.log("Cloudinary Response:", productImage);

        if (!productImage) {
            throw new ApiError(400, "Product image upload failed");
        }

        // Create product in MongoDB
        const newProduct = new Product({
            name,
            description,
            price,
            image: productImage.url,
            category,
            quantity,
            location
        });

        await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json(products);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


// Get Product By ID
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


// Update Product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const {
            name,
            description,
            price,
            category,
            quantity,
            location
        } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
                category,
                quantity,
                location
            },
            {
                new: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};