import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { validationResult } from "express-validator";
import { createNotification } from "./notificationController.js";
import { getSocketIO } from "../utils/socket.js"; // ✅ Socket Helper Import

// ================= CREATE ORDER (Buyer) =================
export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      items,
      shippingAddress,
      notes,
      paymentMethod,
      subtotal,
      deliveryFee,
      totalAmount,
    } = req.body;

    const buyerId = req.user._id;

    // ✅ 1. Stock validate karein
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `${product.name} — only ${product.quantity} units available`,
        });
      }
    }

    // ✅ 2. Order create karein
    const newOrder = new Order({
      buyerId,
      items,
      shippingAddress,
      notes,
      paymentMethod,
      subtotal,
      deliveryFee,
      totalAmount,
      status: "pending",
    });

    await newOrder.save();

    // ✅ 3. Stock minus karein
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    // ✅ 4. FARMER KO NOTIFICATION BHEJEIN (Real-time)
    const io = getSocketIO(); // Socket instance nikalein
    const farmerIds = new Set(); 
    
    for (const item of items) {
      const product = await Product.findById(item.productId).populate("farmer");
      if (product && product.farmer) {
        farmerIds.add(product.farmer._id.toString());
      }
    }

    for (const fId of farmerIds) {
      const notif = await createNotification({
        userId: fId,
        type: "order",
        title: "New Order Received! 🎉",
        message: `You have a new order of Rs. ${totalAmount}. Check your dashboard.`,
        relatedId: newOrder._id,
      });

      // ✅ REAL-TIME EMIT (Farmer ko turant bhejein)
      if (io && notif) {
        io.to(fId).emit("newNotification", notif);
      }
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET MY ORDERS (Buyer) =================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate("items.productId", "name image price category location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET FARMER ORDERS =================
export const getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const orders = await Order.find({
      "items.productId": {
        $in: await Product.find({ farmer: farmerId }).distinct("_id"),
      },
    })
      .populate("buyerId", "fullName email mobileNumber")
      .populate("items.productId", "name image price farmer")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE ORDER STATUS (Farmer) =================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    // ✅ 5. BUYER KO NOTIFICATION BHEJEIN (Real-time)
    let title = "";
    let message = "";

    if (status === "confirmed") {
      title = "Order Confirmed! ✅";
      message = "The farmer has accepted your order and is preparing it.";
    } else if (status === "delivered") {
      title = "Order Delivered! 📦";
      message = "Your order has been delivered. Don't forget to leave a review!";
    } else if (status === "cancelled") {
      title = "Order Cancelled ❌";
      message = "Unfortunately, the farmer had to cancel your order.";
    }

    if (title && message) {
      const notif = await createNotification({
        userId: existingOrder.buyerId,
        type: "order",
        title,
        message,
        relatedId: order._id,
      });

      // ✅ REAL-TIME EMIT (Buyer ko turant bhejein)
      const io = getSocketIO();
      if (io && notif) {
        io.to(existingOrder.buyerId.toString()).emit("newNotification", notif);
      }
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SINGLE ORDER =================
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("buyerId", "fullName email mobileNumber")
      .populate(
        "items.productId",
        "name image price category location farmer",
      )
      .populate("items.productId.farmer", "fullName email mobileNumber");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET TRANSACTION HISTORY =================
// Buyer ke liye (jo orders usne kiye) ya Farmer ke liye (jo orders usay mile)
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role || req.user.userRole; 

    let transactions = [];

    if (role === "buyer") {
      // Buyer ki transactions: Jo orders usne place kiye aur delivered ho gaye
      transactions = await Order.find({ 
        buyerId: userId,
        status: "delivered" // Sirf delivered orders ka paisa count hoga
      })
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });

    } else if (role === "farmer") {
      // Farmer ki transactions: Jismein uske products hain aur delivered ho chuke hain
      const products = await Product.find({ farmer: userId }).distinct("_id");
      
      transactions = await Order.find({
        "items.productId": { $in: products },
        status: "delivered"
      })
      .populate("buyerId", "fullName")
      .populate("items.productId", "name image farmer")
      .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("getTransactionHistory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};