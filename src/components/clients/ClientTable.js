import React, { useEffect, useRef, useState } from 'react';
import { Edit3, Eye, Mail, MessageSquare, Phone, Trash2, User } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Pagination from '../common/Pagination';

/**
 * ClientTable component with virtualization
 * Displays a table of clients with actions using react-window for efficient rendering
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
  const [tableHeight, setTableHeight] = useState(400);
  const containerRef = useRef(null);
  const ROW_HEIGHT = 80; // Fixed height for each row

  // Update table height based on container size and available space
  useEffect(() => {
    if (containerRef.current) {
      // Get the available viewport height
      const updateHeight = () => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const offsetTop = containerRect.top;
        // Calculate available height (subtract some space for pagination)
        const availableHeight = viewportHeight - offsetTop - 60;
        // Set a reasonable height (min 200px, max available height)
        setTableHeight(Math.max(200, Math.min(availableHeight, 600)));
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);

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

  // Row renderer for virtualized list
  const Row = ({ index, style }) => {
    // If no clients or empty state
    if (clients.length === 0) {
      return (
        <div style={style} className="table-row empty-row">
          <div className="table-cell-empty" style={{ width: '100%' }}>
            <div className="empty-state">
              <User className="empty-state-icon" />
              <p>No clients found</p>
            </div>
          </div>
        </div>
      );
    }

    const client = clients[index];
    const paidAmount = client.paid_amount || 0;
    const totalBalance = client.total_balance || 0;
    const progress = calculateProgress(paidAmount, totalBalance);
    
    return (
      <div style={style} className="table-row virtualized-row">
        <div className="table-cell" style={{ width: '25%' }}>
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
        </div>
        <div className="table-cell" style={{ width: '15%' }}>{client.law_firm || 'N/A'}</div>
        <div className="table-cell" style={{ width: '10%' }}>
          <span className={`badge ${getStatusClass(client.status)}`}>
            {client.status || 'Unknown'}
          </span>
        </div>
        <div className="table-cell" style={{ width: '20%' }}>
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
        </div>
        <div className="table-cell" style={{ width: '10%' }}>{client.next_due_date || 'Not set'}</div>
        <div className="table-cell" style={{ width: '20%' }}>
          <div className="action-buttons">
            <button 
              onClick={() => onView(client)} 
              className="icon-button"
              title="View Client Profile"
              aria-label="View Client Profile"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onView(client)}
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => onEdit(client)} 
              className="icon-button icon-button-blue"
              title="Edit Client"
              aria-label="Edit Client"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onEdit(client)}
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => onSendEmail(client)} 
              className="icon-button icon-button-purple"
              title="Send Email"
              aria-label="Send Email"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSendEmail(client)}
            >
              <Mail size={16} />
            </button>
            <button 
              onClick={() => onSendSMS(client)} 
              className="icon-button icon-button-green"
              title="Send SMS"
              aria-label="Send SMS"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSendSMS(client)}
            >
              <MessageSquare size={16} />
            </button>
            <button 
              onClick={() => onMakeCall(client)} 
              className="icon-button icon-button-yellow"
              title="Make Call"
              aria-label="Make Call"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onMakeCall(client)}
            >
              <Phone size={16} />
            </button>
            <button 
              onClick={() => onDelete(client)} 
              className="icon-button icon-button-red"
              title="Delete Client"
              aria-label="Delete Client"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onDelete(client)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="table-container virtualized-table-container" ref={containerRef}>
      {/* Table Header */}
      <div className="table-header virtualized-header">
        <div className="header-cell" style={{ width: '25%' }}>Client</div>
        <div className="header-cell" style={{ width: '15%' }}>Law Firm</div>
        <div className="header-cell" style={{ width: '10%' }}>Status</div>
        <div className="header-cell" style={{ width: '20%' }}>Balance</div>
        <div className="header-cell" style={{ width: '10%' }}>Next Due</div>
        <div className="header-cell" style={{ width: '20%' }}>Actions</div>
      </div>
      
      {/* Virtualized Table Body */}
      <div className="virtualized-table-body" style={{ height: tableHeight }}>
        <AutoSizer>
          {({ width }) => (
            <List
              height={tableHeight}
              width={width}
              itemCount={clients.length || 1} // At least 1 for empty state
              itemSize={ROW_HEIGHT}
              overscanCount={5} // Render additional items for smooth scrolling
            >
              {Row}
            </List>
          )}
        </AutoSizer>
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

      {/* Additional CSS for virtualized table */}
      <style jsx global>{`
        .virtualized-table-container {
          display: flex;
          flex-direction: column;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .virtualized-header {
          display: flex;
          background-color: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          padding: 12px 0;
        }
        
        .header-cell {
          padding: 0 16px;
          font-size: 0.875rem;
          color: #4a5568;
        }
        
        .virtualized-table-body {
          border-bottom: 1px solid #e2e8f0;
        }
        
        .virtualized-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          background-color: white;
        }
        
        .virtualized-row:hover {
          background-color: #f8fafc;
        }
        
        .virtualized-row .table-cell {
          padding: 12px 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
        }
        
        .empty-row {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ClientTable);