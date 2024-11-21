import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Welcome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Function to handle test access
  const handleTestAccess = () => {
    navigate('/test-welcome'); // Navigate to the test route
  };

  const goToCostOfWAR = () => {
    navigate('/cost-of-war'); // Navigate to the Cost of WAR page
  };


  return (
    <div className="App">
      <header className="App-header">
        <h2>MLB Player Evaluation Database</h2>
        <p>You have successfully logged in!</p>
        <button className="App-button" onClick={handleLogout}>
          Logout
        </button>
        {/* Temporary login bypass button */}
        <button className="App-button" onClick={handleTestAccess}>
          Test Access
        </button>
        <button className="App-button" onClick={goToCostOfWAR}>
          View Cost of WAR
        </button>
      </header>
    </div>
  );

}

export default Welcome;