import Contact from "../models/contact.model.js";

// User contact form submit karega
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newMsg = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: "Message sent successfully!", data: newMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin saari messages dekhega
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin message ka status change karega (unread -> read)
export const markContactAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMsg = await Contact.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true }
    );
    res.status(200).json({ success: true, message: updatedMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};