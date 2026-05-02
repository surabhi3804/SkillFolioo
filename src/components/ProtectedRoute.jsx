import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useApp();

  // Wait for token check to finish before redirecting
  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0F172A', color: '#fff', fontSize: '1rem' }}>
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  return children;
};

export default ProtectedRoute;