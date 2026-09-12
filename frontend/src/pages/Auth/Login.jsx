import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  User as UserIcon,
  KeyRound,
  ShieldCheck,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  Factory,
  HardHat
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { ADMIN_ROLE, getRoleLanding, isStaffRole, normalizeRole } from '../../utils/roleAccess';
import './Login.css';

// Remember-me is per tab (admin / staff) and stays in localStorage on purpose —
// it only ever holds the username, never the session token.
const REMEMBER_PREFIX = 'kak rememberedUsername';
const LEGACY_REMEMBER_KEY = 'kak rememberedUsername';
const rememberKey = (mode) => `${REMEMBER_PREFIX}:${mode}`;

const readRemembered = (mode) => {
  try {
    if (mode === 'admin') {
      return localStorage.getItem(rememberKey('admin')) || localStorage.getItem(LEGACY_REMEMBER_KEY) || '';
    }
    return localStorage.getItem(rememberKey(mode)) || '';
  } catch {
    return '';
  }
};

const brandHighlights = [
  'Live loom telemetry & shift OEE tracking',
  'Dye house lab, finishing & quality workflows',
  'Gate pass, dispatch & export documentation'
];

const LOGIN_TABS = {
  admin: {
    kicker: 'ADMIN / MANAGEMENT ACCESS',
    heading: 'Plant admin sign in',
    sub: 'Owners, plant managers and accounts — full access to every module.',
    placeholder: 'e.g. admin',
    hint: 'Admin accounts unlock all 31 modules including staff, payroll, costing and reports.',
    submitLabel: 'Sign In as Admin'
  },
  staff: {
    kicker: 'SHOP-FLOOR STAFF ACCESS',
    heading: 'Staff sign in',
    sub: 'Supervisors, weavers, dyeing, finishing, fitters and dispatch teams.',
    placeholder: 'e.g. weaver',
    hint: 'Staff roles: Supervisor · Weaver · Dyeing Master · Finishing Master · Fitter · Dispatcher — each opens only its own modules.',
    submitLabel: 'Sign In to My Modules'
  }
};

const Login = () => {
  const { login, logout, token, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('admin'); // admin | staff

  // -------- Sign in state --------
  const [username, setUsername] = useState(() => readRemembered('admin'));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => Boolean(readRemembered('admin')));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // -------- Forgot password modal state --------
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState('user'); // user -> verify -> done
  const [fpUsername, setFpUsername] = useState('');
  const [fpFullName, setFpFullName] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpTempPassword, setFpTempPassword] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  const loginTab = LOGIN_TABS[mode] || LOGIN_TABS.admin;

  // Already authenticated users should not sit on the auth page — they go
  // straight to the first page their role is allowed to open.
  useEffect(() => {
    if (!token) return;
    const home = getRoleLanding(user?.role);
    if (!home) {
      logout();
      setError('This account has no role assigned. Contact the plant admin.');
      return;
    }
    if (window.location.pathname !== home) {
      navigate(home, { replace: true });
    }
  }, [token, user, navigate, logout]);

  // Move the pre-tab remember-me value onto the Admin tab (one time).
  useEffect(() => {
    try {
      const legacy = localStorage.getItem(LEGACY_REMEMBER_KEY);
      if (legacy) {
        if (!localStorage.getItem(rememberKey('admin'))) {
          localStorage.setItem(rememberKey('admin'), legacy);
        }
        localStorage.removeItem(LEGACY_REMEMBER_KEY);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const switchMode = (next) => {
    setMode(next);
    setError('');
    const saved = readRemembered(next);
    setUsername(saved);
    setRememberMe(Boolean(saved));
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem(rememberKey(mode), username.trim());
      } else {
        localStorage.removeItem(rememberKey(mode));
      }

      const data = await login(username.trim(), password);
      const role = normalizeRole(data?.role);

      // Tab <-> role guard: the Admin tab accepts ADMIN only, the Staff tab
      // accepts every shop-floor role and rejects admin accounts.
      if (mode === 'admin' && role !== ADMIN_ROLE) {
        logout();
        setError('This account is not an admin account. Sign in from the Staff tab.');
        return;
      }
      if (mode === 'staff' && role === ADMIN_ROLE) {
        logout();
        setError('Admin accounts must sign in from the Admin tab.');
        return;
      }
      if (mode === 'staff' && !isStaffRole(role)) {
        logout();
        setError('Your account has no staff role assigned. Contact the plant admin.');
        return;
      }

      navigate(getRoleLanding(role) || '/login', { replace: true });
    } catch (err) {
      // No HTTP response usually means the API host is down / VITE_API_URL missing
      // on a Vercel-only deploy (frontend is live, Spring Boot is not).
      if (!err.response) {
        setError(
          'Cannot reach the mill API server. If this is the Vercel site, the Spring Boot backend ' +
          'must be deployed separately and VITE_API_URL must point to it (e.g. https://your-api.onrender.com/api).'
        );
      } else {
        const data = err.response?.data;
        const msg = typeof data === 'string' ? data : data?.error || data?.message;
        setError(msg || 'Login failed. Please check your credentials.');
      }
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
    <div className="auth-page">
      {/* ---------- Left branding panel ---------- */}
      <div className="auth-brand-panel">
        <div className="auth-brand-top">
          <div className="auth-logo">
            <span className="auth-logo-mark"><Factory size={20} /></span>
            <span className="auth-logo-text">KAK<span> Textile Processing</span></span>
          </div>
        </div>

        <div className="brand-inner">
          <span className="brand-kicker">MILL MANAGEMENT SUITE · TIRUPUR</span>
          <h1>Textile Processing<br />&amp; Manufacturing ERP</h1>
          <p>
            One secure workspace for weaving, dyeing, finishing, quality and
            dispatch — from grey yarn inward to export gate pass.
          </p>

          <ul className="brand-points">
            {brandHighlights.map((point) => (
              <li key={point}>
                <CheckCircle2 size={15} /> {point}
              </li>
            ))}
          </ul>

          <div className="brand-badges">
            <span><ShieldCheck size={14} /> ISO 9001:2015</span>
            <span><ShieldCheck size={14} /> OEKO-TEX® 100</span>
          </div>
        </div>

        <div className="auth-brand-foot">
          ISO-class process control · Secured staff access only
        </div>
      </div>

      {/* ---------- Right auth panel ---------- */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'admin'}
              className={`auth-tab ${mode === 'admin' ? 'active' : ''}`}
              onClick={() => switchMode('admin')}
            >
              <ShieldCheck size={15} /> Admin
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'staff'}
              className={`auth-tab ${mode === 'staff' ? 'active' : ''}`}
              onClick={() => switchMode('staff')}
            >
              <HardHat size={15} /> Staff
            </button>
            <span className={`auth-tab-slider ${mode === 'staff' ? 'right' : ''}`} />
          </div>

          <>
            <p className="auth-kicker">{loginTab.kicker}</p>
            <h2>{loginTab.heading}</h2>
            <p className="auth-sub">{loginTab.sub}</p>

            <div className="role-hint">
              {mode === 'admin' ? <ShieldCheck size={14} /> : <HardHat size={14} />}
              <span>{loginTab.hint}</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="login-username">Username</label>
              <div className="input-icon-wrap">
                <UserIcon size={15} />
                <input
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={loginTab.placeholder}
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={15} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="auth-row">
                <label className="remember-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button type="button" className="forgot-link" onClick={openForgot}>
                  <KeyRound size={13} /> Forgot password?
                </button>
              </div>

              {error && <div className="auth-error">{String(error)}</div>}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading || !username.trim() || !password}
              >
                {loading ? 'Signing in…' : <><LogIn size={15} /> {loginTab.submitLabel}</>}
              </button>
            </form>
          </>
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
                {fpError && <div className="auth-error">{fpError}</div>}
                <button type="submit" disabled={fpLoading}>
                  {fpLoading ? 'Checking…' : 'Continue'}
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
                {fpError && <div className="auth-error">{fpError}</div>}
                <button type="submit" disabled={fpLoading}>
                  {fpLoading ? 'Verifying…' : 'Verify & Get One-Time Password'}
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
