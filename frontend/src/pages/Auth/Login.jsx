import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, User as UserIcon, KeyRound, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState('user'); // user -> verify -> done
  const [fpUsername, setFpUsername] = useState('');
  const [fpFullName, setFpFullName] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpTempPassword, setFpTempPassword] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'string' ? data : data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const openForgot = () => {
    setShowForgot(true);
    setFpStep('user');
    setFpError('');
    setFpUsername('');
    setFpFullName('');
    setFpTempPassword('');
  };

  const handleForgotUser = async (e) => {
    e.preventDefault();
    setFpError('');
    setFpLoading(true);
    try {
      await API.get(`/auth/forgot-password/${encodeURIComponent(fpUsername.trim())}`);
      setFpStep('verify');
    } catch (err) {
      setFpError(err.response?.data?.error || 'No account found for this username.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleForgotVerify = async (e) => {
    e.preventDefault();
    setFpError('');
    setFpLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', {
        username: fpUsername.trim(),
        fullName: fpFullName.trim()
      });
      setFpTempPassword(res.data.tempPassword);
      setFpStep('done');
    } catch (err) {
      setFpError(err.response?.data?.error || 'Verification failed.');
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Back to public website */}
      <Link to="/" className="login-back-btn">
        <ArrowLeft size={16} /> Back to Website
      </Link>

      {/* Left branding panel */}
      <div className="login-brand-panel">
        <div className="brand-inner">
          <span className="brand-kicker">ROYAL FABRICS · COIMBATORE</span>
          <h1>Premium Fabric<br />Manufacturing ERP</h1>
          <p>
            Integrated mill management — weaving, dyeing, finishing,
            quality and dispatch with live loom telemetry.
          </p>
          <div className="brand-badges">
            <span><ShieldCheck size={14} /> ISO 9001:2015</span>
            <span><ShieldCheck size={14} /> OEKO-TEX® 100</span>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="login-form-panel">
        <div className="login-card">
          <p className="login-kicker">STAFF ACCESS</p>
          <h2>Sign in to the Mill</h2>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <div className="input-icon-wrap">
              <UserIcon size={15} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                required
              />
            </div>

            <label>Password</label>
            <div className="input-icon-wrap">
              <Lock size={15} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>

            {error && <div className="login-error">{String(error)}</div>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter Mill'}
            </button>
          </form>

          <button type="button" className="forgot-link" onClick={openForgot}>
            <KeyRound size={13} /> Forgot password?
          </button>
        </div>
      </div>

      {/* ---------- Forgot password modal ---------- */}
      {showForgot && (
        <div className="forgot-overlay">
          <div className="forgot-modal">
            <div className="forgot-head">
              <h3>Reset Password</h3>
              <button type="button" className="forgot-close" onClick={() => setShowForgot(false)}>
                <X size={18} />
              </button>
            </div>

            {fpStep === 'user' && (
              <form onSubmit={handleForgotUser}>
                <p className="forgot-sub">
                  Enter your staff username. We will verify your identity using
                  your registered full name.
                </p>
                <label>Username</label>
                <input
                  value={fpUsername}
                  onChange={(e) => setFpUsername(e.target.value)}
                  placeholder="e.g. weaver"
                  required
                />
                {fpError && <div className="login-error">{fpError}</div>}
                <button type="submit" disabled={fpLoading}>
                  {fpLoading ? 'Checking...' : 'Continue'}
                </button>
              </form>
            )}

            {fpStep === 'verify' && (
              <form onSubmit={handleForgotVerify}>
                <p className="forgot-sub">
                  Identity check for <strong>{fpUsername}</strong> — enter your
                  registered full name exactly as HR has it.
                </p>
                <label>Registered Full Name</label>
                <input
                  value={fpFullName}
                  onChange={(e) => setFpFullName(e.target.value)}
                  placeholder="e.g. Loom Operator Weaver"
                  required
                />
                {fpError && <div className="login-error">{fpError}</div>}
                <button type="submit" disabled={fpLoading}>
                  {fpLoading ? 'Verifying...' : 'Verify & Get One-Time Password'}
                </button>
              </form>
            )}

            {fpStep === 'done' && (
              <div className="forgot-done">
                <CheckCircle2 size={34} color="#3fb950" />
                <p className="forgot-sub">
                  Identity verified. Your one-time password is:
                </p>
                <div className="temp-password">{fpTempPassword}</div>
                <p className="forgot-note">
                  Sign in with this password now. Ask the plant admin to set a
                  new password from Shift Staff after login.
                </p>
                <button type="button" onClick={() => setShowForgot(false)}>
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
