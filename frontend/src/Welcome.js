import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Welcome() {
  const navigate = useNavigate();

  const [totalRows, setTotalRows] = useState(null);
  const [error, setError] = useState(null);

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

        {/* Add a button to get tuples */}

        <button className="App-button" onClick={getTuples}>
          Count Tuples
        </button>
        {/* Display the result or error */}
        {totalRows !== null && <p>Total Rows: {totalRows}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      </header>
    </div>
  );

}

export default Welcome;