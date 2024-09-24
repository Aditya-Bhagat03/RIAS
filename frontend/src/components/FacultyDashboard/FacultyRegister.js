import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/FacultyRegister.module.css'; // Import the CSS Module

const FacultyRegister = () => {
  const [formData, setFormData] = useState({
    facultyName: '',
    subjectName: '',
    courseCode: '',
    branch: '',
    semester: '',
    academicYear: '',
    session: '',
    parentDepartment: ''
  });

  const [csvFile, setCsvFile] = useState(null); // State for the CSV file
  const [alertMessage, setAlertMessage] = useState(''); // State for the alert message
  const [showAlert, setShowAlert] = useState(false); // State for controlling the alert modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/facultyregister/create/faculty', formData);
      displayAlert('Faculty registered successfully');
    } catch (error) {
      console.error(error);
      displayAlert('Error registering faculty');
    }
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]); // Set the selected file
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      displayAlert('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      await axios.post('http://localhost:4000/api/csv/upload-faculty-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      displayAlert('Faculty data uploaded successfully from CSV');
    } catch (error) {
      console.error(error);
      displayAlert('Error uploading faculty data from CSV');
    }
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.header}>Register Faculty</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.partition}>
          <div className={styles.field}>
            <label className={styles.label}>Faculty Name:</label>
            <input
              type="text"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Subject Name:</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Course Code:</label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Branch:</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.partition}>
          <div className={styles.field}>
            <label className={styles.label}>Semester:</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Academic Year:</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Session:</label>
            <input
              type="text"
              name="session"
              value={formData.session}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Parent Department:</label>
            <input
              type="text"
              name="parentDepartment"
              value={formData.parentDepartment}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>
      </form>
      {/* Register button placed outside the form */}
      <button onClick={handleSubmit} className={styles.submit}>Register</button>

      <h2 className={styles.header}>Upload Faculty CSV</h2>
      <form onSubmit={handleCsvUpload} className={styles.form}>
        <div className={styles.field}>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitt}>Upload CSV</button>
      </form>

      {showAlert && (
        <div className={styles.alert}>
          <div className={styles.alertContent}>
            <span>{alertMessage}</span>
            <button onClick={closeAlert} className={styles.alertClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyRegister;
