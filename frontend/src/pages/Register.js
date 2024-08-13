import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FacultyImage from '../assets/faculty.png';
import StudentImage from '../assets/student.png';
import '../css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    registrationNumber: '',
    semester: '',
    branch: '',
    section: '',
    rollNumber: '',
    password: '',
    role: ''
  });
  const navigate = useNavigate();

  const {
    username, email, mobileNumber, registrationNumber,
    semester, branch, section, rollNumber, password, role
  } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/register', formData);
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const selectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className="column role-column">
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
        </div>

        <div className="column register-column">
          <div className="register-card">
            <div className="title"><b>Register Page</b></div>
            <div className="form-wrapper">
              <form onSubmit={onSubmit}>
                <label htmlFor="email" className="label">Email</label>
                <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" className="input" />

                <label htmlFor="username" className="label">Username</label>
                <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" className="input" />

                <label htmlFor="mobileNumber" className="label">Mobile Number</label>
                <input type="text" name="mobileNumber" value={mobileNumber} onChange={onChange} placeholder="Mobile Number" className="input" />

                <label htmlFor="registrationNumber" className="label">Registration Number</label>
                <input type="text" name="registrationNumber" value={registrationNumber} onChange={onChange} placeholder="Registration Number" className="input" />

                <label htmlFor="semester" className="label">Semester</label>
                <input type="text" name="semester" value={semester} onChange={onChange} placeholder="Semester" className="input" />

                <label htmlFor="branch" className="label">Branch</label>
                <input type="text" name="branch" value={branch} onChange={onChange} placeholder="Branch" className="input" />

                <label htmlFor="section" className="label">Section</label>
                <input type="text" name="section" value={section} onChange={onChange} placeholder="Section" className="input" />

                <label htmlFor="rollNumber" className="label">Roll Number</label>
                <input type="text" name="rollNumber" value={rollNumber} onChange={onChange} placeholder="Roll Number" className="input" />

                <label htmlFor="password" className="label">Password</label>
                <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" className="input" />

                <label htmlFor="role" className="label">Role</label>
                <input type="text" name="role" value={role} readOnly className="input" />

            <div className='regbutton'>
              
              <button type="submit" className="button">Register</button>
              </div>
                
              </form>
              
            </div>
            
            <div className='regbutton'>
              
            
            <button type="button" onClick={() => navigate('/login')} className="login-button">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
