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

  // Navigate to the Cost of WAR page
  const goToCostOfWAR = () => {
    navigate('/cost-of-war'); 
  };

  // Navigate to the Position Trends page
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
    <div className="App">
      <header className="App-header">
        
        <div className="top-right-logout">
          <button className="App-button" onClick={handleLogout}>
            Logout
          </button>

            {/* Add a button to get tuples */}
            <button className="App-button" onClick={getTuples}>
              Count Tuples
            </button>
          </div>

        <h2>MLB Player Evaluation Database</h2>
        <p>You have successfully logged in!</p>

        {/* Temporary login bypass button */}
        <button className="App-button" onClick={handleTestAccess}>
          Test Access
        </button>

        <button className="App-button" onClick={goToCostOfWAR}>
          View Cost of WAR
        </button>

        <button className="App-button" onClick={goToPositionTrends}>
          Query 1 Analysis of How Much Does Each Position Cost
        </button>

        <button className="App-button" onClick={goToQuery2}>
          Query 2 Analysis of Player Performance in Home vs Away Games
        </button>

        <button className="App-button" onClick={goToQuery3}>
          Query 3 Analysis of Player Performance vs Current Standing
        </button>

        <button className="App-button" onClick={goToQuery4}>
          Query 4 Analysis of Player Performance vs Fan Attendance
        </button>

        <button className="App-button" onClick={goToQuery5}>
          Query 5 Analysis of the Cost to Buy Wins
        </button>

        
        {/* Display the result or error */}
        {totalRows !== null && <p>Total Rows: {totalRows}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      </header>
    </div>
  );

}

export default Welcome;