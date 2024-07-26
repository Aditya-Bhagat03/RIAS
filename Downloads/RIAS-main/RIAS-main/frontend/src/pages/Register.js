import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RIASLogo from '../assets/rias.png'; // Adjust the path according to your file structure
import FacultyImage from '../assets/faculty.png'; // Adjust the path according to your file structure
import StudentImage from '../assets/student.png'; // Adjust the path according to your file structure
import '../css/Register.css'; // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''  // Ensure this field exists
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { username, email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      console.log(response.data);  // Check this line
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      setError(error.response.data.message || 'Registration failed');
    }
  };

  const selectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const closeError = () => {
    setError('');
  };

  return (
    <div className="container">
      {error && (
        <div className="error-popup">
          <div className="error-content">
            <p><b>{error}</b></p>
            <button onClick={closeError}>Close</button>
          </div>
        </div>
      )}
      <div className="card-container">
        <div className="role-card">
          <img
            src={FacultyImage}
            alt="Faculty Role"
            className={`role-button ${role === 'faculty' ? 'selected-role-button' : ''}`}
            onClick={() => selectRole('faculty')}
          />
          <img
            src={StudentImage}
            alt="Student Role"
            className={`role-button ${role === 'student' ? 'selected-role-button' : ''}`}
            onClick={() => selectRole('student')}
          />
        </div>
        <div className="register-card">
          <img src={RIASLogo} alt="RIAS Logo" className="logo" />
          <div className="title"><b>Register Page</b></div>
          <form onSubmit={onSubmit}>
            <label htmlFor="username" className="label">Username</label>
            <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" className="input" />
            <label htmlFor="email" className="label">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" className="input" />
            <label htmlFor="password" className="label">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" className="input" />
            <button type="submit" className="button">Register</button>
            <button onClick={() => navigate('/login')} className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
