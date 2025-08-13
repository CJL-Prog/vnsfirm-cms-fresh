import React, { memo } from 'react';
import { Eye, Mail, MessageSquare, Phone, User, TrendingUp } from 'lucide-react';

/**
 * PastDueTable component
 * Displays a table of past due clients with collection actions
 * 
 * @param {Array} clients - Array of past due client objects
 * @param {Function} onSendEmail - Function to call when Send Email button is clicked
 * @param {Function} onSendSMS - Function to call when Send SMS button is clicked
 * @param {Function} onMakeCall - Function to call when Make Call button is clicked
 * @param {Function} onViewClient - Function to call when View button is clicked
 */
const PastDueTable = ({ 
  clients, 
  onSendEmail, 
  onSendSMS, 
  onMakeCall,
  onViewClient
}) => {
  // Calculate days overdue
  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };
  
  // Get severity class based on days overdue
  const getOverdueSeverity = (days) => {
    if (days > 30) return 'overdue-critical';
    if (days > 14) return 'overdue-severe';
    if (days > 7) return 'overdue-high';
    if (days > 3) return 'overdue-medium';
    return 'overdue-low';
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return typeof amount === 'number' 
      ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
      : 'N/A';
  };

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Client</th>
              <th className="table-header-cell">Days Overdue</th>
              <th className="table-header-cell">Amount Due</th>
              <th className="table-header-cell">Last Contact</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => {
                const daysOverdue = getDaysOverdue(client.next_due_date);
                const overdueClass = getOverdueSeverity(daysOverdue);
                const amountDue = (client.total_balance || 0) - (client.paid_amount || 0);
                
                return (
                  <tr key={client.id} className="table-row">
                    <td className="table-cell">
                      <div className="client-cell">
                        <div className="client-avatar">
                          <User style={{ width: '24px', height: '24px', color: 'var(--color-primary)' }} />
                        </div>
                        <div className="client-info">
                          <div className="client-name">{client.name}</div>
                          {client.email && <div className="client-email">{client.email}</div>}
                          {client.phone && <div className="client-phone">{client.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`days-overdue ${overdueClass}`}>
                        {daysOverdue > 0 ? `${daysOverdue} days` : 'Due today'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="amount-due">
                        {formatCurrency(amountDue)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="last-contact">
                        {client.last_contact_date ? new Date(client.last_contact_date).toLocaleDateString() : 'No contact yet'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => onSendSMS(client)} 
                          className="icon-button icon-button-green"
                          title="Send SMS"
                          aria-label="Send SMS"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button 
                          onClick={() => onSendEmail(client)} 
                          className="icon-button icon-button-purple"
                          title="Send Email"
                          aria-label="Send Email"
                        >
                          <Mail size={16} />
                        </button>
                        <button 
                          onClick={() => onMakeCall(client)} 
                          className="icon-button icon-button-yellow"
                          title="Make Call"
                          aria-label="Make Call"
                        >
                          <Phone size={16} />
                        </button>
                        <button 
                          onClick={() => onViewClient(client)} 
                          className="icon-button"
                          title="View Client Profile"
                          aria-label="View Client Profile"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="table-cell-empty">
                  <div className="empty-state">
                    <TrendingUp className="empty-state-icon" />
                    <p>No past due clients! Great job! 🎉</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(PastDueTable);