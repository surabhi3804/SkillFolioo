import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import './SignInPage.css'; // reuses the same styles

const ResetPasswordPage = () => {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const { loginWithBackend, setUser, setIsLoggedIn } = useApp();

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const validate = () => {
    if (!password || password.length < 7)
      return 'Password must be at least 7 characters.';
    if (password !== confirm)
      return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true); setError('');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/reset-password/${token}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed.');

      // Auto log in with the returned token
      localStorage.setItem('skillfolio_token', data.token);
      setSuccess(true);

      // Redirect after short delay so user sees the success state
      setTimeout(() => navigate('/templates'), 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="signin-page">
        <div className="signin-bg-orb orb-1" />
        <div className="signin-bg-orb orb-2" />
        <div className="signin-card animate-fadeInUp" style={{ textAlign: 'center' }}>
          <div className="signin-logo">
            <div className="brand-icon-lg"><Zap size={22} /></div>
            <span className="brand-name-lg">SkillFolio</span>
          </div>
          <div className="reset-success-icon">
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </div>
          <h1 className="signin-title">Password reset!</h1>
          <p className="signin-subtitle">
            Your password has been updated. Redirecting you in…
          </p>
        </div>
      </div>
    );
  }

  /* ── Reset form ── */
  return (
    <div className="signin-page">
      <div className="signin-bg-orb orb-1" />
      <div className="signin-bg-orb orb-2" />

      <div className="signin-card animate-fadeInUp">
        <div className="signin-logo">
          <div className="brand-icon-lg"><Zap size={22} /></div>
          <span className="brand-name-lg">SkillFolio</span>
        </div>

        <h1 className="signin-title">Create new password</h1>
        <p className="signin-subtitle">
          Choose a strong password for your account.
        </p>

        {error && <div className="api-error-msg">{error}</div>}

        <div className="signin-form">
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="password-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="Min 7 characters"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="password-wrap">
              <input
                type={showConf ? 'text' : 'password'}
                className={`form-input ${error && error.includes('match') ? 'input-error' : ''}`}
                placeholder="Re-enter your new password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button type="button" className="show-pass-btn" onClick={() => setShowConf(!showConf)}>
                {showConf ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Simple strength indicator */}
          {password.length > 0 && (
            <div className="password-strength-wrap">
              <div className="password-strength-bar">
                {[1,2,3,4].map(i => (
                  <div
                    key={i}
                    className="strength-segment"
                    style={{
                      background: password.length >= i * 3
                        ? (password.length >= 12 ? '#059669'
                          : password.length >= 8  ? '#D97706' : '#DC2626')
                        : 'var(--border)',
                    }}
                  />
                ))}
              </div>
              <span className="strength-label" style={{
                color: password.length >= 12 ? '#059669'
                     : password.length >= 8  ? '#D97706' : '#DC2626'
              }}>
                {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : 'Weak'}
              </span>
            </div>
          )}

          <button
            className="btn-primary signin-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="signin-loading">
                <span className="loader-dot" /><span className="loader-dot" /><span className="loader-dot" />
              </span>
            ) : (
              <>Reset Password <ArrowRight size={17} /></>
            )}
          </button>
        </div>

        <p className="signin-footer-note">
          Remember your password?{' '}
          <button className="signin-switch-btn" onClick={() => navigate('/signin')}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;