import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Welcome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>MLB Player Evaluation Database</h2>
        <p>You have successfully logged in!</p>
        <button className="App-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
    </div>
  );

}

export default Welcome;