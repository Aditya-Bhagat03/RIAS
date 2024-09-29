import React, { useState, useEffect } from 'react';
import './CSS/StudentTimetable.css'; // Import the updated CSS file

const StudentTimetable = () => {
  const [profileData, setProfileData] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [electives, setElectives] = useState([]); // State for electives
  const [selectedElectives, setSelectedElectives] = useState([]); // State for selected electives
  const [tempSelectedElectives, setTempSelectedElectives] = useState([]); // State for temporarily selected electives
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const handleAddElectives = async () => {
    const updatedElectives = [...selectedElectives, ...tempSelectedElectives];

    try {
      const token = localStorage.getItem('token');
      const userId = profileData._id;

      const response = await fetch(`http://localhost:4000/api/users/user/${userId}/select-elective`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ electives: updatedElectives }), // Send all selected electives as an array
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Electives added successfully!');
        window.location.reload(); // Reload the page after successful addition
      } else {
        throw new Error(`Failed to add electives: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error adding electives:', error);
      setError('Error adding electives. Please try again later.');
    }
  };

  // Handle elective deletion
  const handleElectiveDeletion = async (electiveToRemove) => {
    try {
      const token = localStorage.getItem('token');
      const userId = profileData._id;

      const response = await fetch(`http://localhost:4000/api/users/user/${userId}/remove-elective`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ electiveToRemove }), // Send the elective to remove
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Elective removed successfully!');
        window.location.reload(); // Reload the page after successful deletion
      } else {
        throw new Error(`Failed to remove elective: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error removing elective:', error);
      setError('Error removing elective. Please try again later.');
    }
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

          {/* Elective Section inside table */}
          <div className="electives-section">
            <table className="electives-table">
              <thead>
                <tr>
                  <th>Available Electives</th>
                  <th>Select Elective</th>
                  <th>Dropdown</th>
                  <th>Add Electives & Selected List</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {electives.length > 0 ? electives.join(', ') : 'No electives available'}
                  </td>
                  <td>
                    <select
                      multiple
                      onChange={(e) =>
                        setTempSelectedElectives([...e.target.selectedOptions].map((option) => option.value))
                      }
                    >
                      {electives.map((elective, index) => (
                        <option key={index} value={elective}>
                          {elective}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="add-electives-button" onClick={handleAddElectives}>
                      Add Selected Electives
                    </button>
                  </td>
                  <td>
                    <ul>
                      {selectedElectives.map((elective, index) => (
                        <li key={index} className="selected-elective-item">
                          {elective}
                          <button onClick={() => handleElectiveDeletion(elective)}>Delete</button>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentTimetable;
