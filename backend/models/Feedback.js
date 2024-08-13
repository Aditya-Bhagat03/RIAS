const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  

  facultyName: { type: String, required: true },
  courseName: { type: String, required: true },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  batch: { type: String, required: true },
  subjectName: { type: String, required: true },
  courseCode: { type: String, required: true },
  responses: {
    type: Map,
    of: Number,
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
