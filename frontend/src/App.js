import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './Welcome';
import PrivateRoute from './routes/PrivateRoute';
import CostOfWAR from './components/CostOfWar';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <Welcome />
              </PrivateRoute>
            }
          />
            {/*Temporary Route for login bypass */}
            <Route path="/test-welcome" element={<Welcome />} />
            {/* New Route for Cost of WAR Page */}
            <Route path="/cost-of-war" element={<CostOfWAR />} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
