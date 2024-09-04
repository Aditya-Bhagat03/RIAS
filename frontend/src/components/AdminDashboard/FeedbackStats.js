import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FeedbackPDF from "./pdf/FeedbackPDF"; // Make sure this path is correct
import styles from "./css/FacultyFeedback.module.css"; // Adjust the path as needed

const FeedbackStats = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [types, setTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    semester: "",
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
          axios.get("https://rias-copy.vercel.app/api/feedback/feedbacks/semesters"),
          axios.get("https://rias-copy.vercel.app/api/feedback/feedbacks/branches"),
          axios.get("/api/feedback/feedbacks/types"),
          axios.get(
            "https://rias-copy.vercel.app/api/feedback/feedbacks/subject-names"
          ),
          axios.get(
            "https://rias-copy.vercel.app/api/feedback/feedbacks/course-names"
          ),
          axios.get(
            "https://rias-copy.vercel.app/api/feedback/feedbacks/faculty-names"
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
        "https://rias-copy.vercel.app/api/feedback/feedbacks/filtered",
        { params }
      );
      const analysisResponse = await axios.get(
        "https://rias-copy.vercel.app/api/feedback/feedbacks/analysis",
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
        if (!aggregatedFeedback[facultyName][feedbackType][question]) {
          aggregatedFeedback[facultyName][feedbackType][question] = [];
        }
        aggregatedFeedback[facultyName][feedbackType][question].push(answer);
      });
    });

    return Object.keys(aggregatedFeedback)
      .map((facultyName) => {
        const types = aggregatedFeedback[facultyName];
        return [
          {
            facultyName,
            type: "practical",
            responses: calculateAverages(types.practical),
          },
          {
            facultyName,
            type: "theory",
            responses: calculateAverages(types.theory),
          },
        ];
      })
      .flat();
  };

  const calculateAverages = (responses) => {
    const averages = {};
    const totalCount = Object.keys(responses).length;

    Object.entries(responses).forEach(([question, answers]) => {
      const total = answers.reduce((acc, val) => acc + val, 0);
      const average = total / answers.length;
      averages[question] = `${Math.round((average / 4) * 100)}%`; // Assuming scale of 1-5
    });

    return averages;
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
        <button onClick={handleFilterApply} className={styles.filterButton}>
          Apply Filters
        </button>
        {feedbacks.length > 0 ? (
          <>
            <div className={styles.pdfButtonContainer}>
              <PDFDownloadLink
                document={<FeedbackPDF feedbacks={feedbacks} />}
                fileName="FeedbackReport.pdf"
                className={styles.pdfButton}
              >
                {({ loading }) =>
                  loading ? "Generating PDF..." : "Download PDF"
                }
              </PDFDownloadLink>
            </div>
            {feedbacks.map((feedback, feedbackIndex) => (
              <div key={feedbackIndex} className={styles.feedbackContainer}>
                <div className={styles.feedbackContainer}>
                  <div className={styles.feedbackItem}>
                    <span className={styles.feedbackLabel}>Faculty Name:</span>
                    <span className={styles.feedbackValue}>
                      {feedback.facultyName}
                    </span>
                  </div>
                  <div className={styles.feedbackItem}>
                    <span
                      style={{ marginLeft: "20px" }}
                      className={styles.feedbackLabel}
                    >
                      Type:
                    </span>
                    <span className={styles.feedbackValue}>
                      {feedback.type}
                    </span>
                  </div>
                </div>

                <div className={styles.feedbackTableWrapper}>
                  <table className={styles.feedbackTable}>
                    <thead>
                      <tr>
                        <th className="questionColumn">Question</th>
                        <th className="scoreColumn">Average Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(feedback.responses).map(
                        ([question, percentage], index) => (
                          <tr key={index}>
                            <td className="questionColumn">{question}</td>
                            <td className="scoreColumn">{percentage}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No feedback available for the selected criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackStats;
