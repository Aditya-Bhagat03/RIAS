import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import RIASLogo from '../assets/rias.png'; // Adjust the path according to your file structure
import FacultyImage from '../assets/faculty.png'; // Adjust the path according to your file structure
import StudentImage from '../assets/student.png'; // Adjust the path according to your file structure
import '../css/Login.css'; // Import the CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // Default role
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', formData); // Ensure this URL is correct

      console.log(res.data);

      // Save token and role
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      // Decode token to get user ID
      const decodedToken = jwtDecode(res.data.token);
      localStorage.setItem('userId', decodedToken.id); // Correct field name from decoded token

      const userRole = res.data.user.role;

      // Navigate based on the user role
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (userRole === 'student') {
        navigate('/student-dashboard');
      } else  {
        navigate('/class-teacher');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Login failed');
    }
  };

  const selectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const closeError = () => {
    setError('');
  };

  return (
    <div className="login-container">
      {error && (
        <div className="login-error-popup">
          <div className="login-error-content">
            <p><b>{error}</b></p>
            <button onClick={closeError}>Close</button>
          </div>
        </div>
      )}
      <div className="login-card-container">
        <div className="login-role-card">
          <img
            src={FacultyImage}
            alt="Faculty Role"
            className={`login-role-button ${role === 'faculty' ? 'login-selected-role-button' : ''}`}
            onClick={() => selectRole('faculty')}
          />
          <img
            src={StudentImage}
            alt="Student Role"
            className={`login-role-button ${role === 'student' ? 'login-selected-role-button' : ''}`}
            onClick={() => selectRole('student')}
          />
        </div>
        <div className="login-card">
          <img src={RIASLogo} alt="RIAS Logo" className="login-logo" />
          <div className="login-title"><b>Login Page</b></div>
          <form onSubmit={onSubmit}>
            <label htmlFor="email" className="login-label">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" className="login-input" />
            <label htmlFor="password" className="login-label">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" className="login-input" />
            <button type="submit" className="login-button">Login</button>
            <button type="button" onClick={() => navigate('/register')} className="login-register-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
