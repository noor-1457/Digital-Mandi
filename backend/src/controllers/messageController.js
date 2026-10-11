import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id; // verifyJWT se
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({
        message: "receiverId and text are required",
      });
    }

    // ✅ Step 1: Conversation dhoondein ya nayi banayein
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // ✅ Step 2: Message create karein
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
    });

    // ✅ Step 3: Conversation mein lastMessage update karein
    conversation.lastMessage = newMessage._id;
    conversation.lastMessageAt = newMessage.createdAt;
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MESSAGES (ek conversation ke) =================
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    }); // purane pehle, naye baad mein

    res.status(200).json(messages);
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY CONVERSATIONS (chat list) =================
export const getConversations = async (req, res) => {
  try {
    const myId = req.user._id;

    // Woh saari conversations jismein main shamil hoon
    const conversations = await Conversation.find({
      participants: myId,
    })
      .populate("participants", "fullName email userRole")
      .populate("lastMessage", "text senderId read createdAt")
      .sort({ lastMessageAt: -1 }); // latest pehle

    // Har conversation mein "otherUser" aur "unreadCount" nikalein
    const formatted = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.participants.find(
          (p) => p._id.toString() !== myId.toString(),
        );

        // Unread count: jo messages mujhe aaye aur read nahi
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: myId,
          read: false,
        });

        return {
          _id: conv._id,
          otherUser,
          lastMessage: conv.lastMessage?.text || "",
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      }),
    );

    res.status(200).json(formatted);
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= MARK MESSAGES AS READ =================
export const markAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { conversationId } = req.params;

    await Message.updateMany(
      {
        conversationId,
        receiverId: myId,
        read: false,
      },
      { $set: { read: true } },
    );

    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET OR CREATE CONVERSATION =================
// Yeh function frontend se call hoga jab buyer "Contact Farmer" click kare

export const getOrCreateConversation = async (req, res) => {
  try {
    const myId = req.user._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId is required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [myId, otherUserId] },
    }).populate("participants", "fullName email userRole");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [myId, otherUserId],
      });
      await conversation.populate("participants", "fullName email userRole");
    }

    // ✅ FIX: otherUser field add karein
    const otherUser = conversation.participants.find(
      (p) => p._id.toString() !== myId.toString(),
    );

    const response = {
      ...conversation.toObject(),
      otherUser,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("getOrCreateConversation error:", error);
    res.status(500).json({ message: error.message });
  }
};