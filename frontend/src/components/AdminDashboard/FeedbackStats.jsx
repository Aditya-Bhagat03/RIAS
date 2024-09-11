import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FeedbackPDF from "./pdf/FeedbackPDF"; // Adjust the path as needed
import styles from "./css/FeedbackStats.module.css"; // Adjust the path as needed

const FeedbackStats = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [types, setTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    semester: sessionStorage.getItem('semester') || "",
    branch: "",
    type: "",
    subject: "",
    course: "",
    faculty: "",
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          semestersRes,
          branchesRes,
          typesRes,
          subjectsRes,
          coursesRes,
          facultiesRes,
        ] = await Promise.all([
          axios.get("http://localhost:4000/api/feedback/feedbacks/semesters"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/branches"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/types"),
          axios.get(
            "http://localhost:4000/api/feedback/feedbacks/subject-names"
          ),
          axios.get(
            "http://localhost:4000/api/feedback/feedbacks/course-names"
          ),
          axios.get(
            "http://localhost:4000/api/feedback/feedbacks/faculty-names"
          ),
        ]);

        setSemesters(semestersRes.data);
        setBranches(branchesRes.data);
        setTypes(typesRes.data);
        setSubjects(subjectsRes.data);
        setCourses(coursesRes.data);
        setFaculties(facultiesRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setMessage("Failed to load options.");
        setMessageType("error");
      }
    };

    fetchOptions();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { semester, branch, type, subject, course, faculty } =
        selectedFilters;
      const params = {
        semester,
        branch,
        type,
        subjectName: subject,
        courseName: course,
        facultyName: faculty,
      };

      const feedbackResponse = await axios.get(
        "http://localhost:4000/api/feedback/feedbacks/filtered",
        { params }
      );
      const analysisResponse = await axios.get(
        "http://localhost:4000/api/feedback/feedbacks/analysis",
        { params }
      );

      const transformedFeedbacks = transformFeedbackData(feedbackResponse.data);

      setFeedbacks(transformedFeedbacks);
      setAnalysisData(analysisResponse.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    }
  };

  const transformFeedbackData = (feedbacks) => {
    const aggregatedFeedback = {};

    feedbacks.forEach((feedback) => {
      const { facultyName, type, responses } = feedback;

      if (!aggregatedFeedback[facultyName]) {
        aggregatedFeedback[facultyName] = { practical: {}, theory: {} };
      }

      const feedbackType = type.toLowerCase();

      Object.entries(responses).forEach(([question, answer]) => {
        const cleanQuestion = question.replace(/^\d+_/, ''); // Remove the index prefix
        if (!aggregatedFeedback[facultyName][feedbackType][cleanQuestion]) {
          aggregatedFeedback[facultyName][feedbackType][cleanQuestion] = [];
        }
        aggregatedFeedback[facultyName][feedbackType][cleanQuestion].push(answer);
      });
    });

    return Object.keys(aggregatedFeedback).map((facultyName) => {
      const types = aggregatedFeedback[facultyName];
      const practicalAverages = calculateAverages(types.practical);
      const theoryAverages = calculateAverages(types.theory);
      const practicalFinalTotal = calculateFinalTotal(types.practical);
      const theoryFinalTotal = calculateFinalTotal(types.theory);

      const hasPracticalData = Object.keys(types.practical).length > 0;
      const hasTheoryData = Object.keys(types.theory).length > 0;

      const combinedFinalTotal = hasPracticalData && hasTheoryData
        ? ((parseFloat(practicalFinalTotal) + parseFloat(theoryFinalTotal)) / 2).toFixed(2)
        : hasPracticalData
          ? practicalFinalTotal
          : hasTheoryData
            ? theoryFinalTotal
            : "N/A";

      return [
     
        {
          facultyName,
          type: "practical",
          responses: practicalAverages,
          finalTotal: practicalFinalTotal,
          hasData: hasPracticalData,
          ttype: "Final",
          tfinalTotal: combinedFinalTotal,
          ptype: "Theory",
          pfinalTotal: theoryFinalTotal,
          
          
        },
        {
          facultyName,
          type: "theory",
          responses: theoryAverages,
          finalTotal: theoryFinalTotal,
          hasData: hasTheoryData,
          ttype: "Final",
          tfinalTotal: combinedFinalTotal,
          ptype: "Practical",
          pfinalTotal: practicalFinalTotal,
        }
      ];
    }).flat();
  };

  const calculateAverages = (responses) => {
    const averages = {};
    Object.entries(responses).forEach(([question, answers]) => {
      const total = answers.reduce((acc, val) => acc + val, 0);
      const average = total / answers.length;
      averages[question] = `${((average / 4) * 100).toFixed(2)}%`; // Assuming a scale of 1-5
    });

    return averages;
  };

  const calculateFinalTotal = (responses) => {
    const allScores = Object.values(responses).flat();
    const totalScore = allScores.reduce((acc, score) => acc + score, 0);
    const averageScore = totalScore / allScores.length;
    return ((averageScore / 4) * 100).toFixed(2); // Assuming a scale of 1-5
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
  };

  return (
    <div
      style={{ marginTop: "70px", marginLeft: "70px" }}
      className={styles.container}
    >
      <div className={`${styles.feedbackCard} ${styles.scrollableContainer}`}>
        <h2>Feedback Statistics</h2>
        <p>Filter and review feedback statistics based on various criteria.</p>
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
        <div className={styles.dropdownContainer}>
          {[
            { id: "semester", label: "Semester", options: semesters },
            { id: "branch", label: "Branch", options: branches },
            { id: "type", label: "Type", options: types },
            { id: "subject", label: "Subject", options: subjects },
            { id: "course", label: "Course", options: courses },
            { id: "faculty", label: "Faculty", options: faculties },
          ].map(({ id, label, options }) => (
            <div key={id} className={styles.dropdownItem}>
              <label htmlFor={id}>{label}:</label>
              <select
                id={id}
                value={selectedFilters[id] || ""}
                onChange={handleFilterChange}
              >
                <option value="">Select {label}</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
  <button onClick={handleFilterApply} className={styles.filterButton}>
    Apply Filters
  </button>
  <PDFDownloadLink
    document={<FeedbackPDF feedbacks={feedbacks} />}
    fileName="feedback_report.pdf"
  >
    {({ loading }) =>
      loading ? (
        <button className={styles.pdfButton} disabled>
          Generating PDF...
        </button>
      ) : (
        <button className={styles.pdfButton}>Download PDF</button>
      )
    }
  </PDFDownloadLink>
</div>

        {feedbacks.length > 0 ? (
          <>
            {feedbacks.map((feedback, feedbackIndex) => (
              <div key={feedbackIndex} className={styles.feedbackContainer}>
                {feedback.hasData && (
                  <>
                    <div className={styles.feedbackItem}>
                      <span className={styles.feedbackLabel}>
                        <b>Faculty Name: </b>
                      </span>
                      <span className={styles.feedbackValue}>
                        <b>{feedback.facultyName}</b>
                      </span>
                    </div>
                    <div className={styles.feedbackItem}>
                      <span   style={{ marginLeft: "60px" }} className={styles.feedbackLabel}>
                        <b>Type: </b>
                      </span>
                      <span className={styles.feedbackValue}>
                        <b>{feedback.type}</b>
                      </span>
                    </div>
                    <div className={styles.feedbackItem}>
                      <span  style={{ marginLeft: "60px" }} className={styles.feedbackLabel}>
                        <b>{feedback.type}:</b>
                      </span>
                      <span className={styles.feedbackValue}>
                        <b>{feedback.finalTotal}%</b>
                      </span>
                    </div>
                    <div className={styles.feedbackItem}>
                      <span  style={{ marginLeft: "60px" }} className={styles.feedbackLabel}>
                        <b>{feedback.ptype}:</b>
                      </span>
                      <span className={styles.feedbackValue}>
                        <b>{feedback.pfinalTotal}%</b>
                      </span>
                    </div>
                    <div className={styles.feedbackItem}>
                      <span  style={{ marginLeft: "60px" }} className={styles.feedbackLabel}>
                        <b>{feedback.ttype}:</b>
                      </span>
                      <span className={styles.feedbackValue}>
                        <b>{feedback.tfinalTotal}%</b>
                      </span>
                    </div>
                    {feedback.type === 'practical' && feedback.hasData && (
                      <div className={styles.feedbackTableWrapper}>
                        <h3 >Practical Feedback</h3>
                        <table className={styles.feedbackTable}>
                          <thead>
                            <tr>
                              <th className="questionColumn">Question</th>
                              <th className="scoreColumn">Average Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(feedback.responses).map(
                              ([question, avgScore], index) => (
                                <tr key={index}>
                                  <td>{question}</td>
                                  <td>{avgScore}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {feedback.type === 'theory' && feedback.hasData && (
                      <div className={styles.feedbackTableWrapper}>
                        <h3>Theory Feedback</h3>
                        <table className={styles.feedbackTable}>
                          <thead>
                            <tr>
                              <th className="questionColumn">Question</th>
                              <th className="scoreColumn">Average Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(feedback.responses).map(
                              ([question, avgScore], index) => (
                                <tr key={index}>
                                  <td>{question}</td>
                                  <td>{avgScore}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
           
          </>
        ) : (
          <p>No feedback data available.</p>
        )}
      </div>
     
    </div>

    
  );
};

export default FeedbackStats;