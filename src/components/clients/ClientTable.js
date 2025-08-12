import React from 'react';
import { Edit3, Eye, Mail, MessageSquare, Phone, Trash2, User } from 'lucide-react';
import Pagination from '../common/Pagination';

/**
 * ClientTable component
 * Displays a table of clients with actions
 * 
 * @param {Array} clients - Array of client objects to display
 * @param {Function} onView - Function to call when View button is clicked
 * @param {Function} onEdit - Function to call when Edit button is clicked
 * @param {Function} onDelete - Function to call when Delete button is clicked
 * @param {Function} onSendEmail - Function to call when Send Email button is clicked
 * @param {Function} onSendSMS - Function to call when Send SMS button is clicked
 * @param {Function} onMakeCall - Function to call when Make Call button is clicked
 * @param {Object} pagination - Pagination props (currentPage, totalPages, onPageChange)
 */
const ClientTable = ({ 
  clients, 
  onView, 
  onEdit, 
  onDelete, 
  onSendEmail, 
  onSendSMS, 
  onMakeCall,
  pagination
}) => {
  // Format currency for display
  const formatCurrency = (amount) => {
    return typeof amount === 'number' 
      ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
      : 'N/A';
  };
  
  // Calculate payment progress percentage
  const calculateProgress = (paid, total) => {
    if (!total) return 0;
    return Math.min(100, Math.round((paid / total) * 100));
  };
  
  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'badge-success';
      case 'Past Due':
        return 'badge-danger';
      case 'Paid in Full':
        return 'badge-info';
      case 'Inactive':
        return 'badge-secondary';
      default:
        return '';
    }
  };

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Client</th>
              <th className="table-header-cell">Law Firm</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Balance</th>
              <th className="table-header-cell">Next Due</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => {
                const paidAmount = client.paid_amount || 0;
                const totalBalance = client.total_balance || 0;
                const progress = calculateProgress(paidAmount, totalBalance);
                
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
                    <td className="table-cell">{client.law_firm || 'N/A'}</td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusClass(client.status)}`}>
                        {client.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="balance-cell">
                        <div className="balance-text">
                          {formatCurrency(paidAmount)} / {formatCurrency(totalBalance)}
                        </div>
                        <div className="progress-container">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{client.next_due_date || 'Not set'}</td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => onView(client)} 
                          className="icon-button"
                          title="View Client Profile"
                          aria-label="View Client Profile"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => onEdit(client)} 
                          className="icon-button icon-button-blue"
                          title="Edit Client"
                          aria-label="Edit Client"
                        >
                          <Edit3 size={16} />
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
                          onClick={() => onSendSMS(client)} 
                          className="icon-button icon-button-green"
                          title="Send SMS"
                          aria-label="Send SMS"
                        >
                          <MessageSquare size={16} />
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
                          onClick={() => onDelete(client)} 
                          className="icon-button icon-button-red"
                          title="Delete Client"
                          aria-label="Delete Client"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="table-cell-empty">
                  <div className="empty-state">
                    <User className="empty-state-icon" />
                    <p>No clients found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="pagination-container">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ClientTable);