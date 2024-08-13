const Feedback = require("../models/Feedback");
const Timetable = require("../models/Timetable");
const User = require("../models/User");

// Submit theory feedback
exports.submitTheoryFeedback = async (req, res) => {
  try {
    const { studentId, feedbackEntries } = req.body;
    if (!feedbackEntries || !Array.isArray(feedbackEntries)) {
      return res.status(400).json({ message: "Invalid feedback data" });
    }

    // Save all theory feedback entries
    await Feedback.insertMany(
      feedbackEntries.map((entry) => ({
        studentId,
        ...entry,
      }))
    );

    res
      .status(201)
      .json({ message: "Theory feedback submitted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting theory feedback", error });
  }
};

// Submit practical feedback
exports.submitPracticalFeedback = async (req, res) => {
  try {
    const { studentId, feedbackEntries } = req.body;
    if (!feedbackEntries || !Array.isArray(feedbackEntries)) {
      return res.status(400).json({ message: "Invalid feedback data" });
    }

    // Save all practical feedback entries
    await Feedback.insertMany(
      feedbackEntries.map((entry) => ({
        studentId,
        ...entry,
      }))
    );

    res
      .status(201)
      .json({ message: "Practical feedback submitted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting practical feedback", error });
  }
};

// Get feedback by student ID
exports.getFeedbackByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const feedback = await Feedback.find({ studentId }).populate(
      "studentId",
      "username email mobileNumber registrationNumber semester branch section rollNumber"
    );

    if (feedback.length > 0) {
      res.json(feedback);
    } else {
      res.status(404).json({ message: "No feedback found for this student" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};

// Controller code for fetching all feedback entries

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate(
        "studentId",
        "username email mobileNumber registrationNumber semester branch section rollNumber"
      )
      .exec();

    if (feedbacks.length > 0) {
      res.json(feedbacks);
    } else {
      res.status(404).json({ message: "No feedback found" });
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};

// Get all unique faculty names from feedbacks
exports.getFacultyNamesFromFeedbacks = async (req, res) => {
  try {
    // Fetch distinct faculty names from the Feedback collection
    const facultyNames = await Feedback.distinct("facultyName");
    if (facultyNames.length > 0) {
      res.json(facultyNames);
    } else {
      res.status(404).json({ message: "No faculty names found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching faculty names from feedbacks", error });
  }
};




exports.getCourseNamesFromFeedbacks = async (req, res) => {
  try {
    const courseNames = await Feedback.distinct("courseName");
    if (courseNames.length > 0) {
      res.json(courseNames);
    } else {
      res.status(404).json({ message: "No course names found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching course names", error });
  }
};







exports.getCourseNamesFromFeedbacks = async (req, res) => {
  try {
    const courseNames = await Feedback.distinct("courseName");
    if (courseNames.length > 0) {
      res.json(courseNames);
    } else {
      res.status(404).json({ message: "No course names found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching course names from feedbacks", error });
  }
};



exports.getBranchesFromFeedbacks = async (req, res) => {
  try {
    const branches = await Feedback.distinct("branch");
    if (branches.length > 0) {
      res.json(branches);
    } else {
      res.status(404).json({ message: "No branches found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches from feedbacks", error });
  }
};



exports.getSemestersFromFeedbacks = async (req, res) => {
  try {
    const semesters = await Feedback.distinct("semester");
    if (semesters.length > 0) {
      res.json(semesters);
    } else {
      res.status(404).json({ message: "No semesters found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters from feedbacks", error });
  }
};



exports.getSectionsFromFeedbacks = async (req, res) => {
  try {
    const sections = await Feedback.distinct("section");
    if (sections.length > 0) {
      res.json(sections);
    } else {
      res.status(404).json({ message: "No sections found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections from feedbacks", error });
  }
};



exports.getSubjectNamesFromFeedbacks = async (req, res) => {
  try {
    const subjectNames = await Feedback.distinct("subjectName");
    if (subjectNames.length > 0) {
      res.json(subjectNames);
    } else {
      res.status(404).json({ message: "No subject names found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject names from feedbacks", error });
  }
};
exports.getFilteredFeedback = async (req, res) => {
  try {
    const { semester, branch, section, subjectName, courseName, facultyName } = req.query;

    // Construct filter object
    const filter = {};
    if (semester) filter.semester = semester;
    if (branch) filter.branch = branch;
    if (section) filter.section = section;
    if (subjectName) filter.subjectName = subjectName;
    if (courseName) filter.courseName = courseName;
    if (facultyName) filter.facultyName = facultyName;

    // Fetch filtered feedback with studentId populated with username
    const feedbacks = await Feedback.find(filter)
      .populate({
        path: "studentId",
        select: "username" // Only select the username field
      })
      .exec();

    if (feedbacks.length > 0) {
      res.json(feedbacks);
    } else {
      res.status(404).json({ message: "No feedback found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching filtered feedback", error });
  }
};


exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const result = await Feedback.findByIdAndDelete(feedbackId);

    if (result) {
      res.json({ message: "Feedback deleted successfully." });
    } else {
      res.status(404).json({ message: "Feedback not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback", error });
  }
};
