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
import Query4Placeholder from './components/Query4Placeholder';
import Query5Placeholder from './components/Query5Placeholder';

// Mock data, remove when backend is completed.
const mockData = [
  { date: new Date('2020-01-01').getTime(), Pitcher: 5000, Catcher: 3000, Infielder: 4000, Outfielder: 3500 },
  { date: new Date('2021-01-01').getTime(), Pitcher: 5500, Catcher: 3200, Infielder: 4200, Outfielder: 3800 },
  { date: new Date('2022-01-01').getTime(), Pitcher: 6000, Catcher: 3400, Infielder: 4500, Outfielder: 4000 },
  { date: new Date('2023-01-01').getTime(), Pitcher: 6200, Catcher: 3600, Infielder: 4700, Outfielder: 4200 },
];

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
            <Route path="/position-trend" element={<QueryPositionCostTrend data={mockData} />} />
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/query2" element={<QueryHomeVsAwayPerformanceBySeason_2 />} />
            <Route path="/query3" element={<Query3Placeholder />} />
            <Route path="/query4" element={<Query4Placeholder />} />
            <Route path="/query5" element={<Query5Placeholder />} />
            
        </Routes>
      </div>
    </Router>
  );
}

export default App;
