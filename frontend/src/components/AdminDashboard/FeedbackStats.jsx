import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/FeedbackStats.module.css"; // Adjust the path as needed
import FeedbackPDF from "./pdf/FeedbackPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const FeedbackStats = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [types, setTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [showPDFLink, setShowPDFLink] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    semester: sessionStorage.getItem('semester') || "",
    branch: "",
    type: "",
    subject: "",
    course: "",
    faculty: "",
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [aggregatedData, setAggregatedData] = useState({
    theory: [],
    practical: []
  });
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
      const { semester, branch, type, subject, course, faculty, } = selectedFilters;
      const params = {
        semester,
        branch,
        type,
        subjectName: subject,
        courseName: course,
        facultyName: faculty,
      };

      const feedbackResponse = await axios.get("http://localhost:4000/api/feedback/feedbacks/filtered", { params });

      setFeedbacks(feedbackResponse.data);
      aggregateFeedbacks(feedbackResponse.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    }
  };
  // Define other functions
  const cleanQuestion = (question) => {
    return question.replace(/^\d+_/, ''); // Remove the index prefix
  };

  const calculatePercentage = (score, total = 4) => {
    if (total === 0) return "N/A"; // Handle division by zero
    return ((score / total) * 100).toFixed(0) + "%";
  };

  const calculateAverage = (totalScore, count) => {
    if (count === 0) return "N/A"; // Handle zero count
    return calculatePercentage(totalScore / count);
  };

  const aggregateFeedbacks = (feedbacks) => {
    if (!Array.isArray(feedbacks)) {
      console.error('Expected feedbacks to be an array.');
      return; // Consider returning an empty object or a default value
    }

    const aggregated = {
      theory: {},
      practical: {}
    };

    feedbacks.forEach((feedback) => {
      const { facultyName, subjectName, courseCode, type, time, responses } = feedback;
      const category = type === 'theory' ? 'theory' : 'practical';

      if (!aggregated[category][facultyName]) {
        aggregated[category][facultyName] = {
          subjects: new Set(),
          courseCodes: new Set(),
          times: new Set(), // Changed from 'time' to 'times'
          responses: {},
          totalScore: 0,
          count: 0
        };
      }

      aggregated[category][facultyName].subjects.add(subjectName);
      aggregated[category][facultyName].courseCodes.add(courseCode);
      aggregated[category][facultyName].times.add(time); // Add time

      Object.entries(responses).forEach(([question, score]) => {
        const cleanQuestionText = cleanQuestion(question);
        if (!aggregated[category][facultyName].responses[cleanQuestionText]) {
          aggregated[category][facultyName].responses[cleanQuestionText] = {};
        }
        if (!aggregated[category][facultyName].responses[cleanQuestionText][subjectName]) {
          aggregated[category][facultyName].responses[cleanQuestionText][subjectName] = [];
        }
        aggregated[category][facultyName].responses[cleanQuestionText][subjectName].push(score);

        // Update totalScore and count
        const subjectScores = aggregated[category][facultyName].responses[cleanQuestionText][subjectName];
        aggregated[category][facultyName].totalScore += subjectScores.reduce((sum, s) => sum + s, 0);
        aggregated[category][facultyName].count += subjectScores.length;
      });
    });

    const result = {
      theory: Object.keys(aggregated.theory).map((facultyName) => {
        const facultyData = aggregated.theory[facultyName];
        const subjectNames = Array.from(facultyData.subjects);

        const averageResponses = {};
        Object.entries(facultyData.responses).forEach(([question, subjectScores]) => {
          averageResponses[question] = subjectNames.map((subject) => {
            const scores = subjectScores[subject] || [];
            const total = scores.reduce((sum, score) => sum + score, 0);
            const average = scores.length ? calculatePercentage(total / scores.length) : "N/A";
            return average;
          });
        });

        const theoryAverage = calculateAverage(facultyData.totalScore, facultyData.count);

        return {
          facultyName,
          subjectNames,
          times: Array.from(facultyData.times), // Added times
          courseCodes: Array.from(facultyData.courseCodes),
          responses: averageResponses,
          theoryAverage
        };
      }),
      practical: Object.keys(aggregated.practical).map((facultyName) => {
        const facultyData = aggregated.practical[facultyName];
        const subjectNames = Array.from(facultyData.subjects);

        const averageResponses = {};
        Object.entries(facultyData.responses).forEach(([question, subjectScores]) => {
          averageResponses[question] = subjectNames.map((subject) => {
            const scores = subjectScores[subject] || [];
            const total = scores.reduce((sum, score) => sum + score, 0);
            const average = scores.length ? calculatePercentage(total / scores.length) : "N/A";
            return average;
          });
        });

        const practicalAverage = calculateAverage(facultyData.totalScore, facultyData.count);

        return {
          facultyName,
          subjectNames,
          courseCodes: Array.from(facultyData.courseCodes),
          times: Array.from(facultyData.times), // Added times
          responses: averageResponses,
          practicalAverage
        };
      })
    };

    setAggregatedData({ ...result });
  };


  // Function to parse percentage from a string
  const parsePercentage = (percentageString) => {
    if (percentageString === "N/A") return NaN;
    return parseFloat(percentageString.replace('%', ''));
  };

  // Rest of your component code



  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    setSelectedFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
    setShowPDFLink(true);
  };

  const groupedFeedbackData = () => {
    const groupedData = {};

    // Process theory feedback
    aggregatedData.theory.forEach(item => {
      if (!groupedData[item.facultyName]) {
        groupedData[item.facultyName] = { theory: item, practical: [], overallAverage: "N/A" };
      } else {
        groupedData[item.facultyName].theory = item;
      }
    });

    // Process practical feedback
    aggregatedData.practical.forEach(item => {
      if (groupedData[item.facultyName]) {
        groupedData[item.facultyName].practical.push(item);
      } else {
        groupedData[item.facultyName] = { theory: null, practical: [item], overallAverage: "N/A" };
      }
    });

    // Calculate overall average
    Object.keys(groupedData).forEach(facultyName => {
      const data = groupedData[facultyName];
      const theoryAverage = data.theory ? parsePercentage(data.theory.theoryAverage) : NaN;
      const practicalAverages = data.practical.map(p => parsePercentage(p.practicalAverage));
      const practicalAverage = practicalAverages.length ? practicalAverages.reduce((sum, avg) => sum + avg, 0) / practicalAverages.length : NaN;

      if (isNaN(theoryAverage) && isNaN(practicalAverage)) {
        groupedData[facultyName].overallAverage = "N/A";
      } else if (isNaN(theoryAverage)) {
        groupedData[facultyName].overallAverage = calculatePercentage(practicalAverage);
      } else if (isNaN(practicalAverage)) {
        groupedData[facultyName].overallAverage = data.theory.theoryAverage;
      } else {
        groupedData[facultyName].overallAverage = calculatePercentage((theoryAverage + practicalAverage) / 50);
      }
    });

    return groupedData;
  };







  return (
    <div className={styles.container}>
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


          {showPDFLink && (
            <div className={styles.pdfLinkContainer}>
              <PDFDownloadLink
                document={<FeedbackPDF data={aggregatedData} />}
                fileName="FeedbackStatistics.pdf"
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
          )}




        </div>

        <div className={styles.resultsContainer}>
          {feedbacks.length > 0 ? (
            Object.keys(groupedFeedbackData()).map((facultyName) => {
              const data = groupedFeedbackData()[facultyName];


              return (
                <div key={facultyName} className={styles.questioncard}>



                  {data.theory && (
                    <div className={styles.feedbackSection}>
                      <div> 
                        <h3 style={{ display: 'inline', marginRight: '250px' }}  >Theory Feedback</h3>
                        <h3 style={{ display: 'inline', marginRight: '80px' }}  >Faculty: {facultyName}</h3></div>
                      


                      <div style={{ marginTop: '20px' }}>
                      <h5 style={{ display: 'inline', marginRight: '80px' }}  >Theory Subject: {data.theory.subjectNames.join(", ")}</h5>
                        {data.theory.theoryAverage && (
                          <p style={{ display: 'inline', marginRight: '80px' }}>
                            <strong>Theory Average:</strong> {data.theory.theoryAverage}
                          </p>
                        )}


                        {data.overallAverage && (
                          <p style={{ display: 'inline' }}>
                            <strong>Final Average:</strong> {data.overallAverage}
                          </p>
                        )}
                      </div>





                      <div className={styles.feedbackTable}>
                        <table className={styles.feedbackTable}>
                          <thead>
                            <tr>
                              <th>Question</th>
                              {data.theory.subjectNames.map((subject, index) => (
                                <th key={index}>{subject}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(data.theory.responses).map(([question, responses]) => (
                              <tr key={question}>
                                <td>{question}</td>
                                {responses.map((response, index) => (
                                  <td key={index}>{response}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {data.practical.length > 0 && (
                    <div className={styles.feedbackSection} >
                      



                      {data.practical.map((practicalFeedback, index) => (
                        <div key={index} className={styles.feedbackTable}>
                          <div style={{ marginTop: '80px' }} >
                          <h3 style={{ display: 'inline', marginRight: '110px' }}>Practical Feedback</h3>
                            <h4 style={{ display: 'inline', marginRight: '80px' }} >Practical Subjects:  <span></span> {practicalFeedback.subjectNames.join(", ")}</h4>
                            {/* Display Practical Average */}
                            {data.practical[0].practicalAverage && (
                              <p style={{ display: 'inline', marginRight: '80px' }} ><strong>Practical Average:</strong> {data.practical[0].practicalAverage}</p>
                            )}</div>

                          <table className={styles.feedbackTable}>
                            <thead>
                              <tr>
                                <th>Question</th>
                                {practicalFeedback.subjectNames.map((subject, index) => (
                                  <th key={index}>{subject}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(practicalFeedback.responses).map(([question, responses]) => (
                                <tr key={question}>
                                  <td>{question}</td>
                                  {responses.map((response, index) => (
                                    <td key={index}>{response}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No feedback data available for the selected filters.</p>
          )}

          {/* PDF Download Link */}

        </div>

      </div>

    </div>
  );
};

export default FeedbackStats;
