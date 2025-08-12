import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { lawpayConfig } from '../../services/environmentService';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * LawPayIntegration component
 * Manages LawPay integration settings and operations
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const LawPayIntegration = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Not connected',
    lastTested: null
  });
  
  // Import data state
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [apiKey, setApiKey] = useState(lawpayConfig.apiKey || '');
  const [apiSecret, setApiSecret] = useState(lawpayConfig.apiSecret ? '••••••••••••••••' : '');
  const [environment, setEnvironment] = useState(lawpayConfig.environment || 'sandbox');
  
  // Check connection on mount
  useEffect(() => {
    if (lawpayConfig.apiKey && lawpayConfig.apiSecret) {
      setConnectionStatus({
        connected: true,
        message: `✅ LawPay ${lawpayConfig.environment} connection successful!`,
        lastTested: new Date()
      });
    }
  }, []);
  
  // Test LawPay connection
  const testConnection = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate successful connection
      setConnectionStatus({
        connected: true,
        message: `✅ LawPay ${environment} connection successful!`,
        lastTested: new Date()
      });
      
      addNotification('LawPay connection successful', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error testing LawPay connection:', error);
      
      setConnectionStatus({
        connected: false,
        message: `❌ LawPay connection failed: ${error.message}`,
        lastTested: new Date()
      });
      
      addNotification('Error connecting to LawPay', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Import data from LawPay
  const importData = async () => {
    if (!connectionStatus.connected) {
      addNotification('Please connect to LawPay first', NotificationType.WARNING);
      return;
    }
    
    if (!window.confirm('This will import clients and transactions from LawPay. Continue?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Simulate successful import
      const result = {
        clients: { imported: 5, errors: 0 },
        transactions: { imported: 12, errors: 0 },
        message: '✅ Import complete!',
        timestamp: new Date()
      };
      
      setImportResult(result);
      addNotification('Data imported successfully from LawPay', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error importing LawPay data:', error);
      
      setImportResult({
        error: `Import failed: ${error.message}`,
        timestamp: new Date()
      });
      
      addNotification('Error importing data from LawPay', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would update your environment variables
    // or call your backend to update the settings
    
    addNotification('LawPay settings saved', NotificationType.SUCCESS);
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
      
      <h2 className="section-title">LawPay Integration</h2>
      
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
            
            <button 
              onClick={importData}
              className="button"
              disabled={loading || !connectionStatus.connected}
            >
              {loading ? 'Importing...' : '📥 Import Data'}
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
              <strong>Environment:</strong> {environment}
            </div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>API Version:</strong> v1
            </div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Last Sync:</strong> {importResult?.timestamp ? 
                importResult.timestamp.toLocaleString() : 'Never'}
            </div>
          </div>
          
          <form>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input 
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="form-input"
                placeholder="Enter LawPay API Key"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">API Secret</label>
              <input 
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="form-input"
                placeholder="Enter LawPay API Secret"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Environment</label>
              <select 
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="form-select"
              >
                <option value="sandbox">Sandbox (Testing)</option>
                <option value="production">Production</option>
              </select>
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
      
      {/* Import History */}
      <div className="card mt-lg">
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
          Recent Import Activity
        </h3>
        
        {importResult?.error ? (
          <div className="auth-error">
            <p>{importResult.error}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Records</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {importResult ? (
                  <>
                    <tr className="table-row">
                      <td className="table-cell">
                        {importResult.timestamp.toLocaleDateString()}
                      </td>
                      <td className="table-cell">Clients</td>
                      <td className="table-cell">{importResult.clients.imported}</td>
                      <td className="table-cell">
                        <span className="badge badge-success">Success</span>
                      </td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell">
                        {importResult.timestamp.toLocaleDateString()}
                      </td>
                      <td className="table-cell">Transactions</td>
                      <td className="table-cell">{importResult.transactions.imported}</td>
                      <td className="table-cell">
                        <span className="badge badge-success">Success</span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="4" className="table-cell">
                      <div className="text-center" style={{ padding: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
                        <p>No import history available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawPayIntegration;