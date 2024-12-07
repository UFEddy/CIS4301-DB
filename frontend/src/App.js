import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './Welcome';
import PrivateRoute from './routes/PrivateRoute';
import CostOfWAR from './components/CostOfWar';
import QueryPositionCostTrend from './components/QueryPositionCostTrend';
import QueryHomeVsAwayPerformanceBySeason_2 from './components/QueryHomeVsAwayPerformanceBySeason_2';
import Query3Placeholder from './components/Query3Placeholder';
import Query2Placeholder from './components/Query2Placeholder';
import QueryAttendancePerWarChart from './components/QueryAttendancePerWarChart';
import Query4Placeholder from './components/Query4Placeholder';
import Query5Placeholder from './components/Query5Placeholder';

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
            <Route path="/position-trend" element={<QueryPositionCostTrend/>} />
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/query2" element={<QueryHomeVsAwayPerformanceBySeason_2 />} />
            <Route path="/query3" element={<Query3Placeholder />} />
            <Route path="/query3" element={<QueryAttendancePerWarChart />} />
            <Route path="/query4" element={<Query4Placeholder />} />
            <Route path="/query5" element={<Query5Placeholder />} />
            
        </Routes>
      </div>
    </Router>
  );
}

export default App;
