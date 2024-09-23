const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadCSV, uploadTimetableCSV, uploadFacultyCSV } = require("../controllers/csvController"); // Import the new controller

// Configure multer for CSV upload
const storage = multer.diskStorage({
  destination: "./uploads/", // Save the uploaded files in the 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only CSV files are allowed!");
    }
  },
});

// Route for uploading user data via CSV
router.post("/upload-csv", upload.single("file"), uploadCSV);

// Route for uploading timetable data via CSV
router.post("/upload-timetable-csv", upload.single("file"), uploadTimetableCSV);

// Route for uploading faculty data via CSV
router.post("/upload-faculty-csv", upload.single("file"), uploadFacultyCSV);

module.exports = router;
