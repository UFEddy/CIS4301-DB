import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the backend login endpoint
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Access the Authorization header and check for the token
      const token = response.headers['authorization'];
      if (token && token.startsWith('Bearer ')) {
        localStorage.setItem('token', token.substring(7)); // Store token without 'Bearer '
        navigate('/welcome'); // Redirect to the welcome page
      } else {
        setError('Login failed: Token not received or malformed');
      }
    } catch (error) {
      // Handle login errors
      setError('Invalid username or password');
      console.error('Login error:', error.response?.data || error.message);
    }
  };

 // Bypass login button (for testing)
  const handleBypassLogin = () => {
    navigate('/test-welcome'); // Navigate directly to the test route
  };


  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Bypass login button (for testing) */}
      <button className="bypass-button" onClick={handleBypassLogin}>
        Bypass Login
      </button>
    </div>
  );
}

export default Login;
