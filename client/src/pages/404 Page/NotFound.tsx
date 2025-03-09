import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/globalStyles.css';
import './NotFound.css'; // You'll need to create this CSS file

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-message">The page you're looking for doesn't exist.</p>
      <Link to="/" className="return-home-button">Go back to home</Link>
    </div>
  );
};

export default NotFound;