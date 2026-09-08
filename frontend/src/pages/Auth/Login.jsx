import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Check backend port 8083.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-kicker">HAUTE COUTURE ERP</p>
        <h1>ROYAL FABRICS</h1>
        <p className="login-sub">Boutique Manager Access</p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <div className="login-error">{String(error)}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Enter Atelier'}
          </button>
        </form>

        <div className="login-hint">
          admin / admin123 · cashier / cashier123 · tailor / tailor123
        </div>
      </div>
    </div>
  );
};

export default Login;