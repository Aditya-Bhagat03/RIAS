import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/FacultyFeedback.module.css";

const FacultyFeedback = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [semestersRes, branchesRes, sectionsRes, subjectsRes, coursesRes, facultiesRes] = await Promise.all([
          axios.get("http://localhost:4000/api/feedback/feedbacks/semesters"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/branches"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/sections"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/subject-names"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/course-names"),
          axios.get("http://localhost:4000/api/feedback/feedbacks/faculty-names"),
        ]);

        setSemesters(semestersRes.data);
        setBranches(branchesRes.data);
        setSections(sectionsRes.data);
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
      const params = {
        semester: selectedSemester,
        branch: selectedBranch,
        section: selectedSection,
        subjectName: selectedSubject,
        courseName: selectedCourse,
        facultyName: selectedFaculty,
      };

      const response = await axios.get("http://localhost:4000/api/feedback/feedbacks/filtered", { params });
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    }
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await axios.delete(`http://localhost:4000/api/feedback/feedbacks/${feedbackId}`);
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
      setMessage("Feedback deleted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setMessage("Failed to delete feedback.");
      setMessageType("error");
    }
  };

  return (
    <div style={{ marginTop: '70px', marginLeft: '70px'  }} className={styles.container}>
      <div className={styles.feedbackCard}>
        <h2>Faculty Feedback</h2>
        <p>Here you can review feedback provided by student.</p>
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
        <div className={styles.dropdownContainer}>
          <div className={styles.dropdownItem}>
            <label htmlFor="semester">Semester:</label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semesters.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.dropdownItem}>
            <label htmlFor="branch">Branch:</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.dropdownItem}>
            <label htmlFor="section">Section:</label>
            <select
              id="section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {sections.map((section, index) => (
                <option key={index} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.dropdownItem}>
            <label htmlFor="subject">Subject:</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.dropdownItem}>
            <label htmlFor="course">Course:</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.dropdownItem}>
            <label htmlFor="faculty">Faculty:</label>
            <select
              id="faculty"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">Select Faculty</option>
              {faculties.map((faculty, index) => (
                <option key={index} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleFilterApply} className={styles.filterButton}>Apply Filters</button>
        {feedbacks.length > 0 && (
          <table className={styles.feedbackTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Faculty Name</th>
                <th>Course Name</th>
                <th>Branch</th>
                <th>Section</th>
                <th>Semester</th>
                <th>Subject Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.studentId?.username || 'N/A'}</td>
                  <td>{feedback.facultyName || 'N/A'}</td>
                  <td>{feedback.courseName || 'N/A'}</td>
                  <td>{feedback.branch || 'N/A'}</td>
                  <td>{feedback.section || 'N/A'}</td>
                  <td>{feedback.semester || 'N/A'}</td>
                  <td>{feedback.subjectName || 'N/A'}</td>
                  <td>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteFeedback(feedback.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyFeedback;
