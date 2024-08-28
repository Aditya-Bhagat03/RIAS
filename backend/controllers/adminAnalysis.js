const Feedback = require("../models/Feedback"); // Adjust path as necessary

exports.getFeedbackAnalysis = async (req, res) => {
  try {
    const { facultyName, courseName, type, semester, branch } = req.query;

    // Check for required parameters
    if (!facultyName || !courseName || !type || !semester || !branch) {
      return res
        .status(400)
        .json({
          message:
            "Faculty Name, Course Name, Type, Semester, and Branch are required",
        });
    }

    // Fetch feedbacks based on all criteria
    const feedbacks = await Feedback.find({
      facultyName,
      courseName,
      type,
      semester,
      branch,
    });

    // Check if feedbacks are found
    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for the given criteria" });
    }

    // Initialize variables for analysis
    let totalScores = 0;
    let count = 0;
    let goodFeedbacks = 0;
    let badFeedbacks = 0;

    const questionScores = {};
    const questionCounts = {};

    // Process each feedback
    feedbacks.forEach((feedback) => {
      const responses = feedback.responses || {};
      const keys = Object.keys(responses);

      keys.forEach((key) => {
        // Exclude specific responses
        if (
          key ===
          "0_Practical sessions were well-organized and conducted in a structured manner"
        ) {
          return;
        }

        const score = parseFloat(responses[key]);

        if (!isNaN(score)) {
          totalScores += score;
          count++;

          if (score >= 3) {
            // Adjust the threshold based on 0 to 4 scale
            goodFeedbacks++;
          } else if (score <= 1) {
            // Adjust the threshold based on 0 to 4 scale
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

    // Calculate average score as percentage
    const averageScore =
      count > 0
        ? ((totalScores / (count * maxScore)) * 100).toFixed(2)
        : "0.00";

    // Calculate question averages as percentage
    const questionAverages = Object.keys(questionScores).reduce((acc, key) => {
      acc[key] =
        (
          (questionScores[key] / (questionCounts[key] * maxScore)) *
          100
        ).toFixed(2) + "%";
      return acc;
    }, {});

    // Calculate percentages for good and bad feedbacks
    const goodFeedbacksPercentage =
      count > 0 ? ((goodFeedbacks / count) * 100).toFixed(2) + "%" : "0.00%";
    const badFeedbacksPercentage =
      count > 0 ? ((badFeedbacks / count) * 100).toFixed(2) + "%" : "0.00%";

    // Respond with analysis data
    res.json({
      averageScore: `${averageScore}%`,
      goodFeedbacks: goodFeedbacksPercentage,
      badFeedbacks: badFeedbacksPercentage,
      totalFeedbacks: count,
      questionAverages,
    });
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    res.status(500).json({ message: "Error analyzing feedback", error });
  }
};

// Maximum score used for percentage calculation
const maxScore = 4;

exports.getFeedbackAnalysisBySubjectAndType = async (req, res) => {
  try {
    const { subjectName, type } = req.query;

    // Check for required parameters
    if (!subjectName || !type) {
      return res
        .status(400)
        .json({ message: "Subject Name and Type are required" });
    }

    // Fetch feedbacks based on the subject name and type
    const feedbacks = await Feedback.find({
      subjectName,
      type, // Add filter for type
    });

    // Check if feedbacks are found
    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for the given subject and type" });
    }

    // Initialize variables for analysis
    const facultyAnalysis = {};

    // Process each feedback
    feedbacks.forEach((feedback) => {
      const { facultyName, branch, responses } = feedback;
      if (!responses) return;

      // Convert responses from Map to an object
      const responsesObj = Object.fromEntries(responses);

      // Get all scores
      const scores = Object.values(responsesObj).map((score) =>
        parseFloat(score)
      );
      const validScores = scores.filter((score) => !isNaN(score));
      const totalScore = validScores.reduce((acc, score) => acc + score, 0);
      const count = validScores.length;

      if (count === 0) return;

      const averageScore = totalScore / count;

      if (!facultyAnalysis[facultyName]) {
        facultyAnalysis[facultyName] = {
          branchAnalysis: {},
          totalScore: 0,
          count: 0,
        };
      }

      if (!facultyAnalysis[facultyName].branchAnalysis[branch]) {
        facultyAnalysis[facultyName].branchAnalysis[branch] = {
          totalScore: 0,
          count: 0,
        };
      }

      facultyAnalysis[facultyName].branchAnalysis[branch].totalScore +=
        averageScore;
      facultyAnalysis[facultyName].branchAnalysis[branch].count += 1;
      facultyAnalysis[facultyName].totalScore += averageScore;
      facultyAnalysis[facultyName].count += 1;
    });

    // Calculate average score and percentage per faculty per branch
    const result = Object.keys(facultyAnalysis)
      .map((facultyName) => {
        const branchAnalysis = facultyAnalysis[facultyName].branchAnalysis;
        const branches = Object.keys(branchAnalysis);

        return branches.map((branch) => {
          const branchData = branchAnalysis[branch];
          const averageScore =
            branchData.count > 0
              ? (branchData.totalScore / branchData.count).toFixed(2)
              : "0.00";
          const averagePercentage = (
            (branchData.totalScore / (branchData.count * maxScore)) *
            100
          ).toFixed(2);
          return {
            facultyName,
            branch,
            averageRating: averageScore,
            averagePercentage: averagePercentage,
          };
        });
      })
      .flat();

    // Respond with analysis data
    res.json(result);
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    res.status(500).json({ message: "Error analyzing feedback", error });
  }
};

exports.getFeedbackAnalysisByFaculty = async (req, res) => {
  try {
    const { facultyName } = req.query;

    // Check for required parameter
    if (!facultyName) {
      return res.status(400).json({ message: "Faculty Name is required" });
    }

    // Fetch feedbacks based on the faculty name
    const feedbacks = await Feedback.find({ facultyName });

    // Check if feedbacks are found
    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for the given faculty" });
    }

    // Initialize variables for analysis
    const subjectAnalysis = {};

    // Process each feedback
    feedbacks.forEach((feedback) => {
      const { subjectName, branch, type, responses } = feedback;
      if (!responses) return;

      // Convert responses from Map to an object
      const responsesObj = Object.fromEntries(responses);

      // Get all scores
      const scores = Object.values(responsesObj).map((score) =>
        parseFloat(score)
      );
      const validScores = scores.filter((score) => !isNaN(score));
      const totalScore = validScores.reduce((acc, score) => acc + score, 0);
      const count = validScores.length;

      if (count === 0) return;

      const averageScore = totalScore / count;

      const key = `${subjectName}-${branch}-${type}`;

      if (!subjectAnalysis[key]) {
        subjectAnalysis[key] = {
          totalScore: 0,
          count: 0,
        };
      }

      subjectAnalysis[key].totalScore += averageScore;
      subjectAnalysis[key].count += 1;
    });

    // Calculate average score and percentage per subject, branch, and type
    const result = Object.keys(subjectAnalysis).map((key) => {
      const [subjectName, branch, type] = key.split("-");
      const subjectData = subjectAnalysis[key];
      const averageScore =
        subjectData.count > 0
          ? (subjectData.totalScore / subjectData.count).toFixed(2)
          : "0.00";
      const averagePercentage = (
        (subjectData.totalScore / (subjectData.count * maxScore)) *
        100
      ).toFixed(2);
      return {
        facultyName,
        subjectName,
        branch,
        type,
        averageRating: averageScore,
        averagePercentage: averagePercentage,
      };
    });

    // Respond with analysis data
    res.json(result);
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    res.status(500).json({ message: "Error analyzing feedback", error });
  }
};

exports.getFeedbackAnalysisByBranch = async (req, res) => {
  try {
    const { branch } = req.query;

    if (!branch) {
      return res.status(400).json({ message: "Branch is required" });
    }

    const feedbacks = await Feedback.find({ branch });

    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for the given branch" });
    }

    const facultyAnalysis = {};

    feedbacks.forEach((feedback) => {
      const { facultyName, courseName, responses } = feedback;
      if (!responses) return;

      const responsesObj = Object.fromEntries(responses);

      // Convert responses to a scale of 4
      const scores = Object.values(responsesObj).map((score) =>
        parseFloat(score)
      );
      const validScores = scores.filter((score) => !isNaN(score));
      const totalScore = validScores.reduce((acc, score) => acc + score, 0);
      const count = validScores.length;

      if (count === 0) return;

      const averageScore = totalScore / count;

      if (!facultyAnalysis[facultyName]) {
        facultyAnalysis[facultyName] = {
          totalScore: 0,
          count: 0,
          totalQuestions: 0,
          courses: new Set(),
        };
      }

      facultyAnalysis[facultyName].totalScore += averageScore;
      facultyAnalysis[facultyName].count += 1;
      facultyAnalysis[facultyName].totalQuestions +=
        Object.keys(responsesObj).length;
      facultyAnalysis[facultyName].courses.add(courseName); // Add courseName to the set
    });

    // Calculate average score, percentage per faculty, and course count
    const result = Object.keys(facultyAnalysis).map((facultyName) => {
      const facultyData = facultyAnalysis[facultyName];
      const averageScore =
        facultyData.count > 0
          ? (facultyData.totalScore / facultyData.count).toFixed(2)
          : "0.00";
      const averagePercentage =
        facultyData.count > 0
          ? ((facultyData.totalScore / (facultyData.count * 4)) * 100).toFixed(
              2
            ) // Convert average score to percentage
          : "0.00"; // Default to '0.00' if no data available

      return {
        facultyName,
        studentCount: facultyData.count,
        courseCount: facultyData.courses.size, // Count the number of unique courses
        averageRating: averageScore,
        averagePercentage,
      };
    });

    res.json({ facultyData: result });
  } catch (error) {
    console.error("Error analyzing feedback by branch:", error);
    res
      .status(500)
      .json({ message: "Error analyzing feedback by branch", error });
  }
};
