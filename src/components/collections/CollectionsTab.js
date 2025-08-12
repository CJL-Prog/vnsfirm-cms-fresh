import React, { useState } from 'react';
import { FileText, TrendingUp, MessageSquare } from 'lucide-react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import PastDueTable from './PastDueTable';
import CollectionEffortsTable from './CollectionEffortsTable';
import CollectionTemplates from './CollectionTemplates';
import MessageModal from '../common/MessageModal';

/**
 * CollectionsTab component
 * Manages collection activities for past due clients
 */
const CollectionsTab = () => {
  const { pastDueClients, metrics, loadClientProfile } = useClients();
  const { addNotification, NotificationType } = useNotifications();
  
  // Collection view state
  const [collectionView, setCollectionView] = useState('overview'); // 'overview', 'efforts', 'templates'
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messageType, setMessageType] = useState('SMS');
  
  // Handle sending messages
  const handleSendMessage = (client, type) => {
    setSelectedClient(client);
    setMessageType(type);
    setShowMessageModal(true);
  };
  
  // Handle view client profile
  const handleViewClient = async (client) => {
    try {
      await loadClientProfile(client.id);
      // You could navigate to client profile here or open a modal
    } catch (error) {
      console.error('Error loading client profile:', error);
      addNotification('Error loading client profile', NotificationType.ALERT);
    }
  };
  
  // Handle successful message send
  const handleMessageSent = () => {
    addNotification(`${messageType} sent to ${selectedClient?.name}`, NotificationType.SUCCESS);
    setShowMessageModal(false);
  };
  
  // Calculate collection metrics
  const totalPastDue = pastDueClients.reduce((sum, c) => sum + ((c.total_balance || 0) - (c.paid_amount || 0)), 0);
  const avgDaysOverdue = pastDueClients.reduce((sum, c) => {
    if (c.next_due_date) {
      const daysOverdue = Math.floor((new Date() - new Date(c.next_due_date)) / (1000 * 60 * 60 * 24));
      return sum + Math.max(0, daysOverdue);
    }
    return sum;
  }, 0) / (pastDueClients.length || 1);
  
  // Render the appropriate view
  const renderView = () => {
    switch (collectionView) {
      case 'templates':
        return <CollectionTemplates onBack={() => setCollectionView('overview')} />;
      case 'efforts':
        return <CollectionEffortsTable onBack={() => setCollectionView('overview')} />;
      case 'overview':
      default:
        return (
          <>
            {/* Collection Metrics */}
            <div className="grid grid-cols-2 grid-cols-3 grid-cols-4">
              <div className="metric-card">
                <div className="metric-icon-container" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <TrendingUp className="metric-icon" style={{ color: 'var(--color-danger)' }} />
                </div>
                <div className="metric-content">
                  <h3 className="metric-label">Past Due Accounts</h3>
                  <p className="metric-value">{pastDueClients.length}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon-container" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <TrendingUp className="metric-icon" style={{ color: 'var(--color-warning)' }} />
                </div>
                <div className="metric-content">
                  <h3 className="metric-label">Total Past Due</h3>
                  <p className="metric-value">${totalPastDue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon-container" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                  <TrendingUp className="metric-icon" style={{ color: '#8b5cf6' }} />
                </div>
                <div className="metric-content">
                  <h3 className="metric-label">Avg Days Overdue</h3>
                  <p className="metric-value">{Math.round(avgDaysOverdue)}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon-container" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <MessageSquare className="metric-icon" style={{ color: 'var(--color-success)' }} />
                </div>
                <div className="metric-content">
                  <h3 className="metric-label">Collection Rate</h3>
                  <p className="metric-value">{metrics.collectionRate}%</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="action-buttons-container">
              <button 
                onClick={() => setCollectionView('templates')} 
                className="button"
              >
                <FileText size={16} />
                Message Templates
              </button>
              <button 
                onClick={() => setCollectionView('efforts')} 
                className="button"
              >
                <MessageSquare size={16} />
                Collection History
              </button>
            </div>
            
            {/* Past Due Clients Table */}
            <div className="card mt-lg">
              <h3 className="card-title">Past Due Accounts</h3>
              <PastDueTable 
                clients={pastDueClients}
                onSendEmail={(client) => handleSendMessage(client, 'EMAIL')}
                onSendSMS={(client) => handleSendMessage(client, 'SMS')}
                onMakeCall={(client) => handleSendMessage(client, 'CALL')}
                onViewClient={handleViewClient}
              />
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="collections-container">
      <div className="header-with-actions">
        <h2 className="section-title">Collections Management</h2>
      </div>
      
      {renderView()}
      
      {/* Message Modal */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        client={selectedClient}
        type={messageType}
        onSend={handleMessageSent}
      />
    </div>
  );
};

export default CollectionsTab;