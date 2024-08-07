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
      } else {
        setError('Invalid role');
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
        <div className="login-card">
          <img src={RIASLogo} alt="RIAS Logo" className="logo" />
          <div className="title"><b>Login Page</b></div>
          <form onSubmit={onSubmit}>
            <label htmlFor="email" className="label">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" className="input" />
            <label htmlFor="password" className="label">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" className="input" />
            <button type="submit" className="button">Login</button>
            <button type="button" onClick={() => navigate('/register')} className="register-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
