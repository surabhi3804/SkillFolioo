import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import './SignInPage.css';
// Updated: Login + Create Account tabs

const SignInPage = () => {
  const navigate = useNavigate();
  const { loginWithBackend, registerWithBackend } = useApp();

  const [isLogin, setIsLogin]   = useState(true);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!isLogin && (!form.name || form.name.trim().length < 2)) {
      errs.name = 'Please enter your full name.';
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.password || form.password.length <= 6) {
      errs.password = 'Password must be more than 6 characters.';
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
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
          <button className={`signin-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setApiError(''); setErrors({}); }}>
            Sign In
          </button>
          <button className={`signin-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setApiError(''); setErrors({}); }}>
            Sign Up
          </button>
        </div>

        {apiError && <div className="api-error-msg">{apiError}</div>}

        <div className="signin-form">
          {/* Name field — only for register */}
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
            <label className="form-label">Password</label>
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