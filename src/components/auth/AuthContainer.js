import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

/**
 * AuthContainer component
 * Manages authentication UI modes (login, signup, forgot password)
 */
const AuthContainer = () => {
  const [authMode, setAuthMode] = useState('login');

  // Get the appropriate component based on auth mode
  const renderAuthComponent = () => {
    switch (authMode) {
      case 'signup':
        return <Signup onModeChange={setAuthMode} />;
      case 'forgot':
        return <ForgotPassword onModeChange={setAuthMode} />;
      case 'login':
      default:
        return <Login onModeChange={setAuthMode} />;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">VNS Firm</h1>
        <p className="auth-subtitle">Client Management System</p>
        
        {renderAuthComponent()}
      </div>
    </div>
  );
};

export default AuthContainer;