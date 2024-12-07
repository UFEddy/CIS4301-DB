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
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const token = response.headers['authorization'];
      if (token && token.startsWith('Bearer ')) {
        localStorage.setItem('token', token.substring(7));
        navigate('/welcome');
      } else {
        setError('Login failed: Token not received or malformed');
      }
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  const handleBypassLogin = () => {
    navigate('/test-welcome');
  };

  return (
    <div className="login-container">
      <div className="app-name">MLB Player Evaluation - CIS4301 Project</div>
      <div className="login-card">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="modern-button">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <button className="modern-button bypass-button" onClick={handleBypassLogin}>
          Bypass Login
        </button>
      </div>
    </div>
  );
}

export default Login;