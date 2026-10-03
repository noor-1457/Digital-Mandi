import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { validationResult } from "express-validator";

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

    // Un orders ko dhoondein jismein is farmer ke products hain
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

    const validStatuses = [
      "pending",
      "confirmed",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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
      .populate("items.productId", "name image price category location");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};