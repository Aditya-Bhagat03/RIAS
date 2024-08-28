import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReactToPrint from "react-to-print";
import styles from "./css/FacultyFeedback.module.css"; // Adjust the path as needed

// PDF Document Component
import FeedbackPDF from "./pdf/FeedbackPDF"; // Ensure this path is correct

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
    faculty: ""
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const componentRef = useRef();

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
          axios.get("http://localhost:4000/api/feedback/feedbacks/subject-names"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/course-names"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/faculty-names"),
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
      const { semester, branch, type, subject, course, faculty } = selectedFilters;
      const params = {
        semester,
        branch,
        type,
        subjectName: subject,
        courseName: course,
        facultyName: faculty
      };

      const feedbackResponse = await axios.get(
        "http://localhost:4000/api/feedback/feedbacks/filtered",
        { params }
      );

      const analysisResponse = await axios.get(
        "http://localhost:4000/api/feedback/feedbacks/analysis",
        { params }
      );

      setFeedbacks(feedbackResponse.data);
      setAnalysisData(analysisResponse.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    }
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
  };

  const allDropdownsSelected = () => {
    return Object.values(selectedFilters).every(value => value);
  };

  const convertAnalysisData = (data) => {
    if (!data) return { averageScore: 'N/A', goodFeedbackPercentage: 'N/A', badFeedbackPercentage: 'N/A', questionAverages: {} };

    const totalFeedbacks = data.totalFeedbacks || 0;
    const goodFeedbacks = data.goodFeedbacks || 0;
    const badFeedbacks = data.badFeedbacks || 0;

  return {
  averageScore: data.averageScore || 'N/A',
  goodFeedbackPercentage: totalFeedbacks > 0 
    ? ((goodFeedbacks / totalFeedbacks) * 100).toFixed(2) + '%' 
    : 'N/A',
  badFeedbackPercentage: totalFeedbacks > 0 
    ? ((badFeedbacks / totalFeedbacks) * 100).toFixed(2) + '%' 
    : 'N/A',
  questionAverages: data.questionAverages || {}
};

  };

  const formattedAnalysisData = convertAnalysisData(analysisData);

  return (
    <div style={{ marginTop: '70px', marginLeft: '70px' }} className={styles.container}>
      <div className={styles.feedbackCard} ref={componentRef}>
        <h2>Feedback Statistics</h2>
        <p>Filter and review feedback statistics based on various criteria.</p>
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
        <div className={styles.dropdownContainer}>
          {[
            { id: 'semester', label: 'Semester', options: semesters },
            { id: 'branch', label: 'Branch', options: branches },
            { id: 'type', label: 'Type', options: types },
            { id: 'subject', label: 'Subject', options: subjects },
            { id: 'course', label: 'Course', options: courses },
            { id: 'faculty', label: 'Faculty', options: faculties },
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
        {allDropdownsSelected() && (
          <button onClick={handleFilterApply} className={styles.filterButton}>
            Apply Filters
          </button>
        )}
        {feedbacks.length > 0 ? (
          <div>
            <div className={styles.feedbackTableWrapper}>
              <table className={styles.feedbackTable}>
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Average Rating</th>
                    <th>Good Feedback (%)</th>
                    <th>Bad Feedback (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{feedbacks.length > 0 ? feedbacks[0].facultyName : 'N/A'}</td>
                    <td>{formattedAnalysisData.averageScore || 'N/A'}</td>
                    <td>{formattedAnalysisData.goodFeedbackPercentage || 'N/A'}</td>
                    <td>{formattedAnalysisData.badFeedbackPercentage || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.questionTableWrapper}>
              <h3>Question Averages</h3>
              <table className={styles.questionTable}>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Average Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formattedAnalysisData.questionAverages).map(([question, avg], index) => (
                    <tr key={index}>
                      <td>{question}</td>
                      <td>{avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.pdfPrintButtons}>
              <PDFDownloadLink
                document={<FeedbackPDF feedbacks={feedbacks} analysisData={formattedAnalysisData} />}
                fileName="feedback-stats.pdf"
              >
                {({ loading }) => (
                  <button className={styles.pdfDownloadLink}>
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
              <ReactToPrint
                trigger={() => <button>Print</button>}
                content={() => componentRef.current}
              />
            </div>
          </div>
        ) : (
          <p>No feedback data available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackStats;