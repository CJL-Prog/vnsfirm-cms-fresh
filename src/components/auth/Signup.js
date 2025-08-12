import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Signup component
 * Handles new user registration
 */
const Signup = ({ onModeChange }) => {
  const { signUp, authError, clearErrors } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(
        formData.email, 
        formData.password, 
        {
          full_name: formData.fullName,
          company_name: formData.companyName,
        }
      );
      
      // Show success message and redirect to login
      alert('Account created successfully! Please check your email to verify your account.');
      onModeChange('login');
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
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company/Firm Name"
          value={formData.companyName}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
          minLength={6}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            'Creating Account...'
          ) : (
            <>
              <User className="login-icon" />
              Create Account
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
          onClick={() => handleModeChange('login')}
          className="link-button"
        >
          ← Back to Sign In
        </button>
      </div>
    </>
  );
};

export default Signup;