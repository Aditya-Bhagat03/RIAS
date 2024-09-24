import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/FacultyPostTimetable.css"; // Import the updated CSS file

const FacultyPostTimetable = () => {
  // State for the timetable posting form
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batch, setBatch] = useState("");
  const [sections, setSections] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [facultyNames, setFacultyNames] = useState([]);
  const [subjectNames, setSubjectNames] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [filteredFacultyNames, setFilteredFacultyNames] = useState([]);
  const [filteredSubjectNames, setFilteredSubjectNames] = useState([]);
  const [facultySuggestions, setFacultySuggestions] = useState([]);
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [courseCodeSuggestions, setCourseCodeSuggestions] = useState([]);
  const [showFacultySuggestions, setShowFacultySuggestions] = useState(false);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const [showCourseCodeSuggestions, setShowCourseCodeSuggestions] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [session, setSession] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  // State for the timetables
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [error, setError] = useState("");

  // Handle faculty name change
  const handleFacultyNameChange = (e) => {
    const value = e.target.value;
    setFacultyName(value);

    if (value) {
      const filteredSuggestions = facultyNames.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFacultySuggestions(filteredSuggestions);
      setShowFacultySuggestions(true);
    } else {
      setFacultySuggestions([]);
      setShowFacultySuggestions(false);
    }
  };

  // Handle subject name change
  const handleSubjectNameChange = (e) => {
    const value = e.target.value;
    setSubjectName(value);

    if (value) {
      const filteredSuggestions = subjectNames.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSubjectSuggestions(filteredSuggestions);
      setShowSubjectSuggestions(true);
    } else {
      setSubjectSuggestions([]);
      setShowSubjectSuggestions(false);
    }
  };

  // Handle course code change
  const handleCourseCodeChange = (e) => {
    const value = e.target.value;
    setCourseCode(value);

    if (value) {
      const filteredSuggestions = courseCodes.filter((code) =>
        code.toLowerCase().includes(value.toLowerCase())
      );
      setCourseCodeSuggestions(filteredSuggestions);
      setShowCourseCodeSuggestions(true);
    } else {
      setCourseCodeSuggestions([]);
      setShowCourseCodeSuggestions(false);
    }
  };

  // Handle suggestion click for faculty name
  const handleFacultySuggestionClick = (name) => {
    setFacultyName(name);
    setFacultySuggestions([]);
    setShowFacultySuggestions(false);
  };

  // Handle suggestion click for subject name
  const handleSubjectSuggestionClick = (name) => {
    setSubjectName(name);
    setSubjectSuggestions([]);
    setShowSubjectSuggestions(false);
  };

  // Handle suggestion click for course code
  const handleCourseCodeSuggestionClick = (code) => {
    setCourseCode(code);
    setCourseCodeSuggestions([]);
    setShowCourseCodeSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".autocomplete-dropdown")) {
        setShowFacultySuggestions(false);
        setShowSubjectSuggestions(false);
        setShowCourseCodeSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch options for the form
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          semestersRes,
          branchesRes,
          sectionsRes,
          facultynameRes,
          academicYearsRes,
          sessionRes,
          subjectName,
          coursecode,
        ] = await Promise.all([
          axios.get("http://localhost:4000/api/semesters"),
          axios.get("http://localhost:4000/api/branches"),
          axios.get("http://localhost:4000/api/sections"),
          axios.get("http://localhost:4000/api/facultyregister/facultyname"),
          axios.get("http://localhost:4000/api/users/academic-years"),
          axios.get("http://localhost:4000/api/users/session"),
          axios.get("http://localhost:4000/api/facultyregister/subjects"),
          axios.get("http://localhost:4000/api/facultyregister/coursecodes"),
        ]);

        setSemesters(semestersRes.data);
        setBranches(branchesRes.data);
        setSections(sectionsRes.data);
        setFacultyNames(facultynameRes.data);
        setSubjectNames(subjectName.data);
        setCourseCodes(coursecode.data);
        setAcademicYears(academicYearsRes.data);
        setSession(sessionRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setMessage("Failed to load options.");
        setMessageType("error");
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    setFilteredFacultyNames(
      facultyNames.filter((name) =>
        name.toLowerCase().includes(facultyName.toLowerCase())
      )
    );
  }, [facultyName, facultyNames]);

  useEffect(() => {
    // Function to fetch timetables
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/timetables"
        );
        setTimetables(response.data);
        setFilteredTimetables(response.data);
      } catch (error) {
        console.error("Error fetching timetables:", error);
        setError("Failed to load timetables.");
      }
    };

    // Fetch timetables every second
    const intervalId = setInterval(fetchTimetables, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = timetables.filter((timetable) => {
      return (
        (!semester || timetable.semester === semester) &&
        (!branch || timetable.branch === branch) &&
        (!section || timetable.section === section)
      );
    });
    setFilteredTimetables(filtered);
  }, [semester, branch, section, timetables]);

  // Handle timetable form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const timetableData = {
        facultyName,
        subjectName,
        courseCode,
        branch,
        section,
        semester,
        type,
        time,
        room,
        batch,
        academicYear: selectedAcademicYear,
        session: selectedSession,
        createdBy: localStorage.getItem("userId"),
      };

      await axios.post("http://localhost:4000/api/timetables", timetableData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("Timetable posted successfully");
      setMessageType("success");

      // Clear form fields
      setFacultyName("");
      setSubjectName("");
      setCourseCode("");
      setBranch("");
      setSection("");
      setSemester("");
      setType("");
      setTime("");
      setRoom("");
      setBatch("");
      setSelectedAcademicYear("");
      setSelectedSession("");
    } catch (error) {
      console.error("Error posting timetable:", error);

      // Provide more specific error messaging
      if (error.response && error.response.data) {
        setMessage(`Failed to post timetable: ${error.response.data.message}`);
      } else {
        setMessage("Failed to post timetable. Please try again.");
      }
      setMessageType("error");
    }
  };

  return (
    <div className="faculty-post-timetable-container">
      <form onSubmit={handleSubmit} className="faculty-post-timetable-form">
        <div className="form-grid">
          <div className="form-item row1">
            <label>Academic Year:</label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              required
            >
              
              <option value="">Select Academic</option>
              <option value="2025">2025</option>
              <option value="2025">2026</option>
              <option value="2025">2027</option>
              <option value="2025">2028</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
                
              ))}
            </select>
          </div>
          <div className="form-item row1">
            <label>Session:</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              required
            >
              <option value="">Select Session</option>
              {session.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="form-item row1">
            <label>Branch:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item row2">
            <label>Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item row2">
            <label>Section:</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item row2">
            <label>Batch:</label>
            <select value={batch} onChange={(e) => setBatch(e.target.value)}>
              <option value="" disabled>
                Select Batch
              </option>
              <option value="Not Required">Not Required</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-item row2">
            <label>Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Practical">Practical</option>
              <option value="Theory">Theory</option>
            </select>
          </div>

          <div className="form-item row2">
            <label>Subject Name:</label>
            <input
              type="text"
              value={subjectName}
              onChange={handleSubjectNameChange}
              required
            />
            {showSubjectSuggestions && (
              <ul className="autocomplete-dropdown">
                {subjectSuggestions.length ? (
                  subjectSuggestions.map((name, index) => (
                    <li key={index} onClick={() => handleSubjectSuggestionClick(name)}>
                      {name}
                    </li>
                  ))
                ) : (
                  <li>No suggestions</li>
                )}
              </ul>
            )}
          </div>

          <div className="form-item row2">
            <label>Course Code:</label>
            <input
              type="text"
              value={courseCode}
              onChange={handleCourseCodeChange}
              required
            />
            {showCourseCodeSuggestions && (
              <ul className="autocomplete-dropdown">
                {courseCodeSuggestions.length ? (
                  courseCodeSuggestions.map((code, index) => (
                    <li key={index} onClick={() => handleCourseCodeSuggestionClick(code)}>
                      {code}
                    </li>
                  ))
                ) : (
                  <li>No suggestions</li>
                )}
              </ul>
            )}
          </div>

          <div className="form-item row2">
            <label>Abbreviation:</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-item row2">
            <label>Faculty Name:</label>
            <input
              type="text"
              value={facultyName}
              onChange={handleFacultyNameChange}
              required
            />
            {showFacultySuggestions && (
              <ul className="autocomplete-dropdown">
                {facultySuggestions.length ? (
                  facultySuggestions.map((name, index) => (
                    <li key={index} onClick={() => handleFacultySuggestionClick(name)}>
                      {name}
                    </li>
                  ))
                ) : (
                  <li>No suggestions</li>
                )}
              </ul>
            )}
          </div>

          <div className="form-item row2">
            <label>Room:</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="button-container">
            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "16px",
              }}
            >
              Post Mapping
            </button>
          </div>
        </div>
        {message && (
          <div className={`alert alert-${messageType}`}>{message}</div>
        )}
      </form>

      {/* Timetable Filter and Table Section */}
      <div className="timetable-container">
        <h2 className="timetable-title">Filtered Mapping</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="filter-container">
          <div className="form-item">
            <label>Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="select-dropdown"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item">
            <label>Branch:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="select-dropdown"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item">
            <label>Section:</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="select-dropdown"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Subject Name</th>
                <th>Course Code</th>
                <th>Branch</th>
                <th>Section</th>
                <th>Semester</th>
                <th>Type</th>
                <th>Time</th>
                <th>Room</th>
                <th>Batch</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimetables.length ? (
                filteredTimetables.map((timetable, index) => (
                  <tr key={index}>
                    <td>{timetable.facultyName}</td>
                    <td>{timetable.subjectName}</td>
                    <td>{timetable.courseCode}</td>
                    <td>{timetable.branch}</td>
                    <td>{timetable.section}</td>
                    <td>{timetable.semester}</td>
                    <td>{timetable.type}</td>
                    <td>{timetable.time}</td>
                    <td>{timetable.room}</td>
                    <td>{timetable.batch}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No timetables available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyPostTimetable;
