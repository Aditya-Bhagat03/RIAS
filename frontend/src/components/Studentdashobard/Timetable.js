import React, { useState, useEffect } from 'react';
import './CSS/StudentTimetable.css'; // Import the updated CSS file

const StudentTimetable = () => {
  const [profileData, setProfileData] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [electives, setElectives] = useState([]); // State for electives fetched from API
  const [selectedElectives, setSelectedElectives] = useState([]); // State for selected electives
  const [tempSelectedElectives, setTempSelectedElectives] = useState([]); // State for temporarily selected electives
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [electivesSelected, setElectivesSelected] = useState(false); // Track whether electives are selected

  // Fetch student profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      const response = await fetch(`http://localhost:4000/api/users/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setSelectedElectives(data.electives || []); // Set previously selected electives
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Error fetching profile data. Please try again later.');
    }
  };

  // Fetch timetable data
  const fetchTimetableData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:4000/api/timetables', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTimetableData(data);
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setError('Error fetching timetable data. Please try again later.');
    }
  };

  // Fetch available electives
  const fetchElectives = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:4000/api/electives', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setElectives(data); // Set electives as array of strings
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching electives:', error);
      setError('Error fetching electives. Please try again later.');
    }
  };

  // Handle adding selected electives
  const handleAddElectives = () => {
    const updatedElectives = [...selectedElectives, ...tempSelectedElectives];
    setSelectedElectives(updatedElectives);
    setTempSelectedElectives([]); // Clear temporary selections
  };

  // Handle elective deletion
  const handleElectiveDeletion = (electiveToRemove) => {
    const updatedElectives = selectedElectives.filter(elective => elective !== electiveToRemove);
    setSelectedElectives(updatedElectives);
  };

  // Handle elective selection dropdown change
  const handleElectivesChange = (e) => {
    setTempSelectedElectives([...e.target.selectedOptions].map(option => option.value));
  };

  // Filter timetable data based on profile data and elective
  useEffect(() => {
    if (profileData && timetableData.length > 0) {
      const filtered = timetableData.filter(entry =>
        entry.branch === profileData.branch &&
        entry.section === profileData.section &&
        entry.semester === profileData.semester &&
        (entry.batch === "Not Required" || entry.batch === profileData.batch || entry.batch === "") &&
        (!entry.isElective || profileData.electives.includes(entry.subjectName))
      );
      setFilteredTimetable(filtered);
    }
  }, [profileData, timetableData]);

  // Fetch both profile, electives, and timetable data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfileData();
        await fetchTimetableData();
        await fetchElectives(); // Fetch electives
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="student-timetable-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <>
          {!electivesSelected ? (
            <div className="electives-selection-container">
              <h2>Select Your Electives</h2>

              {/* Dropdown for Elective Selection */}
              <div className="dropdown-section">
                <label htmlFor="electives" className="electives-label">Elective Subjects</label>
                <select
                  name="electives"
                  value={tempSelectedElectives}
                  onChange={handleElectivesChange}
                  className="electives-dropdown"
                  multiple
                >
                  {electives.length > 0 ? (
                    electives.map((elective, index) => (
                      <option key={index} value={elective}>
                        {elective}
                      </option>
                    ))
                  ) : (
                    <option value="">No electives available</option>
                  )}
                </select>
              </div>

              {/* Button to add selected electives */}
              <button className="add-electives-button" onClick={handleAddElectives}>
                Add Selected Electives
              </button>

              {/* Table to display selected electives */}
              {selectedElectives.length > 0 && (
                <div className="electives-table-section">
                  <h3>Selected Electives</h3>
                  <table className="electives-table">
                    <thead>
                      <tr>
                        <th>Elective</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedElectives.map((elective, index) => (
                        <tr key={index}>
                          <td>{elective}</td>
                          <td>
                            <button
                              className="delete-elective-button"
                              onClick={() => handleElectiveDeletion(elective)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Button to skip elective selection and view timetable */}
              <button className="view-timetable-button" onClick={() => setElectivesSelected(true)}>
                View Timetable
              </button>
            </div>
          ) : (
            <div className="timetable-view-container">
              <h2>Student Timetable</h2>
              {filteredTimetable.length > 0 ? (
                <div className="timetable-wrapper">
                  <table className="timetable-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Branch</th>
                        <th>Faculty</th>
                        <th>Course Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimetable.map((entry, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td>{entry.type || 'N/A'}</td>
                          <td>{entry.courseAbbreviation || 'N/A'}</td>
                          <td>{entry.subjectName || 'N/A'}</td>
                          <td>{entry.parentDepartment || 'N/A'}</td>
                          <td>{entry.facultyName || 'N/A'}</td>
                          <td>{entry.courseCode || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-timetable-message">No timetable available for the specified criteria.</div>
              )}
              {/* Button to go back to elective selection */}
              <button className="back-to-electives-button" onClick={() => setElectivesSelected(false)}>
                Go Back to Elective Selection
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentTimetable;
