import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ForgotPassword component
 * Handles password reset requests
 */
const ForgotPassword = ({ onModeChange }) => {
  const { resetPassword, authError, clearErrors } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await resetPassword(email);
      setSuccess(true);
      
      // Optionally redirect after a delay
      setTimeout(() => {
        onModeChange('login');
      }, 5000);
    } catch (error) {
      // Error is handled by AuthContext
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear errors when switching modes
  const handleModeChange = (mode) => {
    clearErrors();
    onModeChange(mode);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">
        <p className="forgot-text">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            'Sending Reset Email...'
          ) : (
            <>
              <Mail className="login-icon" />
              Send Reset Email
            </>
          )}
        </button>
        
        {success && (
          <div className="auth-success">
            Password reset email sent! Please check your inbox.
          </div>
        )}
        
        {(error || authError) && (
          <div className="auth-error">
            {error || authError}
          </div>
        )}
      </form>
      
      <div className="auth-links">
        <button 
          onClick={() => handleModeChange('login')}
          className="link-button"
        >
          ← Back to Sign In
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;