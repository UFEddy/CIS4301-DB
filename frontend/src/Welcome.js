import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>MLB Player Evaluation Database</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Welcome;