const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  parentDepartment: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Faculty', facultySchema);
