
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
            ? (facultyData.totalScore / facultyData.count).toPrecision(10)
            : "0.0000"; // Use .toPrecision(4) to maintain four decimal places
        const averagePercentage =
          facultyData.count > 0
            ? (((facultyData.totalScore / (facultyData.count * 4)) * 100).toPrecision(4))
            : "0.0000"; // Use .toPrecision(4) to maintain four decimal places
  
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
  