const express = require("express");
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');


// Route to submit theory feedback
router.post("/theory/submit", feedbackController.submitTheoryFeedback);

// Route to submit practical feedback
router.post("/practical/submit", feedbackController.submitPracticalFeedback);

// Route to get feedback by student ID
router.get("/:studentId", feedbackController.getFeedbackByStudent);

router.get('/feedbacks/all', feedbackController.getAllFeedback);

router.get('/feedbacks/all', feedbackController.getAllFeedback);


// Route to get all feedback entries
router.get('/feedbacks', feedbackController.getAllFeedback);

// Route to get unique faculty names from feedbacks
router.get('/feedbacks/faculty-names', feedbackController.getFacultyNamesFromFeedbacks);

// Route to get course names from feedbacks
router.get('/feedbacks/course-names', feedbackController.getCourseNamesFromFeedbacks);




// Route to get course names from feedbacks
router.get('/feedbacks/course-names', feedbackController.getCourseNamesFromFeedbacks);

// Route to get all feedback

// Route to get branch names from feedbacks
router.get('/feedbacks/branches', feedbackController.getBranchesFromFeedbacks);

// Route to get semester names from feedbacks
router.get('/feedbacks/semesters', feedbackController.getSemestersFromFeedbacks);


// Route to get section names from feedbacks
router.get('/feedbacks/sections', feedbackController.getSectionsFromFeedbacks);

// Route to get subject names from feedbacks
router.get('/feedbacks/subject-names', feedbackController.getSubjectNamesFromFeedbacks);
// Route to get filtered feedback based on selected options
router.get('/feedbacks/filtered', feedbackController.getFilteredFeedback);


// Route to delete feedback
router.delete('/feedbacks/:feedbackId', feedbackController.deleteFeedback);

  




module.exports = router;
