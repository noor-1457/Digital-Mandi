import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

// ================= GET ADMIN STATS =================
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ userRole: "farmer" });
    const totalBuyers = await User.countDocuments({ userRole: "buyer" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Total Revenue (sirf delivered orders ka)
    const deliveredOrders = await Order.find({ status: "delivered" });
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {
    // Password field ko chhor kar baaki sab le aayein
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= BLOCK / UNBLOCK USER =================
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Agar user model mein isBlocked field nahi hai, toh default false banayenge
    user.isBlocked = !user.isBlocked; 
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: user.isBlocked ? "User Blocked" : "User Unblocked",
      user 
    });
  } catch (error) {
    console.error("toggleUserBlock error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL PRODUCTS =================
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmer", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("getAllProductsAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL ORDERS =================
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyerId", "fullName email")
      .populate("items.productId", "name image price farmer")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getAllOrdersAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserApproval = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = !user.isApproved;
    await user.save();

    res.status(200).json({ success: true, message: "Approval status updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};