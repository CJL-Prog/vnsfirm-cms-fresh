import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Phone } from 'lucide-react';
import { ringCentralConfig } from '../../services/environmentService';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * RingCentralIntegration component
 * Manages RingCentral integration for SMS and voice calls
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const RingCentralIntegration = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Not connected',
    lastTested: null
  });
  
  // Usage statistics
  const [usageStats, setUsageStats] = useState({
    smsSent: 0,
    callsMade: 0,
    deliveryRate: 0
  });
  
  // Form state
  const [clientId, setClientId] = useState(ringCentralConfig.clientId || '');
  const [clientSecret, setClientSecret] = useState(ringCentralConfig.clientSecret ? '••••••••••••••••' : '');
  const [loading, setLoading] = useState(false);
  
  // Load configuration and check connection on mount
  useEffect(() => {
    if (ringCentralConfig.clientId && ringCentralConfig.clientSecret) {
      setConnectionStatus({
        connected: true,
        message: '✅ RingCentral connection successful!',
        lastTested: new Date()
      });
      
      // Simulate usage statistics
      setUsageStats({
        smsSent: 42,
        callsMade: 15,
        deliveryRate: 98
      });
    }
  }, []);
  
  // Test RingCentral connection
  const testConnection = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate successful connection
      setConnectionStatus({
        connected: true,
        message: '✅ RingCentral connection successful!',
        lastTested: new Date()
      });
      
      // Simulate usage statistics
      setUsageStats({
        smsSent: 42,
        callsMade: 15,
        deliveryRate: 98
      });
      
      addNotification('RingCentral connection successful', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error testing RingCentral connection:', error);
      
      setConnectionStatus({
        connected: false,
        message: `❌ RingCentral connection failed: ${error.message}`,
        lastTested: new Date()
      });
      
      addNotification('Error connecting to RingCentral', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would update your environment variables
    // or call your backend to update the settings
    
    addNotification('RingCentral settings saved', NotificationType.SUCCESS);
  };

  return (
    <div className="integration-detail-container">
      <div className="back-button-container">
        <button 
          onClick={onBack}
          className="button button-outline"
        >
          <ChevronLeft size={16} />
          Back to Integrations
        </button>
      </div>
      
      <h2 className="section-title">RingCentral Integration</h2>
      
      <div className="grid grid-cols-1 grid-cols-2">
        {/* Connection Status */}
        <div className="card">
          <h3 className="card-title">Connection Status</h3>
          
          <div className={`connection-status-box ${connectionStatus.connected ? 'connection-status-success' : 'connection-status-error'}`}>
            <div className="connection-status-message">
              {connectionStatus.message}
            </div>
            {connectionStatus.lastTested && (
              <div className="connection-status-timestamp">
                Last tested: {connectionStatus.lastTested.toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="button-group mt-md">
            <button 
              onClick={testConnection}
              className="button button-success"
              disabled={loading}
            >
              {loading ? 'Testing...' : '🧪 Test Connection'}
            </button>
          </div>
        </div>
        
        {/* Configuration */}
        <div className="card">
          <h3 className="card-title">Configuration</h3>
          
          <div className="info-box">
            <div className="info-row">
              <strong>Environment:</strong> Production
            </div>
            <div className="info-row">
              <strong>API Version:</strong> v1.0
            </div>
            <div className="info-row">
              <strong>Features:</strong> SMS, Voice Calls
            </div>
          </div>
          
          <form className="integration-form">
            <div className="form-group">
              <label className="form-label">Client ID</label>
              <input 
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="form-input"
                placeholder="Enter RingCentral Client ID"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Client Secret</label>
              <input 
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="form-input"
                placeholder="Enter RingCentral Client Secret"
              />
            </div>
            
            <button 
              type="button"
              onClick={saveSettings}
              className="button mt-md"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
      
      {/* Usage Statistics */}
      <div className="card mt-lg">
        <h3 className="card-title">Usage Statistics</h3>
        
        {connectionStatus.connected ? (
          <>
            <div className="grid grid-cols-2 grid-cols-3">
              <div className="usage-stat-box">
                <div className="usage-stat-icon">
                  <MessageSquare size={24} color="#059669" />
                </div>
                <div className="usage-stat-content">
                  <div className="usage-stat-value">{usageStats.smsSent}</div>
                  <div className="usage-stat-label">SMS Sent This Month</div>
                </div>
              </div>
              
              <div className="usage-stat-box">
                <div className="usage-stat-icon">
                  <Phone size={24} color="#f59e0b" />
                </div>
                <div className="usage-stat-content">
                  <div className="usage-stat-value">{usageStats.callsMade}</div>
                  <div className="usage-stat-label">Calls Made This Month</div>
                </div>
              </div>
              
              <div className="usage-stat-box">
                <div className="usage-stat-content">
                  <div className="usage-stat-value">{usageStats.deliveryRate}%</div>
                  <div className="usage-stat-label">Delivery Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="info-box mt-md">
              <h4 className="info-title">Sending Limits</h4>
              <p className="info-text">
                Your current plan allows for up to 1,000 SMS messages and 500 voice minutes per month.
                You've used {usageStats.smsSent} SMS messages and approximately {Math.round(usageStats.callsMade * 3.5)} voice minutes this month.
              </p>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Connect to RingCentral to view usage statistics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RingCentralIntegration;