import React from 'react';
import './App.css';

function Welcome() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>MLB Player Evaluation Database</h2>
        <p>You have successfully logged in.</p>
        <a className="App-link" href="/login">
          Go back to login
        </a>
      </header>
    </div>
  );
}

export default Welcome;
