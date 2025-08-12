import React, { useState } from 'react';
import { ChevronLeft, Lock, Eye, EyeOff, Shield, Save } from 'lucide-react';
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
    loginNotifications: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

          {/* Session Timeout */}
          <div className="form-group">
            <label className="form-label">Session Timeout</label>
            <select 
              value={securityData.sessionTimeout}
              onChange={(e) => setSecurityData(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="form-select"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours</option>
              <option value={1440}>24 hours</option>
            </select>
          </div>

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
              color: 'var(--color-info)',
              fontSize: 'var(--font-xl)',
              marginBottom: 'var(--space-sm)'
            }}>
              <Eye size={32} />
            </div>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
              Session Timeout
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              {securityData.sessionTimeout} minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;