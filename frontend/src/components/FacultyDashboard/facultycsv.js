import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/csv.css'; // Ensure this CSS file exists for styling

const FacultyCsv = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadType, setUploadType] = useState('faculty'); // Default upload type
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadTypeChange = (e) => {
    setUploadType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setMessage('Please select a file first');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`http://localhost:4000/api/csv/upload-${uploadType}-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        setMessage(response.data.msg || 'File uploaded successfully');
      } else {
        setMessage('Unexpected response status');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMsg = error.response?.data?.message || 'Error uploading file';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="csv-container">
      <div className="csv-content">
        <h2 className="csv-title">Upload CSV File</h2>
        <select onChange={handleUploadTypeChange} className="csv-select">
          <option value="faculty">Faculty CSV</option>
          <option value="timetable">Timetable CSV</option>
        </select>
        <form onSubmit={handleSubmit} className="csv-form">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv"
            className="csv-input"
          />
          <button type="submit" className="csv-button">Upload</button>
        </form>
        {message && <p className="csv-message">{message}</p>}
      </div>
    </div>
  );
};

export default FacultyCsv;
