import React, { useState, useEffect } from 'react';
import { ChevronLeft, Mail, Send, Users } from 'lucide-react';
import { gmailConfig } from '../../services/environmentService';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * GmailIntegration component
 * Manages Gmail integration for email automation and client communication
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const GmailIntegration = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Not connected',
    lastTested: null
  });
  
  // Email statistics
  const [emailStats, setEmailStats] = useState({
    emailsSent: 0,
    openRate: 0,
    responseRate: 0
  });
  
  // Form state
  const [clientId, setClientId] = useState(gmailConfig?.clientId || '');
  const [clientSecret, setClientSecret] = useState(gmailConfig?.clientSecret ? '••••••••••••••••' : '');
  const [primaryEmail, setPrimaryEmail] = useState(gmailConfig?.primaryEmail || '');
  const [emailSignature, setEmailSignature] = useState(gmailConfig?.signature || '');
  const [autoTracking, setAutoTracking] = useState(gmailConfig?.autoTracking || false);
  const [loading, setLoading] = useState(false);
  
  // Load configuration and check connection on mount
  useEffect(() => {
    if (gmailConfig?.clientId && gmailConfig?.clientSecret) {
      setConnectionStatus({
        connected: true,
        message: '✅ Gmail connection successful!',
        lastTested: new Date()
      });
      
      // Simulate email statistics
      setEmailStats({
        emailsSent: 89,
        openRate: 78,
        responseRate: 45
      });
    }
  }, []);
  
  // Test Gmail connection
  const testConnection = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate successful connection
      setConnectionStatus({
        connected: true,
        message: '✅ Gmail connection successful!',
        lastTested: new Date()
      });
      
      // Simulate email statistics
      setEmailStats({
        emailsSent: 89,
        openRate: 78,
        responseRate: 45
      });
      
      addNotification('Gmail connection successful', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error testing Gmail connection:', error);
      
      setConnectionStatus({
        connected: false,
        message: `❌ Gmail connection failed: ${error.message}`,
        lastTested: new Date()
      });
      
      addNotification('Error connecting to Gmail', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would update your environment variables
    // or call your backend to update the settings
    
    addNotification('Gmail settings saved', NotificationType.SUCCESS);
  };
  
  // Sync email templates
  const syncTemplates = async () => {
    if (!connectionStatus.connected) {
      addNotification('Please connect to Gmail first', NotificationType.WARNING);
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      addNotification('Email templates synced successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error syncing email templates:', error);
      addNotification('Error syncing email templates', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={onBack}
          className="button button-outline mb-lg"
        >
          <ChevronLeft size={16} />
          Back to Integrations
        </button>
      </div>
      
      <h2 className="section-title">Gmail Integration</h2>
      
      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Connection Status */}
        <div className="card">
          <h3 className="mb-md">Connection Status</h3>
          
          <div className={`card ${connectionStatus.connected ? 'badge-success' : 'badge-danger'} mb-md`}
               style={{ backgroundColor: connectionStatus.connected ? '#dcfce7' : '#fee2e2' }}>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
              {connectionStatus.message}
            </div>
            {connectionStatus.lastTested && (
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                Last tested: {connectionStatus.lastTested.toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex gap-sm">
            <button 
              onClick={testConnection}
              className="button button-success"
              disabled={loading}
            >
              {loading ? 'Testing...' : '🧪 Test Connection'}
            </button>
            
            <button 
              onClick={syncTemplates}
              className="button button-secondary"
              disabled={loading || !connectionStatus.connected}
            >
              {loading ? 'Syncing...' : '📧 Sync Templates'}
            </button>
          </div>
        </div>
        
        {/* Configuration */}
        <div className="card">
          <h3 className="mb-md">Configuration</h3>
          
          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="mb-sm">
              <strong>OAuth Scopes:</strong> Gmail API
            </div>
            <div className="mb-sm">
              <strong>API Version:</strong> v1
            </div>
            <div>
              <strong>Features:</strong> Send, Read, Templates
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Google Client ID</label>
            <input 
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="form-input"
              placeholder="Enter Google OAuth Client ID"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Client Secret</label>
            <input 
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="form-input"
              placeholder="Enter Google OAuth Client Secret"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Primary Email Account</label>
            <input 
              type="email"
              value={primaryEmail}
              onChange={(e) => setPrimaryEmail(e.target.value)}
              className="form-input"
              placeholder="your-firm@lawfirm.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Default Email Signature</label>
            <textarea 
              value={emailSignature}
              onChange={(e) => setEmailSignature(e.target.value)}
              className="form-input"
              rows={4}
              placeholder="Your firm's email signature..."
              style={{ resize: 'vertical' }}
            />
          </div>
          
          <div className="form-group">
            <label className="flex items-center gap-sm">
              <input 
                type="checkbox"
                checked={autoTracking}
                onChange={(e) => setAutoTracking(e.target.checked)}
              />
              <span style={{ fontSize: 'var(--font-sm)' }}>
                Enable automatic email tracking
              </span>
            </label>
          </div>
          
          <button 
            type="button"
            onClick={saveSettings}
            className="button button-success"
          >
            Save Settings
          </button>
        </div>
      </div>
      
      {/* Email Statistics */}
      <div className="card mt-lg">
        <h3 className="mb-md">Email Statistics</h3>
        
        {connectionStatus.connected ? (
          <>
            <div className="grid grid-cols-1 grid-cols-3 gap-md">
              <div className="text-center">
                <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }}>
                  <Send size={32} />
                </div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                  {emailStats.emailsSent}
                </div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                  Emails Sent This Month
                </div>
              </div>
              
              <div className="text-center">
                <div style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-sm)' }}>
                  <Mail size={32} />
                </div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                  {emailStats.openRate}%
                </div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                  Open Rate
                </div>
              </div>
              
              <div className="text-center">
                <div style={{ color: 'var(--color-secondary)', marginBottom: 'var(--space-sm)' }}>
                  <Users size={32} />
                </div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                  {emailStats.responseRate}%
                </div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                  Response Rate
                </div>
              </div>
            </div>
            
            <div className="card mt-md" style={{ backgroundColor: 'var(--color-background)' }}>
              <h4 className="mb-sm">Active Email Templates</h4>
              <div className="mb-sm">
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: 'var(--font-sm)' }}>Welcome Email Sequence</span>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
              <div className="mb-sm">
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: 'var(--font-sm)' }}>Payment Reminders</span>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: 'var(--font-sm)' }}>Case Updates</span>
                  <span className="badge badge-warning">Draft</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              Connect to Gmail to view email statistics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GmailIntegration;