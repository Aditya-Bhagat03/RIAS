// ./components/AdminDashboard/dashboard.js

import React from 'react';

const Adashboard = () => {
  // Inline CSS styles for the card
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    margin: '10px',
    backgroundColor: '#fff',
    maxWidth: '300px',
    textAlign: 'center',
  };

  return (
    <div>
      {/* Dashboard content */}
      <h1>Dashboard</h1>
      
      {/* Card with inline CSS */}
      <div style={cardStyle}>
        <h2>Card Title</h2>
        <p>This is a card with inline CSS styling.</p>
      </div>
    </div>
  );
};

export default Adashboard; // Ensure this is a default export
