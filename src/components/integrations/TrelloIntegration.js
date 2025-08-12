import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trello, Users, Calendar, CheckCircle } from 'lucide-react';
import { trelloConfig } from '../../services/environmentService';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * TrelloIntegration component
 * Manages Trello integration for project management and client tracking
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const TrelloIntegration = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Not connected',
    lastTested: null
  });
  
  // Board statistics
  const [boardStats, setboardStats] = useState({
    cardsCreated: 0,
    cardsCompleted: 0,
    activeCards: 0
  });
  
  // Board management
  const [boards, setBoards] = useState([]);
  
  // Form state
  const [apiKey, setApiKey] = useState(trelloConfig?.apiKey || '');
  const [accessToken, setAccessToken] = useState(trelloConfig?.accessToken ? '••••••••••••••••' : '');
  const [newClientList, setNewClientList] = useState(trelloConfig?.newClientList || 'New Leads');
  const [retainerSentList, setRetainerSentList] = useState(trelloConfig?.retainerSentList || 'Retainer Sent');
  const [activeClientList, setActiveClientList] = useState(trelloConfig?.activeClientList || 'Active');
  const [autoCreateFromSlack, setAutoCreateFromSlack] = useState(trelloConfig?.autoCreateFromSlack || true);
  const [autoMoveOnRetainer, setAutoMoveOnRetainer] = useState(trelloConfig?.autoMoveOnRetainer || true);
  const [addDueDates, setAddDueDates] = useState(trelloConfig?.addDueDates || false);
  const [loading, setLoading] = useState(false);
  
  // Load configuration and check connection on mount
  useEffect(() => {
    if (trelloConfig?.apiKey && trelloConfig?.accessToken) {
      setConnectionStatus({
        connected: true,
        message: '✅ Trello connection successful!',
        lastTested: new Date()
      });
      
      // Simulate board statistics
      setboardStats({
        cardsCreated: 156,
        cardsCompleted: 89,
        activeCards: 67
      });
      
      // Simulate board data
      setBoards([
        {
          id: '5e4b2c8d9f3a1b7c6e5d4f2a',
          name: 'OC Clients',
          location: 'OC',
          cardCount: 23,
          status: 'connected'
        },
        {
          id: '6f5c3d9e0a4b2c8d7f6e5d3b',
          name: 'LA Clients',
          location: 'LA',
          cardCount: 31,
          status: 'connected'
        },
        {
          id: '7g6d4e0f1b5c3d9e8g7f6e4c',
          name: 'Las Vegas Clients',
          location: 'Vegas',
          cardCount: 13,
          status: 'connected'
        }
      ]);
    }
  }, []);
  
  // Test Trello connection
  const testConnection = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate successful connection
      setConnectionStatus({
        connected: true,
        message: '✅ Trello connection successful!',
        lastTested: new Date()
      });
      
      // Simulate board statistics
      setboardStats({
        cardsCreated: 156,
        cardsCompleted: 89,
        activeCards: 67
      });
      
      addNotification('Trello connection successful', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error testing Trello connection:', error);
      
      setConnectionStatus({
        connected: false,
        message: `❌ Trello connection failed: ${error.message}`,
        lastTested: new Date()
      });
      
      addNotification('Error connecting to Trello', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would update your environment variables
    // or call your backend to update the settings
    
    addNotification('Trello settings saved', NotificationType.SUCCESS);
  };
  
  // Sync boards
  const syncBoards = async () => {
    if (!connectionStatus.connected) {
      addNotification('Please connect to Trello first', NotificationType.WARNING);
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      addNotification('Boards synced successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error syncing boards:', error);
      addNotification('Error syncing boards', NotificationType.ALERT);
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
      
      <h2 className="section-title">Trello Integration</h2>
      
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
              onClick={syncBoards}
              className="button button-secondary"
              disabled={loading || !connectionStatus.connected}
            >
              {loading ? 'Syncing...' : '📋 Sync Boards'}
            </button>
          </div>
        </div>
        
        {/* Configuration */}
        <div className="card">
          <h3 className="mb-md">Configuration</h3>
          
          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="mb-sm">
              <strong>API Version:</strong> v1
            </div>
            <div className="mb-sm">
              <strong>Card Format:</strong> CLIENT NAME - PHONE - EMAIL
            </div>
            <div>
              <strong>Active Boards:</strong> 3
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Trello API Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input"
              placeholder="Enter your Trello API Key"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Access Token</label>
            <input 
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="form-input"
              placeholder="Your Trello Access Token"
            />
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
      
      {/* Board Statistics */}
      <div className="card mt-lg">
        <h3 className="mb-md">Board Activity</h3>
        
        {connectionStatus.connected ? (
          <div className="grid grid-cols-1 grid-cols-3 gap-md">
            <div className="text-center">
              <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }}>
                <Users size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {boardStats.cardsCreated}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Cards Created
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }}>
                <CheckCircle size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {boardStats.cardsCompleted}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Cards Completed
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-sm)' }}>
                <Calendar size={32} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                {boardStats.activeCards}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Active Cards
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              Connect to Trello to view board statistics
            </p>
          </div>
        )}
      </div>
      
      {/* Board Management */}
      <div className="card mt-lg">
        <h3 className="mb-md">Connected Boards</h3>
        
        {connectionStatus.connected && boards.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Board Name</th>
                  <th className="table-header-cell">Location</th>
                  <th className="table-header-cell">Board ID</th>
                  <th className="table-header-cell">Cards</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {boards.map((board) => (
                  <tr key={board.id} className="table-row">
                    <td className="table-cell">{board.name}</td>
                    <td className="table-cell">{board.location}</td>
                    <td className="table-cell">
                      <code style={{ 
                        fontSize: 'var(--font-xs)', 
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--color-background)',
                        padding: '2px 4px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {board.id.substring(0, 8)}...
                      </code>
                    </td>
                    <td className="table-cell">{board.cardCount}</td>
                    <td className="table-cell">
                      <span className="badge badge-success">Connected</span>
                    </td>
                    <td className="table-cell">
                      <button className="button button-outline" style={{ padding: 'var(--space-xs) var(--space-sm)' }}>
                        View Board
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
                ? 'No boards found. Create boards in your Trello account.'
                : 'Connect to Trello to view and manage boards'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* List Flow Configuration */}
      <div className="card mt-lg">
        <h3 className="mb-md">List Flow Configuration</h3>
        
        <div className="grid grid-cols-1 grid-cols-3 gap-md">
          <div className="form-group">
            <label className="form-label">New Client List</label>
            <input 
              type="text"
              value={newClientList}
              onChange={(e) => setNewClientList(e.target.value)}
              className="form-input"
              placeholder="List name for new clients"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Retainer Sent List</label>
            <input 
              type="text"
              value={retainerSentList}
              onChange={(e) => setRetainerSentList(e.target.value)}
              className="form-input"
              placeholder="List name for retainer sent"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Active Client List</label>
            <input 
              type="text"
              value={activeClientList}
              onChange={(e) => setActiveClientList(e.target.value)}
              className="form-input"
              placeholder="List name for active clients"
            />
          </div>
        </div>
        
        <div className="card mt-md" style={{ backgroundColor: 'var(--color-background)' }}>
          <h4 className="mb-sm">Card Naming Convention</h4>
          <div style={{ 
            fontSize: 'var(--font-sm)', 
            fontFamily: 'monospace',
            backgroundColor: 'var(--color-card)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}>
            CLIENT NAME - PHONE NUMBER - EMAIL
          </div>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', margin: '8px 0 0 0' }}>
            All Trello cards will be created with this naming format. Additional details from 
            Slack messages will be added to the card description.
          </p>
        </div>
      </div>
      
      {/* Automation Settings */}
      <div className="card mt-lg">
        <h3 className="mb-md">Automation Settings</h3>
        
        <div className="mb-md">
          <label className="flex items-center gap-sm">
            <input 
              type="checkbox"
              checked={autoCreateFromSlack}
              onChange={(e) => setAutoCreateFromSlack(e.target.checked)}
            />
            <span style={{ fontSize: 'var(--font-sm)' }}>
              Auto-create cards from Slack messages
            </span>
          </label>
        </div>
        
        <div className="mb-md">
          <label className="flex items-center gap-sm">
            <input 
              type="checkbox"
              checked={autoMoveOnRetainer}
              onChange={(e) => setAutoMoveOnRetainer(e.target.checked)}
            />
            <span style={{ fontSize: 'var(--font-sm)' }}>
              Move cards when retainer signed
            </span>
          </label>
        </div>
        
        <div className="mb-md">
          <label className="flex items-center gap-sm">
            <input 
              type="checkbox"
              checked={addDueDates}
              onChange={(e) => setAddDueDates(e.target.checked)}
            />
            <span style={{ fontSize: 'var(--font-sm)' }}>
              Add payment due dates as card due dates
            </span>
          </label>
        </div>
        
        <button 
          onClick={saveSettings}
          className="button button-success mt-md"
        >
          Save Automation Settings
        </button>
        
        <div className="card mt-md" style={{ backgroundColor: 'var(--color-background)' }}>
          <h4 className="mb-sm">Automation Flow</h4>
          <div className="flex items-center gap-md">
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#f3e8ff', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Slack Message
              </span>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                Client request detected
              </div>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#fef3c7', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Parse Info
              </span>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                Extract client details
              </div>
            </div>
            
            <div style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>→</div>
            
            <div className="card flex items-center gap-sm" style={{ 
              backgroundColor: '#dbeafe', 
              padding: 'var(--space-sm)',
              flex: 1
            }}>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Create Card
              </span>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                Add to appropriate board
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrelloIntegration;