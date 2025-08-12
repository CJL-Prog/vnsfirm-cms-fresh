import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileSignature, CheckCircle, Clock } from 'lucide-react';
import { docusignConfig } from '../../services/environmentService';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * DocusignIntegration component
 * Manages DocuSign integration for digital signatures and document automation
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const DocusignIntegration = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Not connected',
    lastTested: null
  });
  
  // Document statistics
  const [docStats, setDocStats] = useState({
    documentsSent: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });
  
  // Template management
  const [templates, setTemplates] = useState([]);
  
  // Form state
  const [accountId, setAccountId] = useState(docusignConfig?.accountId || '');
  const [integrationKey, setIntegrationKey] = useState(docusignConfig?.integrationKey ? '••••••••••••••••' : '');
  const [secretKey, setSecretKey] = useState(docusignConfig?.secretKey ? '••••••••••••••••' : '');
  const [environment, setEnvironment] = useState(docusignConfig?.environment || 'demo');
  const [webhookUrl] = useState('https://your-app.com/webhooks/docusign');
  const [autoWorkflow, setAutoWorkflow] = useState(docusignConfig?.autoWorkflow || true);
  const [loading, setLoading] = useState(false);
  
  // Load configuration and check connection on mount
  useEffect(() => {
    if (docusignConfig?.accountId && docusignConfig?.integrationKey) {
      setConnectionStatus({
        connected: true,
        message: '✅ DocuSign connection successful!',
        lastTested: new Date()
      });
      
      // Simulate document statistics
      setDocStats({
        documentsSent: 34,
        completed: 29,
        pending: 5,
        completionRate: 85
      });
      
      // Simulate template data
      setTemplates([
        {
          id: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
          name: 'OC Criminal Defense Retainer',
          location: 'OC',
          type: 'Criminal Defense',
          status: 'active'
        },
        {
          id: '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
          name: 'LA Personal Injury Retainer',
          location: 'LA',
          type: 'Personal Injury',
          status: 'active'
        },
        {
          id: '3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
          name: 'Vegas Family Law Retainer',
          location: 'Vegas',
          type: 'Family Law',
          status: 'setup_required'
        }
      ]);
    }
  }, []);
  
  // Test DocuSign connection
  const testConnection = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate successful connection
      setConnectionStatus({
        connected: true,
        message: `✅ DocuSign ${environment} connection successful!`,
        lastTested: new Date()
      });
      
      // Simulate document statistics
      setDocStats({
        documentsSent: 34,
        completed: 29,
        pending: 5,
        completionRate: 85
      });
      
      addNotification('DocuSign connection successful', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error testing DocuSign connection:', error);
      
      setConnectionStatus({
        connected: false,
        message: `❌ DocuSign connection failed: ${error.message}`,
        lastTested: new Date()
      });
      
      addNotification('Error connecting to DocuSign', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would update your environment variables
    // or call your backend to update the settings
    
    addNotification('DocuSign settings saved', NotificationType.SUCCESS);
  };
  
  // Sync templates
  const syncTemplates = async () => {
    if (!connectionStatus.connected) {
      addNotification('Please connect to DocuSign first', NotificationType.WARNING);
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      addNotification('Templates synced successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error syncing templates:', error);
      addNotification('Error syncing templates', NotificationType.ALERT);
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
      
      <h2 className="section-title">DocuSign Integration</h2>
      
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
              {loading ? 'Syncing...' : '📄 Sync Templates'}
            </button>
          </div>
        </div>
        
        {/* Configuration */}
        <div className="card">
          <h3 className="mb-md">Configuration</h3>
          
          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="mb-sm">
              <strong>Environment:</strong> {environment}
            </div>
            <div className="mb-sm">
              <strong>API Version:</strong> v2.1
            </div>
            <div>
              <strong>Webhook URL:</strong> {webhookUrl}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">DocuSign Account ID</label>
            <input 
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="form-input"
              placeholder="Enter your DocuSign Account ID"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Integration Key</label>
            <input 
              type="password"
              value={integrationKey}
              onChange={(e) => setIntegrationKey(e.target.value)}
              className="form-input"
              placeholder="Your DocuSign Integration Key"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Secret Key</label>
            <input 
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="form-input"
              placeholder="Your DocuSign Secret Key"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Environment</label>
            <select 
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="form-select"
            >
              <option value="demo">Demo (Testing)</option>
              <option value="production">Production</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="flex items-center gap-sm">
              <input 
                type="checkbox"
                checked={autoWorkflow}
                onChange={(e) => setAutoWorkflow(e.target.checked)}
              />
              <span style={{ fontSize: 'var(--font-sm)' }}>
                Auto-trigger workflow on retainer completion
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
      
      {/* Document Statistics */}
      <div className="card mt-lg">
        <h3 className="mb-md">Document Statistics</h3>
        
        {connectionStatus.connected ? (
          <div className="grid grid-cols-1 grid-cols-4 gap-md">
            <div className="text-center">
              <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }}>
                <FileSignature size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {docStats.documentsSent}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Documents Sent
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }}>
                <CheckCircle size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {docStats.completed}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Completed
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-sm)' }}>
                <Clock size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {docStats.pending}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Pending
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {docStats.completionRate}%
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Completion Rate
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              Connect to DocuSign to view document statistics
            </p>
          </div>
        )}
      </div>
      
      {/* Templates Management */}
      <div className="card mt-lg">
        <h3 className="mb-md">Retainer Templates</h3>
        
        {connectionStatus.connected && templates.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Template Name</th>
                  <th className="table-header-cell">Location</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Template ID</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.id} className="table-row">
                    <td className="table-cell">{template.name}</td>
                    <td className="table-cell">{template.location}</td>
                    <td className="table-cell">{template.type}</td>
                    <td className="table-cell">
                      <code style={{ 
                        fontSize: 'var(--font-xs)', 
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--color-background)',
                        padding: '2px 4px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {template.id.substring(0, 8)}...
                      </code>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${
                        template.status === 'active' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {template.status === 'active' ? 'Active' : 'Setup Required'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button className="button button-outline" style={{ padding: 'var(--space-xs) var(--space-sm)' }}>
                        {template.status === 'active' ? 'Edit Mapping' : 'Setup Template'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              {connectionStatus.connected 
                ? 'No templates found. Add templates in your DocuSign account.'
                : 'Connect to DocuSign to view and manage templates'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Automation Workflow */}
      {autoWorkflow && (
        <div className="card mt-lg">
          <h3 className="mb-md">Retainer Completion Workflow</h3>
          
          <div className="flex items-center gap-md mb-md">
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#dcfce7', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <FileSignature size={20} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500', color: 'var(--color-success)' }}>
                Retainer Signed
              </span>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#dbeafe', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <CheckCircle size={20} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500', color: 'var(--color-secondary)' }}>
                Client Created/Updated
              </span>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#fef3c7', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <Clock size={20} style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500', color: 'var(--color-warning)' }}>
                Payment Setup Ready
              </span>
            </div>
          </div>
          
          <div className="card" style={{ backgroundColor: 'var(--color-background)' }}>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
              When a retainer is completed in DocuSign, this workflow automatically updates your CRM, 
              creates or updates Trello cards, and prepares payment information for LawPay setup.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocusignIntegration;