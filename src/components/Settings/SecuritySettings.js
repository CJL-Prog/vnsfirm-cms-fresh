import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Eye, EyeOff, Shield, Save, Clock, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * SecuritySettings component
 * Manages password, 2FA, and security preferences
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const SecuritySettings = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    sessionTimeout: 480, // minutes
    customTimeout: false, // whether using a custom timeout value
    loginNotifications: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expiryTime, setExpiryTime] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);
  const [showTimeoutInfo, setShowTimeoutInfo] = useState(false);

  // Calculate session expiry time whenever timeout changes
  useEffect(() => {
    const now = new Date();
    const expiry = new Date(now.getTime() + securityData.sessionTimeout * 60 * 1000);
    const timeString = expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setExpiryTime(timeString);
  }, [securityData.sessionTimeout]);

  // For demonstration purposes - show a countdown when less than 5 minutes remain
  useEffect(() => {
    // This would typically use the actual session time remaining from auth context
    const intervalId = setInterval(() => {
      // Simulate random remaining time between 0-10 minutes for demo purposes
      if (Math.random() < 0.3) { // 30% chance to show the countdown
        setRemainingTime(Math.floor(Math.random() * 5));
      } else {
        setRemainingTime(null);
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      addNotification('Passwords do not match', NotificationType.ALERT);
      return;
    }

    if (securityData.newPassword.length < 8) {
      addNotification('Password must be at least 8 characters', NotificationType.ALERT);
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      addNotification('Password updated successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error updating password:', error);
      addNotification('Error updating password', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addNotification('Security settings updated successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error updating security settings:', error);
      addNotification('Error updating security settings', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

  const toggle2FA = () => {
    setSecurityData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    addNotification(`Two-Factor Authentication ${securityData.twoFactorEnabled ? 'disabled' : 'enabled'}`, NotificationType.INFO);
  };

  const handleTimeoutChange = (e) => {
    const value = parseInt(e.target.value);
    setSecurityData(prev => ({ 
      ...prev, 
      sessionTimeout: value,
      customTimeout: false 
    }));
  };

  const handleCustomTimeoutChange = (e) => {
    let value = parseInt(e.target.value);
    
    // Validation
    if (isNaN(value) || value < 5) {
      value = 5; // Minimum 5 minutes
    } else if (value > 10080) {
      value = 10080; // Maximum 7 days (10080 minutes)
    }
    
    setSecurityData(prev => ({ 
      ...prev, 
      sessionTimeout: value 
    }));
  };

  const toggleCustomTimeout = () => {
    setSecurityData(prev => ({ 
      ...prev, 
      customTimeout: !prev.customTimeout 
    }));
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSecurityData(prev => ({ 
      ...prev, 
      sessionTimeout: value,
      customTimeout: false
    }));
  };

  const getTimeoutDisplay = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return '1 hour';
    } else if (minutes < 1440) {
      return `${minutes / 60} hours`;
    } else {
      return `${minutes / 1440} days`;
    }
  };

  const getTimeoutSecurityLevel = () => {
    if (securityData.sessionTimeout <= 60) return { level: 'High', color: 'var(--color-success)' };
    if (securityData.sessionTimeout <= 240) return { level: 'Medium', color: 'var(--color-info)' };
    if (securityData.sessionTimeout <= 480) return { level: 'Standard', color: 'var(--color-warning)' };
    return { level: 'Low', color: 'var(--color-error)' };
  };

  const securityLevel = getTimeoutSecurityLevel();

  return (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={onBack}
          className="button button-outline mb-lg"
        >
          <ChevronLeft size={16} />
          Back to Settings
        </button>
        
        <h2 className="section-title">Security Settings</h2>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Password Change */}
        <div className="card">
          <h3 className="mb-md">Change Password</h3>

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="form-input"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="form-input"
            />
          </div>

          <button 
            onClick={handlePasswordChange}
            disabled={loading || !securityData.currentPassword || !securityData.newPassword}
            className="button button-success"
          >
            <Lock size={16} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>

        {/* Security Options */}
        <div className="card">
          <h3 className="mb-md">Security Options</h3>

          {/* Two-Factor Authentication */}
          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex justify-between items-center mb-sm">
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Two-Factor Authentication
              </span>
              <span className={`badge ${securityData.twoFactorEnabled ? 'badge-success' : 'badge-warning'}`}>
                {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)', 
              marginBottom: 'var(--space-sm)' 
            }}>
              Add an extra layer of security to your account
            </p>
            <button 
              onClick={toggle2FA}
              className={`button ${securityData.twoFactorEnabled ? 'button-warning' : 'button-success'}`}
            >
              <Shield size={16} />
              {securityData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {/* Enhanced Session Timeout */}
          <div className="form-group">
            <div className="flex items-center justify-between">
              <label className="form-label">Session Timeout</label>
              <button 
                onClick={() => setShowTimeoutInfo(!showTimeoutInfo)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-info)'
                }}
              >
                <Info size={16} />
              </button>
            </div>
            
            {showTimeoutInfo && (
              <div className="card p-sm mb-sm" style={{ backgroundColor: 'var(--color-info-light)' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                  Session timeout determines how long you can remain inactive before being automatically logged out. 
                  A shorter timeout provides better security but may require logging in more frequently.
                </p>
              </div>
            )}

            {/* Slider for visual selection */}
            <div className="mb-md">
              <input
                type="range"
                min="5"
                max="1440"
                step="5"
                value={securityData.sessionTimeout}
                onChange={handleSliderChange}
                className="w-full"
                style={{ cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>5m</span>
                <span>1h</span>
                <span>4h</span>
                <span>8h</span>
                <span>24h</span>
              </div>
            </div>

            {/* Dropdown for preset values */}
            {!securityData.customTimeout && (
              <select 
                value={securityData.sessionTimeout}
                onChange={handleTimeoutChange}
                className="form-select mb-sm"
              >
                <option value={5}>5 minutes (Most secure)</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
                <option value={1440}>24 hours</option>
                <option value={4320}>3 days</option>
                <option value={10080}>7 days (Least secure)</option>
              </select>
            )}

            {/* Custom timeout input */}
            <div className="flex items-center mb-sm">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={securityData.customTimeout}
                  onChange={toggleCustomTimeout}
                />
                <span style={{ fontSize: 'var(--font-sm)' }}>
                  Custom timeout
                </span>
              </label>
            </div>

            {securityData.customTimeout && (
              <div className="flex items-center gap-sm mb-sm">
                <input 
                  type="number"
                  min="5"
                  max="10080"
                  value={securityData.sessionTimeout}
                  onChange={handleCustomTimeoutChange}
                  className="form-input"
                  style={{ width: '100px' }}
                />
                <span>minutes</span>
              </div>
            )}

            {/* Session expiry preview */}
            <div className="flex items-center mb-md" style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-background-alt)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Clock size={14} style={{ marginRight: 'var(--space-sm)' }} />
              With current settings, your session would expire at {expiryTime} if left inactive
            </div>

            {/* Security level indicator */}
            <div className="flex items-center justify-between mb-md">
              <span style={{ fontSize: 'var(--font-sm)' }}>Security Level:</span>
              <span style={{ 
                color: securityLevel.color,
                fontWeight: '500',
                fontSize: 'var(--font-sm)'
              }}>
                {securityLevel.level}
              </span>
            </div>
          </div>

          {/* Session expiry warning - only shows when time is running low */}
          {remainingTime !== null && (
            <div className="card mb-md" style={{ 
              backgroundColor: 'var(--color-warning-light)',
              border: '1px solid var(--color-warning)'
            }}>
              <div className="flex items-center">
                <AlertTriangle size={16} style={{ 
                  color: 'var(--color-warning)',
                  marginRight: 'var(--space-sm)'
                }} />
                <span style={{ fontSize: 'var(--font-sm)' }}>
                  Your session will expire in {remainingTime} {remainingTime === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
              <button 
                className="button button-sm button-outline mt-sm"
                style={{ width: '100%' }}
                onClick={() => setRemainingTime(null)}
              >
                Keep me logged in
              </button>
            </div>
          )}

          {/* Login Notifications */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={securityData.loginNotifications}
                onChange={(e) => setSecurityData(prev => ({ ...prev, loginNotifications: e.target.checked }))}
              />
              <span style={{ fontSize: 'var(--font-sm)' }}>
                Email me about new login attempts
              </span>
            </label>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="button button-success"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Security Settings'}
          </button>
        </div>
      </div>

      {/* Security Status */}
      <div className="card mt-lg">
        <h3 className="mb-md">Security Status</h3>
        
        <div className="grid grid-cols-1 grid-cols-3 gap-md">
          <div className="text-center">
            <div style={{ 
              color: securityData.twoFactorEnabled ? 'var(--color-success)' : 'var(--color-warning)',
              fontSize: 'var(--font-xl)',
              marginBottom: 'var(--space-sm)'
            }}>
              <Shield size={32} />
            </div>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
              Two-Factor Auth
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              {securityData.twoFactorEnabled ? 'Protected' : 'Not Protected'}
            </div>
          </div>

          <div className="text-center">
            <div style={{ 
              color: 'var(--color-success)',
              fontSize: 'var(--font-xl)',
              marginBottom: 'var(--space-sm)'
            }}>
              <Lock size={32} />
            </div>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
              Password
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Strong
            </div>
          </div>

          <div className="text-center">
            <div style={{ 
              color: securityLevel.color,
              fontSize: 'var(--font-xl)',
              marginBottom: 'var(--space-sm)'
            }}>
              <Clock size={32} />
            </div>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
              Session Timeout
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              {getTimeoutDisplay(securityData.sessionTimeout)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;