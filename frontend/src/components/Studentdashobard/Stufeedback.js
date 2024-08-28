import React, { useState, useEffect } from "react";
import "./CSS/Stufeedback.css";

const theoryQuestions = [
  // Add your theory questions here
  "Lecture preparation, organization and course material (structure)",
  "Board writing, organization and use of audio-visual aids used",
  "Lecture delivered with emphasis on fundamental concepts and with illustrative examples and faculty has command over the subject",
  "Difficult topics were taught with adequate attention and ease",
  "The teacher is enthusiastic about teaching and able to deliver lecture with good communication skills",
  "Encouraged to ask questions to make lecture interactive and lively",
  "The TAE Parameters and tests were challenging (with new and novel problem-solving approach)",
  "TAE & CAE marks were displayed regularly",
  "CAE question paper was discussed in the class after exam and answer sheets were shown",
  "The evaluations were fair and impartial and it helps to improve students",
];

const practicalQuestions = [
  "Practical sessions were well-organized and conducted in a structured manner",
  "The equipment and resources used in practical sessions were appropriate and in good condition",
  "The practical sessions included relevant and practical exercises that enhanced understanding",
  "The instructor provided clear instructions and guidance during practical sessions",
  "The practical tasks and problems were challenging and contributed to skill development",
  "Feedback on practical work was provided in a timely and constructive manner",
  "The practical sessions encouraged active participation and problem-solving",
  "The evaluation criteria for practical work were clear and fair",
  "Adequate time was given for practical tasks and exercises",
  "The practical sessions were integrated well with the theoretical concepts taught",
];
const FeedbackForm = () => {
  const [profileData, setProfileData] = useState(null);
  const [theoryTimetableData, setTheoryTimetableData] = useState([]);
  const [filteredTheoryTimetable, setFilteredTheoryTimetable] = useState([]);
  const [practicalTimetableData, setPracticalTimetableData] = useState([]);
  const [filteredPracticalTimetable, setFilteredPracticalTimetable] = useState(
    []
  );
  const [responses, setResponses] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

      const response = await fetch(
        `http://localhost:4000/api/users/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Error fetching profile data. Please try again later.");
    }
  };

  // Fetch timetable data
  const fetchTimetableData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:4000/api/timetables", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTheoryTimetableData(data.filter((item) => item.type === "Theory"));
        setPracticalTimetableData(
          data.filter((item) => item.type === "Practical")
        );
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      setError("Error fetching timetable data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchTimetableData();
  }, []);

  useEffect(() => {
    if (profileData) {
      const filterData = (timetable) => {
        return timetable.filter(
          (item) =>
            item.branch === profileData.branch &&
            item.section === profileData.section &&
            item.semester === profileData.semester &&
            (!profileData.batch ||
              item.batch === "" ||
              item.batch === "Not Required" ||
              item.batch === profileData.batch)
        );
      };

      setFilteredTheoryTimetable(filterData(theoryTimetableData));
      setFilteredPracticalTimetable(filterData(practicalTimetableData));
    }
  }, [profileData, theoryTimetableData, practicalTimetableData]);

  const handleChange = (event, questionIndex, timetableIndex, type) => {
    const { value } = event.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [`${type}_${timetableIndex}_${questionIndex}`]: parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const studentId = decodedToken.id;

      // Function to generate feedback entries
      const generateFeedbackEntries = (filteredTimetable, questions, type) => {
        return filteredTimetable.map((item, timetableIndex) => ({
          facultyName: item.facultyName,
          courseName: item.subjectName,
          branch: item.branch,
          section: item.section,
          semester: item.semester,
          batch: item.batch,
          subjectName: item.subjectName,
          courseCode: item.courseCode,
          responses: questions.reduce(
            (acc, question, questionIndex) => ({
              ...acc,
              [`${timetableIndex}_${question}`]:
                responses[`${type}_${timetableIndex}_${questionIndex}`] || 0,
            }),
            {}
          ),
        }));
      };

      // Generate entries for both theory and practical
      const theoryFeedbackEntries = generateFeedbackEntries(
        filteredTheoryTimetable,
        theoryQuestions,
        "theory"
      );

      const practicalFeedbackEntries = generateFeedbackEntries(
        filteredPracticalTimetable,
        practicalQuestions,
        "practical"
      );

      // Submit both feedbacks in parallel
      await Promise.all([
        fetch("http://localhost:4000/api/feedback/theory/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            feedbackEntries: theoryFeedbackEntries,
          }),
        }),
        fetch("http://localhost:4000/api/feedback/practical/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            feedbackEntries: practicalFeedbackEntries,
          }),
        }),
      ]);

      setSuccess("Theory and Practical feedback submitted successfully!");
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Error submitting feedback. Please try again.");
      setSuccess("");
    }
  };

  const styles = {
    th: { padding: "10px", border: "1px solid #ddd" },
    td: { padding: "10px", border: "1px solid #ddd" },
    select: { width: "100px" },
  };
  return (
    <div style={{ height: "690px" }} className="student-dashboard-feedback-card">
      {success && <p className="student-dashboard-success-message">{success}</p>}
      <div className="student-dashboard-feedback-content">
        <h2 className="student-dashboard-feedback-title">
          RIAS Feedback Form
        </h2>
        {error && <p className="student-dashboard-error-message">{error}</p>}
        {profileData && (
          <div className="student-dashboard-profile-info">
            <p>
              <strong>Student Name:</strong> {profileData.username}
            </p>
            <p>
              <strong>Branch:</strong> {profileData.branch}
            </p>
            <p>
              <strong>Section:</strong> {profileData.section}
            </p>
            <p>
              <strong>Semester:</strong> {profileData.semester}
            </p>
            <p>
              <strong>Registration Number:</strong>{" "}
              {profileData.registrationNumber}
            </p>
          </div>
        )}
        {filteredTheoryTimetable.length > 0 && (
          <>
            <h4 className="student-dashboard-timetable-title">Theory Timetable</h4>
            <table className="student-dashboard-timetable-table">
              <thead>
                <tr>
                  <th className="student-dashboard-timetable-th">S.N.</th>
                  <th className="student-dashboard-timetable-th">Subject</th>
                  <th className="student-dashboard-timetable-th">Faculty</th>
                  <th className="student-dashboard-timetable-th">Type</th>
                  <th className="student-dashboard-timetable-th">Course Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredTheoryTimetable.map((item, index) => (
                  <tr key={item._id}>
                    <td className="student-dashboard-timetable-td">{index + 1}</td>
                    <td className="student-dashboard-timetable-td">{item.subjectName}</td>
                    <td className="student-dashboard-timetable-td">{item.facultyName}</td>
                    <td className="student-dashboard-timetable-td">{item.type}</td>
                    <td className="student-dashboard-timetable-td">{item.courseCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="student-dashboard-feedback-form-title">
              Theory Feedback Form
            </h2>
            <form onSubmit={(e) => handleSubmit(e, "theory")}>
              <table className="student-dashboard-feedback-table">
                <thead>
                  <tr>
                    <th className="student-dashboard-feedback-th">S.N.</th>
                    <th className="student-dashboard-feedback-th">Theory Factors</th>
                    {filteredTheoryTimetable.map((item, index) => (
                      <th key={item._id} className="student-dashboard-feedback-th">
                        {item.subjectName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {theoryQuestions.map((question, questionIndex) => (
                    <tr key={questionIndex}>
                      <td className="student-dashboard-feedback-td">{questionIndex + 1}</td>
                      <td className="student-dashboard-feedback-question">{question}</td>
                      {filteredTheoryTimetable.map((item, timetableIndex) => (
                        <td
                          key={`${timetableIndex}_${questionIndex}`}
                          className="student-dashboard-feedback-td"
                        >
                          <select
                            value={
                              responses[
                                `theory_${timetableIndex}_${questionIndex}`
                              ] !== undefined
                                ? responses[
                                    `theory_${timetableIndex}_${questionIndex}`
                                  ]
                                : ""
                            }
                            onChange={(event) =>
                              handleChange(
                                event,
                                questionIndex,
                                timetableIndex,
                                "theory"
                              )
                            }
                            className="student-dashboard-feedback-select"
                          >
                            <option value="">Select</option>
                            {[0, 1, 2, 3, 4].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>
            {success && <p className="student-dashboard-success-message">{success}</p>}
          </>
        )}
        {filteredPracticalTimetable.length > 0 && (
          <>
            <h2 className="student-dashboard-timetable-title">Practical Timetable</h2>
            <table className="student-dashboard-timetable-table">
              <thead>
                <tr>
                  <th className="student-dashboard-timetable-th">S.N.</th>
                  <th className="student-dashboard-timetable-th">Subject</th>
                  <th className="student-dashboard-timetable-th">Faculty</th>
                  <th className="student-dashboard-timetable-th">Type</th>
                  <th className="student-dashboard-timetable-th">Course Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredPracticalTimetable.map((item, index) => (
                  <tr key={item._id}>
                    <td className="student-dashboard-timetable-td">{index + 1}</td>
                    <td className="student-dashboard-timetable-td">{item.subjectName}</td>
                    <td className="student-dashboard-timetable-td">{item.facultyName}</td>
                    <td className="student-dashboard-timetable-td">{item.type}</td>
                    <td className="student-dashboard-timetable-td">{item.courseCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="student-dashboard-feedback-form-title">
              Practical Feedback Form
            </h2>
            <form onSubmit={(e) => handleSubmit(e, "practical")}>
              <table className="student-dashboard-feedback-table">
                <thead>
                  <tr>
                    <th className="student-dashboard-feedback-th">S.N.</th>
                    <th className="student-dashboard-feedback-th">Practical Factors</th>
                    {filteredPracticalTimetable.map((item, index) => (
                      <th key={item._id} className="student-dashboard-feedback-th">
                        {item.subjectName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {practicalQuestions.map((question, questionIndex) => (
                    <tr key={questionIndex}>
                      <td className="student-dashboard-feedback-td">{questionIndex + 1}</td>
                      <td className="student-dashboard-feedback-question">{question}</td>
                      {filteredPracticalTimetable.map(
                        (item, timetableIndex) => (
                          <td
                            key={`${timetableIndex}_${questionIndex}`}
                            className="student-dashboard-feedback-td"
                          >
                            <select
                              value={
                                responses[
                                  `practical_${timetableIndex}_${questionIndex}`
                                ] !== undefined
                                  ? responses[
                                      `practical_${timetableIndex}_${questionIndex}`
                                    ]
                                  : ""
                              }
                              onChange={(event) =>
                                handleChange(
                                  event,
                                  questionIndex,
                                  timetableIndex,
                                  "practical"
                                )
                              }
                              className="student-dashboard-feedback-select"
                            >
                              <option value="">Select</option>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {success && <p className="student-dashboard-success-message">{success}</p>}
            </form>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="student-dashboard-submit-button"
          >
            Submit Feedback
          </button>
          {error && <p className="student-dashboard-error-message">{error}</p>}
          {success && <p className="student-dashboard-success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
  
  
};

export default FeedbackForm;
