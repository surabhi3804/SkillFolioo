import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Menu, X, Zap, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioDropOpen, setPortfolioDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = isLoggedIn ? [
    { label: 'Templates', path: '/templates' },
    { label: 'Resume Builder', path: '/builder' },
    { label: 'ATS Score', path: '/ats-score' },
    { label: 'Skill Analytics', path: '/skill-analytics' },
    { label: 'AI Assistant', path: '/ai-assistant' },
  ] : [];

  const portfolioLinks = [
    { label: 'Choose Template', path: '/portfolio/templates' },
    { label: 'Customize', path: '/portfolio/customize' },
    { label: 'Preview & Publish', path: '/portfolio/preview' },
  ];

  const isPortfolioActive = location.pathname.startsWith('/portfolio');

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-brand" onClick={() => navigate(isLoggedIn ? '/templates' : '/')}>
          <div className="brand-icon">
            <Zap size={18} />
          </div>
          <span className="brand-name">SkillFolio</span>
        </div>

        {isLoggedIn && (
          <>
            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
              {navLinks.map(link => (
                <button
                  key={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                >
                  {link.label}
                </button>
              ))}

              {/* Portfolio dropdown */}
              <div
                className={`nav-dropdown-wrap ${isPortfolioActive ? 'active' : ''}`}
                onMouseEnter={() => setPortfolioDropOpen(true)}
                onMouseLeave={() => setPortfolioDropOpen(false)}
              >
                <button className={`nav-link nav-dropdown-trigger ${isPortfolioActive ? 'active' : ''}`}>
                  Portfolio <ChevronDown size={14} />
                </button>
                {portfolioDropOpen && (
                  <div className="nav-dropdown">
                    {portfolioLinks.map(link => (
                      <button
                        key={link.path}
                        className={`nav-dropdown-item ${location.pathname === link.path ? 'active' : ''}`}
                        onClick={() => { navigate(link.path); setPortfolioDropOpen(false); setMenuOpen(false); }}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn-ghost nav-logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </>
        )}

        {!isLoggedIn && (
          <button className="btn-primary" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
