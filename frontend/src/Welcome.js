import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const [totalRows, setTotalRows] = useState(null);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTestAccess = () => {
    navigate('/test-welcome');
  };

  const goToCostOfWAR = () => {
    navigate('/cost-of-war');
  };

  const goToPositionTrends = () => {
    navigate('/position-trend');
  };

  const goToQuery2 = () => {
    navigate('/query2');
  };

  const goToQuery3 = () => {
    navigate('/query3');
  };

  const goToQuery4 = () => {
    navigate('/query4');
  };

  const goToQuery5 = () => {
    navigate('/query5');
  };

  const getTuples = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/count');

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTotalRows(data.total_rows);
      setError(null);

    } catch(err) {
      setError(err.message);
      setTotalRows(null);
    }
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="top-bar">
          <button className="modern-button" onClick={handleLogout}>
            Logout
          </button>
          <button className="modern-button" onClick={getTuples}>
            Count Tuples
          </button>
        </div>

        <h1>MLB Player Evaluation Database</h1>
        <p className="welcome-message">Welcome! Explore player statistics and performance analysis.</p>

        <div className="button-grid">
          <button className="modern-button" onClick={handleTestAccess}>
            Test Access
          </button>
          <button className="modern-button" onClick={goToCostOfWAR}>
            View Cost of WAR
          </button>
          <button className="modern-button" onClick={goToPositionTrends}>
            Query 1: Position Cost Analysis
          </button>
          <button className="modern-button" onClick={goToQuery2}>
            Query 2: Home vs Away Performance
          </button>
          <button className="modern-button" onClick={goToQuery3}>
            Query 3: Performance vs Attendance
          </button>
          <button className="modern-button" onClick={goToQuery4}>
            Query 4: Performance vs Standing
          </button>
          <button className="modern-button" onClick={goToQuery5}>
            Query 5: Cost of Buying Wins
          </button>
        </div>

        {totalRows !== null && <p className="result">Total Rows: {totalRows}</p>}
        {error && <p className="error-message">Error: {error}</p>}
      </header>
    </div>
  );
}

export default Welcome;