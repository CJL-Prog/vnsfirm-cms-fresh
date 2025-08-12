import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Login component
 * Handles user authentication via email/password
 */
const Login = ({ onModeChange }) => {
  const { signIn, authError, clearErrors } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      // Authentication successful - AuthContext will update the user state
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            'Signing in...'
          ) : (
            <>
              <Lock className="login-icon" />
              Sign In
            </>
          )}
        </button>
        
        {(error || authError) && (
          <div className="auth-error">
            {error || authError}
          </div>
        )}
      </form>
      
      <div className="auth-links">
        <button 
          onClick={() => handleModeChange('forgot')}
          className="link-button"
        >
          Forgot Password?
        </button>
        <span className="auth-divider">•</span>
        <button 
          onClick={() => handleModeChange('signup')}
          className="link-button"
        >
          Create Account
        </button>
      </div>
    </>
  );
};

export default Login;