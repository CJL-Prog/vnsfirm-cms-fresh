import React, { useState, useEffect } from 'react';
import { ChevronLeft, Slack, MessageSquare, Bell, Hash } from 'lucide-react';
import { slackConfig } from '../../services/environmentService';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * SlackIntegration component
 * Manages Slack integration for team communication and workflow automation
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const SlackIntegration = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Not connected',
    lastTested: null
  });
  
  // Activity statistics
  const [activityStats, setActivityStats] = useState({
    messagesMonitored: 0,
    cardsCreated: 0,
    keywordMatches: 0
  });
  
  // Channel and keyword management
  const [channels, setChannels] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  
  // Form state
  const [botToken, setBotToken] = useState(slackConfig?.botToken || '');
  const [signingSecret, setSigningSecret] = useState(slackConfig?.signingSecret ? '••••••••••••••••' : '');
  const [webhookUrl] = useState('https://your-app.com/webhooks/slack');
  const [autoCreateCards, setAutoCreateCards] = useState(slackConfig?.autoCreateCards || true);
  const [loading, setLoading] = useState(false);
  
  // Load configuration and check connection on mount
  useEffect(() => {
    if (slackConfig?.botToken && slackConfig?.signingSecret) {
      setConnectionStatus({
        connected: true,
        message: '✅ Slack connection successful!',
        lastTested: new Date()
      });
      
      // Simulate activity statistics
      setActivityStats({
        messagesMonitored: 247,
        cardsCreated: 18,
        keywordMatches: 42
      });
      
      // Simulate channel data
      setChannels([
        {
          id: 'C1234567890',
          name: 'client-intake',
          memberCount: 8,
          status: 'active'
        },
        {
          id: 'C2345678901',
          name: 'retainer-requests',
          memberCount: 5,
          status: 'active'
        },
        {
          id: 'C3456789012',
          name: 'urgent-cases',
          memberCount: 12,
          status: 'pending'
        }
      ]);
      
      // Simulate keyword data
      setKeywords([
        'new client',
        'retainer needed',
        'urgent case',
        'consultation booked'
      ]);
    }
  }, []);
  
  // Test Slack connection
  const testConnection = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate successful connection
      setConnectionStatus({
        connected: true,
        message: '✅ Slack connection successful!',
        lastTested: new Date()
      });
      
      // Simulate activity statistics
      setActivityStats({
        messagesMonitored: 247,
        cardsCreated: 18,
        keywordMatches: 42
      });
      
      addNotification('Slack connection successful', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error testing Slack connection:', error);
      
      setConnectionStatus({
        connected: false,
        message: `❌ Slack connection failed: ${error.message}`,
        lastTested: new Date()
      });
      
      addNotification('Error connecting to Slack', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would update your environment variables
    // or call your backend to update the settings
    
    addNotification('Slack settings saved', NotificationType.SUCCESS);
  };
  
  // Add keyword
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      addNotification('Keyword added successfully', NotificationType.SUCCESS);
    }
  };
  
  // Remove keyword
  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    addNotification('Keyword removed', NotificationType.SUCCESS);
  };
  
  // Sync channels
  const syncChannels = async () => {
    if (!connectionStatus.connected) {
      addNotification('Please connect to Slack first', NotificationType.WARNING);
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      addNotification('Channels synced successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error syncing channels:', error);
      addNotification('Error syncing channels', NotificationType.ALERT);
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
      
      <h2 className="section-title">Slack Integration</h2>
      
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
              onClick={syncChannels}
              className="button button-secondary"
              disabled={loading || !connectionStatus.connected}
            >
              {loading ? 'Syncing...' : '#️⃣ Sync Channels'}
            </button>
          </div>
        </div>
        
        {/* Configuration */}
        <div className="card">
          <h3 className="mb-md">Configuration</h3>
          
          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="mb-sm">
              <strong>Bot Scopes:</strong> channels:read, chat:write
            </div>
            <div className="mb-sm">
              <strong>Webhook URL:</strong> {webhookUrl}
            </div>
            <div>
              <strong>Event Subscriptions:</strong> Enabled
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Bot User OAuth Token</label>
            <input 
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="form-input"
              placeholder="xoxb-your-bot-token"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Signing Secret</label>
            <input 
              type="password"
              value={signingSecret}
              onChange={(e) => setSigningSecret(e.target.value)}
              className="form-input"
              placeholder="Your app's signing secret"
            />
          </div>
          
          <div className="form-group">
            <label className="flex items-center gap-sm">
              <input 
                type="checkbox"
                checked={autoCreateCards}
                onChange={(e) => setAutoCreateCards(e.target.checked)}
              />
              <span style={{ fontSize: 'var(--font-sm)' }}>
                Enable automatic Trello card creation from Slack messages
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
      
      {/* Activity Statistics */}
      <div className="card mt-lg">
        <h3 className="mb-md">Activity Statistics</h3>
        
        {connectionStatus.connected ? (
          <div className="grid grid-cols-1 grid-cols-3 gap-md">
            <div className="text-center">
              <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }}>
                <MessageSquare size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {activityStats.messagesMonitored}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Messages Monitored
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-sm)' }}>
                <Bell size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {activityStats.keywordMatches}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Keyword Matches
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ color: 'var(--color-secondary)', marginBottom: 'var(--space-sm)' }}>
                <Hash size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {activityStats.cardsCreated}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Cards Created
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              Connect to Slack to view activity statistics
            </p>
          </div>
        )}
      </div>
      
      {/* Monitored Channels */}
      <div className="card mt-lg">
        <h3 className="mb-md">Monitored Channels</h3>
        
        {connectionStatus.connected && channels.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Channel Name</th>
                  <th className="table-header-cell">Channel ID</th>
                  <th className="table-header-cell">Members</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel) => (
                  <tr key={channel.id} className="table-row">
                    <td className="table-cell">#{channel.name}</td>
                    <td className="table-cell">
                      <code style={{ 
                        fontSize: 'var(--font-xs)', 
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--color-background)',
                        padding: '2px 4px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {channel.id}
                      </code>
                    </td>
                    <td className="table-cell">{channel.memberCount}</td>
                    <td className="table-cell">
                      <span className={`badge ${
                        channel.status === 'active' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {channel.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button className="button button-outline" style={{ padding: 'var(--space-xs) var(--space-sm)' }}>
                        {channel.status === 'active' ? 'Configure' : 'Activate'}
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
                ? 'No channels found. Join channels in your Slack workspace.'
                : 'Connect to Slack to view and monitor channels'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Keyword Management */}
      <div className="card mt-lg">
        <h3 className="mb-md">Trigger Keywords</h3>
        
        <div className="flex gap-sm mb-md">
          <input 
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            className="form-input"
            placeholder="Add keyword to monitor (e.g., 'new client')"
            style={{ flex: 1 }}
          />
          <button 
            onClick={addKeyword}
            className="button button-success"
            disabled={!newKeyword.trim()}
          >
            Add Keyword
          </button>
        </div>
        
        {keywords.length > 0 ? (
          <div className="flex gap-sm flex-wrap">
            {keywords.map((keyword, index) => (
              <div key={index} className="badge badge-info flex items-center gap-xs">
                <span>{keyword}</span>
                <button 
                  onClick={() => removeKeyword(keyword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              No keywords configured. Add keywords to trigger automations.
            </p>
          </div>
        )}
        
        <div className="card mt-md" style={{ backgroundColor: 'var(--color-background)' }}>
          <h4 className="mb-sm">How Keywords Work</h4>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
            When any of these keywords are mentioned in monitored channels, our system will:
          </p>
          <ul style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 'var(--space-lg)' }}>
            <li>Parse the message for client information</li>
            <li>Extract name, phone, and email if available</li>
            <li>Create a Trello card in the appropriate board</li>
            <li>Notify your team of the new client request</li>
          </ul>
        </div>
      </div>
      
      {/* Automation Flow */}
      {autoCreateCards && (
        <div className="card mt-lg">
          <h3 className="mb-md">Slack → Trello Automation Flow</h3>
          
          <div className="flex items-center gap-md mb-md">
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#f3e8ff', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <MessageSquare size={20} style={{ color: 'var(--color-info)' }} />
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                  Message Detected
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                  Keyword trigger activated
                </div>
              </div>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#fef3c7', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <Bell size={20} style={{ color: 'var(--color-warning)' }} />
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                  Parse Client Info
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                  Extract name, phone, email
                </div>
              </div>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#dbeafe', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <Hash size={20} style={{ color: 'var(--color-secondary)' }} />
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                  Create Trello Card
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                  Add to appropriate board
                </div>
              </div>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#dcfce7', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <Bell size={20} style={{ color: 'var(--color-success)' }} />
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                  Notify Team
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                  Send confirmation message
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" style={{ backgroundColor: 'var(--color-background)' }}>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
              This automation reduces manual work by automatically creating Trello cards from 
              Slack conversations about new clients, ensuring no leads are missed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlackIntegration;