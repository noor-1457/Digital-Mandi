import Notification from "../models/notification.model.js";

// ================= CREATE NOTIFICATION (Helper) =================
// Yeh function direct API ke liye nahi hai, balki backend ke andar use hoga
// (Jaise jab order aaye, ya message aaye, toh notification create karne ke liye)
export const createNotification = async ({ userId, type, title, message, relatedId = null }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// ================= GET MY NOTIFICATIONS =================
// User apni saari notifications fetch karega
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Sirf last 50 dikhayenge

    // Total unread count nikalein
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("getMyNotifications error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= MARK AS READ =================
// Ek specific notification ko read mark karein
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= MARK ALL AS READ =================
// Saari notifications ko ek saath read mark karein
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};