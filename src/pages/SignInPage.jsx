import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap, ArrowRight, ArrowLeft, Mail } from 'lucide-react';
import './SignInPage.css';

// view: 'auth' | 'forgot' | 'forgot-sent'
const SignInPage = () => {
  const navigate = useNavigate();
  const { loginWithBackend, registerWithBackend } = useApp();

  const [view,     setView]     = useState('auth');   // 'auth' | 'forgot' | 'forgot-sent'
  const [isLogin,  setIsLogin]  = useState(true);
  const [form,     setForm]     = useState({ name: '', email: '', password: '' });
  const [errors,   setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  // Forgot password state
  const [forgotEmail,  setForgotEmail]  = useState('');
  const [forgotError,  setForgotError]  = useState('');
  const [forgotLoading,setForgotLoading]= useState(false);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!isLogin && (!form.name || form.name.trim().length < 2))
      errs.name = 'Please enter your full name.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length <= 6)
      errs.password = 'Password must be more than 6 characters.';
    return errs;
  };

  /* ── Sign in / Sign up submit ── */
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true); setApiError('');
    try {
      if (isLogin) {
        await loginWithBackend(form.email, form.password);
      } else {
        await registerWithBackend(form.name, form.email, form.password);
      }
      navigate('/templates');
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (apiError) setApiError('');
  };

  /* ── Forgot password submit ── */
  const handleForgotSubmit = async () => {
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError('Please enter a valid email address.'); return;
    }
    setForgotLoading(true); setForgotError('');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: forgotEmail }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed.');
      setView('forgot-sent');
    } catch (err) {
      setForgotError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const switchTab = (toLogin) => {
    setIsLogin(toLogin); setApiError(''); setErrors({});
  };

  const goToForgot = () => {
    setForgotEmail(form.email); // pre-fill with whatever they typed
    setForgotError('');
    setView('forgot');
  };

  const goBack = () => { setView('auth'); setForgotError(''); };

  /* ══════════════════════════════════════════════════════════
     RENDER — Forgot sent confirmation
  ══════════════════════════════════════════════════════════ */
  if (view === 'forgot-sent') {
    return (
      <div className="signin-page">
        <div className="signin-bg-orb orb-1" />
        <div className="signin-bg-orb orb-2" />
        <div className="signin-card animate-fadeInUp">
          <div className="signin-logo">
            <div className="brand-icon-lg"><Zap size={22} /></div>
            <span className="brand-name-lg">SkillFolio</span>
          </div>

          <div className="forgot-sent-icon">
            <Mail size={32} strokeWidth={1.5} />
          </div>
          <h1 className="signin-title">Check your inbox</h1>
          <p className="signin-subtitle" style={{ marginBottom: 28 }}>
            We sent a password reset link to <strong style={{ color: 'var(--text)' }}>{forgotEmail}</strong>.
            The link expires in 15 minutes.
          </p>

          <p className="signin-footer-note" style={{ marginBottom: 20 }}>
            Didn't receive it? Check your spam folder or{' '}
            <button className="signin-switch-btn" onClick={() => setView('forgot')}>
              try again
            </button>.
          </p>

          <button className="btn-secondary back-btn" onClick={() => setView('auth')}>
            <ArrowLeft size={15} /> Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     RENDER — Forgot password form
  ══════════════════════════════════════════════════════════ */
  if (view === 'forgot') {
    return (
      <div className="signin-page">
        <div className="signin-bg-orb orb-1" />
        <div className="signin-bg-orb orb-2" />
        <div className="signin-card animate-fadeInUp">
          <div className="signin-logo">
            <div className="brand-icon-lg"><Zap size={22} /></div>
            <span className="brand-name-lg">SkillFolio</span>
          </div>

          <h1 className="signin-title">Forgot password?</h1>
          <p className="signin-subtitle">
            Enter your email and we'll send you a reset link.
          </p>

          {forgotError && <div className="api-error-msg">{forgotError}</div>}

          <div className="signin-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-input ${forgotError ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleForgotSubmit()}
                autoFocus
              />
            </div>

            <button
              className="btn-primary signin-btn"
              onClick={handleForgotSubmit}
              disabled={forgotLoading}
            >
              {forgotLoading ? (
                <span className="signin-loading">
                  <span className="loader-dot" /><span className="loader-dot" /><span className="loader-dot" />
                </span>
              ) : (
                <>Send Reset Link <ArrowRight size={17} /></>
              )}
            </button>

            <button className="btn-secondary back-btn" onClick={goBack}>
              <ArrowLeft size={15} /> Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     RENDER — Main auth view (Sign In / Sign Up)
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="signin-page">
      <div className="signin-bg-orb orb-1" />
      <div className="signin-bg-orb orb-2" />

      <div className="signin-card animate-fadeInUp">
        <div className="signin-logo">
          <div className="brand-icon-lg"><Zap size={22} /></div>
          <span className="brand-name-lg">SkillFolio</span>
        </div>

        <h1 className="signin-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="signin-subtitle">
          {isLogin ? 'Sign in to continue building your resume' : 'Join SkillFolio and build your portfolio'}
        </p>

        {/* Toggle tabs */}
        <div className="signin-tabs">
          <button className={`signin-tab ${isLogin ? 'active' : ''}`} onClick={() => switchTab(true)}>
            Sign In
          </button>
          <button className={`signin-tab ${!isLogin ? 'active' : ''}`} onClick={() => switchTab(false)}>
            Sign Up
          </button>
        </div>

        {apiError && <div className="api-error-msg">{apiError}</div>}

        <div className="signin-form">
          {/* Name — register only */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text" name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Rohan Sharma"
                value={form.name} onChange={handleChange}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            {/* Password label row with "Forgot password?" link */}
            <div className="form-label-row">
              <label className="form-label">Password</label>
              {isLogin && (
                <button type="button" className="forgot-link" onClick={goToForgot}>
                  Forgot password?
                </button>
              )}
            </div>
            <div className="password-wrap">
              <input
                type={showPass ? 'text' : 'password'} name="password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password (min 7 characters)"
                value={form.password} onChange={handleChange}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button className="btn-primary signin-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="signin-loading">
                <span className="loader-dot" /><span className="loader-dot" /><span className="loader-dot" />
              </span>
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={17} /></>
            )}
          </button>
        </div>

        <p className="signin-footer-note">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignInPage;