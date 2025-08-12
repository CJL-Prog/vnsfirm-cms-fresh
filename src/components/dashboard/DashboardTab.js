import React from 'react';
import { DollarSign, Users, AlertTriangle, TrendingUp, CreditCard, Bell } from 'lucide-react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import PieChart from '../common/PieChart';

/**
 * DashboardTab component
 * Main dashboard with key metrics and charts
 */
const DashboardTab = () => {
  const { metrics, pastDueClients } = useClients();
  const { notifications } = useNotifications();
  
  // Calculate payment data for pie chart
  const calculatePaymentData = () => {
    const totalBalance = metrics.totalBalance;
    const totalPaid = metrics.totalRevenue;
    const outstandingBalance = metrics.outstandingBalance;
    
    // Simplified logic for paid on time vs late
    const paidOnTime = totalPaid * 0.75; // Assume 75% paid on time for demo
    const paidLate = totalPaid - paidOnTime;
    
    if (totalBalance === 0) {
      return [
        { label: 'No Data', value: 0, percentage: 1, color: '#e5e7eb' }
      ];
    }
    
    return [
      {
        label: 'Paid On Time',
        value: paidOnTime,
        percentage: paidOnTime / totalBalance,
        color: '#059669'
      },
      {
        label: 'Paid After Due',
        value: paidLate,
        percentage: paidLate / totalBalance,
        color: '#f59e0b'
      },
      {
        label: 'Not Yet Paid',
        value: outstandingBalance,
        percentage: outstandingBalance / totalBalance,
        color: '#ef4444'
      }
    ].filter(item => item.value > 0);
  };

  // Get payment data for pie chart
  const paymentData = calculatePaymentData();

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 grid-cols-3 grid-cols-4">
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
            <Users className="metric-icon" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Total Clients</h3>
            <p className="metric-value">{metrics.totalClients}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <TrendingUp className="metric-icon" style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Active Clients</h3>
            <p className="metric-value">{metrics.activeClients}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <AlertTriangle className="metric-icon" style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Past Due</h3>
            <p className="metric-value">{metrics.pastDueCount}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)' }}>
            <DollarSign className="metric-icon" style={{ color: '#059669' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Total Revenue</h3>
            <p className="metric-value">${metrics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <CreditCard className="metric-icon" style={{ color: 'var(--color-danger)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Outstanding</h3>
            <p className="metric-value">${metrics.outstandingBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts and notifications */}
      <div className="grid grid-cols-1 grid-cols-2">
        <div className="card">
          <h3 className="card-title">Payment Collection Breakdown</h3>
          <div className="chart-container">
            <PieChart data={paymentData} size={220} />
          </div>
          <div className="collection-rate-container">
            <div className="collection-rate-value">{metrics.collectionRate}%</div>
            <div className="collection-rate-label">Overall Collection Rate</div>
            <div className="collection-rate-details">
              ${metrics.totalRevenue.toLocaleString()} collected of ${metrics.totalBalance.toLocaleString()} total
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Recent Notifications</h3>
          <div className="notifications-list">
            {notifications.slice(0, 5).map(notification => (
              <div 
                key={notification.id} 
                className={`notification-card notification-${notification.type}`}
              >
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="empty-state">
                <Bell className="empty-state-icon" />
                <p>No recent notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="card mt-lg">
        <h3 className="card-title">Recent Activity</h3>
        <div className="activity-list">
          {pastDueClients.slice(0, 5).map(client => (
            <div key={client.id} className="activity-item">
              <div className="activity-icon-container" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <AlertTriangle className="activity-icon" style={{ color: 'var(--color-danger)' }} />
              </div>
              <div className="activity-content">
                <p className="activity-title">
                  <strong>{client.name}</strong> payment is past due
                </p>
                <p className="activity-details">
                  Amount: ${((client.total_balance || 0) - (client.paid_amount || 0)).toLocaleString()} • 
                  Due Date: {client.next_due_date}
                </p>
              </div>
            </div>
          ))}
          {pastDueClients.length === 0 && (
            <div className="empty-state">
              <TrendingUp className="empty-state-icon" />
              <p>No past due clients! Great job! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;