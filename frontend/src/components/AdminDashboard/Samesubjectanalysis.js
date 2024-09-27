import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FeedbackPDFsame from "./pdf/pdfSamesubjectanalysis.js";
import styles from "./css/Samesubjectanalysis.module.css"; // Adjust the path as needed

const Samesubjectanalysis = () => {
  const [subjectName, setSubjectName] = useState("");
  const [type, setType] = useState("");
  const [analysisData, setAnalysisData] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [types, setTypes] = useState([]);
  const closePopup = () => {
    setMessage(null);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/feedback/feedbacks/subject-names"
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setMessage("Failed to load subjects.");
        setMessageType("error");
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/feedback/feedbacks/types"
        );
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching types:", error);
        setMessage("Failed to load types.");
        setMessageType("error");
      }
    };

    fetchSubjects();
    fetchTypes();
  }, []);

  const fetchAnalysis = async () => {
    try {
      if (!subjectName || !type) {
        setMessage("Please select both a subject and a type.");
        setMessageType("error");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/admin/by-same-subject",
        {
          params: { subjectName, type },
        }
      );

      if (response.data && response.data.length > 0) {
        setAnalysisData(response.data);
        setMessage("");
      } else {
        setAnalysisData([]);
        setMessage(
          "No analysis data available for the selected subject and type."
        );
        setMessageType("info");
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      setMessage("Failed to load analysis data.");
      setMessageType("error");
    }
  };

  const handleSubjectChange = (e) => {
    setSubjectName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSearch = () => {
    fetchAnalysis();
  };

  const getFeedbackRemark = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Satisfactory";
    
    return "Need Improvement";
  };

  const downloadPDF = () => {
    const input = document.getElementById("analysisTable");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("analysis-report.pdf");
    });
  };

  return (
    <div className={styles.samesubjectanalysisContainer}>
      <div className={styles.samesubjectanalysisCard}>
        <h2 className={styles.samesubjectanalysisTitle}>
          Same Subject Feedback Analysis
        </h2>
        <p className={styles.samesubjectanalysisDescription}>
          Select a subject and type to analyze feedback.
        </p>
        {message && (
          <div
            className={`${styles.samesubjectanalysisMessage} ${styles[messageType]}`}
          >
            {message}
          </div>
        )}
        {message && (
          <div className={styles["admin-Samesubjectanalysis-overlay"]}>
            <div className={styles["admin-Samesubjectanalysis-popup"]}>
              {/* Close icon */}
              <span
                className={styles["admin-Samesubjectanalysis-closeIcon"]}
                onClick={closePopup}
              >
                &times;
              </span>
              <div className={styles[messageType]}>{message}</div>

              {/* Close button */}
              <button
                className={styles["admin-Samesubjectanalysis-closeButton"]}
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className={styles.samesubjectanalysisInputContainer}>
          <select
            value={subjectName}
            onChange={handleSubjectChange}
            className={styles.samesubjectanalysisDropdown}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={handleTypeChange}
            className={styles.samesubjectanalysisDropdown}
          >
            <option value="">Select Type</option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className={styles.samesubjectanalysisButton}
          >
            Search
          </button>
        </div>
        {analysisData.length > 0 ? (
          <div className={styles.samesubjectanalysisTableWrapper}>
            <table
              id="analysisTable"
              className={styles.samesubjectanalysisTable}
            >
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Branch</th>

                  <th>Average Percentage</th>
                  <th>Feedback Remark</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.facultyName}</td>
                    <td>{data.branch}</td>

                    <td>
                      {data.averagePercentage !== "0.00"
                        ? `${data.averagePercentage}%`
                        : "0"}
                    </td>
                    <td>{getFeedbackRemark(data.averagePercentage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PDFDownloadLink
              document={<FeedbackPDFsame analysisData={analysisData} />}
              fileName="analysis-report.pdf"
            >
              {({ loading }) => (
                <button
                  style={{
                    backgroundColor: "#007bff", // Primary blue color
                    border: "none",
                    color: "#fff",
                    padding: "10px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  } // Darker blue on hover
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  } // Original blue
                >
                  {loading ? "Generating PDF..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        ) : (
          messageType !== "error" && (
            <p>No analysis data available for the selected subject and type.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Samesubjectanalysis;
