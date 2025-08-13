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
    <div className="main">
      <div className="flex items-center mb-lg">
        <button 
          onClick={onBack}
          className="button button-outline"
        >
          <ChevronLeft size={16} />
          Back to Integrations
        </button>
      </div>
      
      <h2 className="section-title">RingCentral Integration</h2>
      
      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Connection Status */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
            Connection Status
          </h3>
          
          <div style={{
            padding: 'var(--space-md)',
            backgroundColor: connectionStatus.connected ? '#d1fae5' : '#fee2e2',
            color: connectionStatus.connected ? '#065f46' : 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${connectionStatus.connected ? '#86efac' : '#fca5a5'}`,
            marginBottom: 'var(--space-md)'
          }}>
            <div style={{ fontWeight: '500' }}>
              {connectionStatus.message}
            </div>
            {connectionStatus.lastTested && (
              <div style={{ fontSize: 'var(--font-sm)', opacity: '0.8', marginTop: 'var(--space-xs)' }}>
                Last tested: {connectionStatus.lastTested.toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex gap-md">
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
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
            Configuration
          </h3>
          
          <div style={{
            backgroundColor: 'var(--color-background)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-md)'
          }}>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Environment:</strong> Production
            </div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>API Version:</strong> v1.0
            </div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Features:</strong> SMS, Voice Calls
            </div>
          </div>
          
          <form>
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
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
          Usage Statistics
        </h3>
        
        {connectionStatus.connected ? (
          <>
            <div className="grid grid-cols-2 grid-cols-3 gap-lg">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ marginRight: 'var(--space-md)' }}>
                  <MessageSquare size={24} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', color: 'var(--color-text)' }}>
                    {usageStats.smsSent}
                  </div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                    SMS Sent This Month
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ marginRight: 'var(--space-md)' }}>
                  <Phone size={24} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', color: 'var(--color-text)' }}>
                    {usageStats.callsMade}
                  </div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                    Calls Made This Month
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div className="text-center">
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', color: 'var(--color-text)' }}>
                    {usageStats.deliveryRate}%
                  </div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                    Delivery Success Rate
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--color-background)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginTop: 'var(--space-lg)'
            }}>
              <h4 style={{ fontSize: 'var(--font-md)', fontWeight: '600', marginBottom: 'var(--space-sm)' }}>
                Sending Limits
              </h4>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: '0' }}>
                Your current plan allows for up to 1,000 SMS messages and 500 voice minutes per month.
                You've used {usageStats.smsSent} SMS messages and approximately {Math.round(usageStats.callsMade * 3.5)} voice minutes this month.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center" style={{ padding: 'var(--space-2xl)', color: 'var(--color-text-secondary)' }}>
            <p>Connect to RingCentral to view usage statistics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RingCentralIntegration;