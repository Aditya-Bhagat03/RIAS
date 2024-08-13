const AntiRagging = require('../models/AntiRagging');
const User = require('../models/User'); // Assuming you have a User model

// Submit a new complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { studentId, complaint } = req.body;
    
    if (!studentId || !complaint) {
      return res.status(400).json({ message: "Student ID and complaint text are required" });
    }

    // Create a new anti-ragging complaint
    const newComplaint = new AntiRagging({
      studentId,
      complaint
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all complaints (admin access only)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await AntiRagging.find().populate('studentId', 'name');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
