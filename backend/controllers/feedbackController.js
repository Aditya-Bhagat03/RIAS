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

    // Check if the student has already submitted feedback
    const existingFeedback = await Feedback.findOne({
      studentId: studentId,
      type: 'theory',
    });

    if (existingFeedback) {
      console.log("Feedback has already been submitted by this student.");
      return res.status(400).json({ message: "Feedback cannot be submitted twice." });
    }

    // Save all theory feedback entries
    await Feedback.insertMany(
      feedbackEntries.map((entry) => ({
        studentId,
        type: 'theory', // Set the type field
        ...entry,
      }))
    );

    res
      .status(201)
      .json({ message: "Theory feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting theory feedback:", error);
    res
      .status(500)
      .json({ message: "Error submitting theory feedback", error });
  }
};













// Similar changes for submitPracticalFeedbac
exports.submitPracticalFeedback = async (req, res) => {
  try {
    const { studentId, feedbackEntries } = req.body;

    if (!feedbackEntries || !Array.isArray(feedbackEntries) || feedbackEntries.length === 0) {
      return res.status(400).json({ message: "Invalid feedback data" });
    }

    // Define the required fields for feedback entries
    const requiredFields = ['facultyName', 'courseName', 'branch', 'section', 'semester', 'batch', 'subjectName', 'courseCode','time', 'responses'];

    // Check if all feedback entries have the required fields and are not empty
    const areEntriesValid = feedbackEntries.every(entry =>
      requiredFields.every(field => entry[field] !== undefined && entry[field] !== '')
    );

    if (!areEntriesValid) {
      return res.status(400).json({ message: "All feedback questions must be answered" });
    }

    // Check if the student has already submitted feedback
    const existingFeedback = await Feedback.findOne({
      studentId: studentId,
      type: 'practical',
    });

    if (existingFeedback) {
      console.log("Feedback has already been submitted by this student.");
      return res.status(400).json({ message: "Feedback cannot be submitted twice." });
    }

    // Save all practical feedback entries
    await Feedback.insertMany(
      feedbackEntries.map((entry) => ({
        studentId,
        type: 'practical', // Set the type field
        ...entry,
      }))
    );

    res.status(201).json({ message: "Practical feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting practical feedback:", error);
    res.status(500).json({ message: "Error submitting practical feedback", error });
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
    res
      .status(500)
      .json({ message: "Error fetching course names from feedbacks", error });
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
    res
      .status(500)
      .json({ message: "Error fetching branches from feedbacks", error });
  }
};



// Add this function in your feedbackController.js

exports.getTypesFromFeedbacks = async (req, res) => {
  try {
    const types = await Feedback.distinct("type");
    if (types.length > 0) {
      res.json(types);
    } else {
      res.status(404).json({ message: "No types found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching types from feedbacks", error });
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
    res
      .status(500)
      .json({ message: "Error fetching semesters from feedbacks", error });
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
    res
      .status(500)
      .json({ message: "Error fetching sections from feedbacks", error });
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
    res
      .status(500)
      .json({ message: "Error fetching subject names from feedbacks", error });
  }
};
exports.getFilteredFeedback = async (req, res) => {
  try {
    const { semester, branch, section, subjectName, courseName, facultyName } =
      req.query;

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
        select: "username", // Only select the username field
      })
      .exec();

    if (feedbacks.length > 0) {
      res.json(feedbacks);
    } else {
      res.status(404).json({ message: "No feedback found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching filtered feedback", error });
  }
};

// Function to delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    // Find and delete feedback by ID
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













// feedbackController.js
// feedbackController.js
// feedbackController.js
// Get analysis data
exports.getAnalysisData = async (req, res) => {
  try {
    const { semester, branch, type, subjectName, courseName, facultyName } = req.query;

    // Build the query object dynamically based on available parameters
    const filters = {
      ...(semester && { semester }),
      ...(branch && { branch }),
      ...(type && { type }),
      ...(subjectName && { subjectName }),
      ...(courseName && { courseName }),
      ...(facultyName && { facultyName }),
    };

    // Fetch feedbacks based on the dynamic query
    const feedbacks = await Feedback.find(filters);
    const totalFeedbacks = feedbacks.length;

    // Check if feedbacks are found
    if (totalFeedbacks === 0) {
      return res.status(404).json({ message: "No feedback found for the given criteria" });
    }

    // Initialize variables for analysis
    let totalScore = 0;
    let goodFeedbacks = 0;
    let badFeedbacks = 0;
    const questionScores = {};
    const questionCounts = {};

    // Process each feedback
    feedbacks.forEach(feedback => {
      const responses = Object.fromEntries(feedback.responses);

      Object.keys(responses).forEach(key => {
        const score = parseFloat(responses[key]);

        if (!isNaN(score)) {
          totalScore += score;

          if (score >= 4) {
            goodFeedbacks++;
          } else if (score <= 2) {
            badFeedbacks++;
          }

          if (!questionScores[key]) {
            questionScores[key] = 0;
            questionCounts[key] = 0;
          }

          questionScores[key] += score;
          questionCounts[key]++;
        }
      });
    });

    // Calculate average score
    const averageScore = totalScore / (totalFeedbacks * Object.keys(questionCounts).length);

    // Calculate question averages
    const questionAverages = Object.keys(questionScores).reduce((acc, key) => {
      acc[key] = questionScores[key] / questionCounts[key];
      return acc;
    }, {});

    // Respond with analysis data
    res.json({
      averageScore: (averageScore / 5 * 100).toFixed(2) + '%',
      goodFeedbacks,
      badFeedbacks,
      totalFeedbacks,
      questionAverages: Object.fromEntries(
        Object.entries(questionAverages).map(([key, avg]) => [key, (avg / 4 * 100).toFixed(2) + '%'])
      ),
      feedbacks // include feedbacks data for detailed view
    });
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    res.status(500).json({ message: "Error analyzing feedback", error });
  }
};