import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav>
      <h1>RIAS</h1>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default NavBar;
