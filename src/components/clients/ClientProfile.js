import React, { useState } from 'react';
import { FileText, DollarSign, Plus, Mail, MessageSquare, Phone } from 'lucide-react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * ClientProfile component
 * Detailed client profile with tabs for different information
 * 
 * @param {Function} onClose - Function to call when profile is closed
 * @param {Function} onEdit - Function to call when Edit button is clicked
 */
const ClientProfile = ({ onClose, onEdit }) => {
  const { 
    selectedClient, 
    clientNotes, 
    clientPaymentHistory,
    addClientNote,
    addPayment
  } = useClients();
  
  const { addNotification, NotificationType } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Handle adding a note
  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedClient) return;
    
    try {
      await addClientNote(selectedClient.id, noteText);
      setNoteText('');
      addNotification('Note added successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error adding note:', error);
      addNotification('Error adding note', NotificationType.ALERT);
    }
  };
  
  // Handle adding a payment
  const handleAddPayment = async () => {
    if (!paymentAmount || !selectedClient) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      addNotification('Please enter a valid payment amount', NotificationType.WARNING);
      return;
    }
    
    try {
      await addPayment(selectedClient.id, {
        amount,
        payment_method: paymentMethod,
        description: paymentDescription || 'Manual payment entry',
        payment_date: new Date().toISOString()
      });
      
      setPaymentAmount('');
      setPaymentDescription('');
      addNotification(`Payment of $${amount.toLocaleString()} recorded successfully`, NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error adding payment:', error);
      addNotification('Error recording payment', NotificationType.ALERT);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (!selectedClient) {
    return (
      <div className="empty-state">
        <p>No client selected</p>
      </div>
    );
  }
  
  // Calculate outstanding balance
  const outstandingBalance = (selectedClient.total_balance || 0) - (selectedClient.paid_amount || 0);
  
  return (
    <div className="client-profile">
      {/* Action Buttons */}
      <div className="client-profile-actions">
        <button className="button button-outline" onClick={() => onEdit()}>
          Edit Client
        </button>
        <div className="button-group">
          <button className="button button-purple">
            <Mail size={16} />
            Email
          </button>
          <button className="button button-green">
            <MessageSquare size={16} />
            SMS
          </button>
          <button className="button button-yellow">
            <Phone size={16} />
            Call
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'payments' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payment History
        </button>
        <button 
          className={`tab ${activeTab === 'notes' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={`tab ${activeTab === 'collections' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          Collection History
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <h3 className="tab-title">Client Information</h3>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Contact Information</div>
                <div className="info-value">{selectedClient.email || 'No email'}</div>
                <div className="info-value">{selectedClient.phone || 'No phone'}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Total Balance</div>
                <div className="info-value">${(selectedClient.total_balance || 0).toLocaleString()}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Amount Paid</div>
                <div className="info-value">${(selectedClient.paid_amount || 0).toLocaleString()}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Outstanding Balance</div>
                <div className="info-value">${outstandingBalance.toLocaleString()}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Payment Plan</div>
                <div className="info-value">{selectedClient.payment_plan || 'Not set'}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Next Due Date</div>
                <div className="info-value">{formatDate(selectedClient.next_due_date)}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Retainer Status</div>
                <div className="info-value">
                  {selectedClient.retainer_signed ? '✅ Signed' : '⏳ Pending'}
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Third Party Payor</div>
                <div className="info-value">{selectedClient.third_party_payor || 'None'}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="tab-pane">
            <div className="tab-header">
              <h3 className="tab-title">Payment History</h3>
              <button 
                className="button"
                onClick={() => document.getElementById('payment-form').scrollIntoView({ behavior: 'smooth' })}
              >
                <Plus size={16} />
                Add Payment
              </button>
            </div>
            
            {clientPaymentHistory.length > 0 ? (
              <div className="history-list">
                {clientPaymentHistory.map((payment) => (
                  <div key={payment.id} className="history-item">
                    <div className="history-content">
                      <div className="history-title">
                        {payment.description || 'Payment Received'}
                      </div>
                      <div className="history-date">
                        {formatDate(payment.payment_date)}
                      </div>
                      <div className="history-details">
                        Method: {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}
                      </div>
                    </div>
                    <div className="history-amount">
                      ${payment.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <DollarSign className="empty-state-icon" />
                <p>No payment history available</p>
              </div>
            )}
            
            {/* Add Payment Form */}
            <div id="payment-form" className="payment-form card">
              <h4 className="form-title">Record New Payment</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-select"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="ach">ACH Transfer</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Monthly payment, Retainer fee, etc."
                />
              </div>
              
              <button 
                type="button" 
                className="button"
                onClick={handleAddPayment}
                disabled={!paymentAmount}
              >
                Record Payment
              </button>
            </div>
          </div>
        )}
        
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="tab-pane">
            <h3 className="tab-title">Account Notes</h3>
            
            {/* Add Note Form */}
            <div className="note-form">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="note-textarea"
                placeholder="Add a note about this client..."
              />
              <button 
                className="button"
                onClick={handleAddNote}
                disabled={!noteText.trim()}
              >
                Add Note
              </button>
            </div>
            
            {/* Notes List */}
            {clientNotes.length > 0 ? (
              <div className="notes-list">
                {clientNotes.map((note) => (
                  <div key={note.id} className="note-item">
                    <div className="note-text">{note.note}</div>
                    <div className="note-meta">
                      {formatDate(note.created_at)} at {new Date(note.created_at).toLocaleTimeString()}
                      {note.created_by && <span> • by {note.created_by}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FileText className="empty-state-icon" />
                <p>No notes available</p>
              </div>
            )}
          </div>
        )}
        
        {/* Collection History Tab */}
        {activeTab === 'collections' && (
          <div className="tab-pane">
            <h3 className="tab-title">Collection History</h3>
            <div className="empty-state">
              <p>Collection history will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;