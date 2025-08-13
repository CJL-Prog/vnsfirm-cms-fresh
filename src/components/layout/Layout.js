import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Settings,
  Zap,
  LogOut,
  User,
  Bell,
  Search,
  DollarSign,
  CreditCard,
  Plus,
  Filter
} from 'lucide-react';

// Mock data for demonstration
const mockNotifications = [
  { id: 1, message: "Payment received from John Smith", type: "success", time: "2 min ago", read: false },
  { id: 2, message: "New client inquiry submitted", type: "info", time: "15 min ago", read: false },
  { id: 3, message: "Payment overdue: Sarah Johnson", type: "warning", time: "1 hour ago", read: true },
];

const mockClients = [
  { id: 1, name: "John Smith", email: "john@email.com", phone: "(555) 123-4567", status: "Active", totalBalance: 5000, paidAmount: 3000, dueDate: "2024-03-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@email.com", phone: "(555) 234-5678", status: "Past Due", totalBalance: 7500, paidAmount: 2500, dueDate: "2024-02-28" },
  { id: 3, name: "Mike Wilson", email: "mike@email.com", phone: "(555) 345-6789", status: "Active", totalBalance: 3200, paidAmount: 3200, dueDate: "2024-04-01" },
];

const mockMetrics = {
  totalClients: 156,
  activeClients: 134,
  pastDueCount: 12,
  totalRevenue: 485000,
  outstandingBalance: 125000,
  collectionRate: 87
};

// Header Component
const Header = ({ user, onSignOut }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="logo">VNS Firm</h1>
          <p className="subtitle">Client Management System</p>
        </div>
        <div className="header-right">
          {/* Notifications Dropdown */}
          <div className="notifications-dropdown-container">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="bell-button"
              aria-label="Notifications"
            >
              <Bell style={{ width: '24px', height: '24px' }} />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3 className="notification-title">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-read-button">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {mockNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                    >
                      <div 
                        className="notification-indicator"
                        style={{
                          backgroundColor: notification.type === 'success' ? 'var(--color-success)' :
                                         notification.type === 'warning' ? 'var(--color-warning)' :
                                         'var(--color-info)'
                        }}
                      ></div>
                      <div className="notification-content">
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <p className="notification-time">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="user-section">
            <div className="user-avatar">
              <User style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="user-name">
              {user?.name || 'John Doe'}
            </span>
            <button onClick={onSignOut} className="icon-button">
              <LogOut style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'collections', name: 'Collections', icon: AlertTriangle },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <nav className="nav">
      <div className="nav-content">
        {navItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-button ${
              activeTab === tab.id ? 'active-nav-button' : 'inactive-nav-button'
            }`}
          >
            <tab.icon style={{ width: '16px', height: '16px' }} />
            {tab.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Dashboard Tab Component
const DashboardTab = () => {
  return (
    <div className="dashboard-container">
      <h2 className="section-title">Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
            <Users className="metric-icon" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Total Clients</h3>
            <p className="metric-value">{mockMetrics.totalClients}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <TrendingUp className="metric-icon" style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Active Clients</h3>
            <p className="metric-value">{mockMetrics.activeClients}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <AlertTriangle className="metric-icon" style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Past Due</h3>
            <p className="metric-value">{mockMetrics.pastDueCount}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-container" style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)' }}>
            <DollarSign className="metric-icon" style={{ color: '#059669' }} />
          </div>
          <div className="metric-content">
            <h3 className="metric-label">Total Revenue</h3>
            <p className="metric-value">${mockMetrics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts and notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="card">
          <h3 className="card-title">Collection Rate</h3>
          <div className="collection-rate-container">
            <div className="collection-rate-value">{mockMetrics.collectionRate}%</div>
            <div className="collection-rate-label">Overall Collection Rate</div>
            <div className="collection-rate-details">
              ${mockMetrics.totalRevenue.toLocaleString()} collected of ${(mockMetrics.totalRevenue + mockMetrics.outstandingBalance).toLocaleString()} total
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon-container" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <DollarSign className="activity-icon" style={{ color: 'var(--color-success)' }} />
              </div>
              <div className="activity-content">
                <p className="activity-title">
                  <strong>John Smith</strong> payment received
                </p>
                <p className="activity-details">
                  Amount: $2,500 • Today at 2:30 PM
                </p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon-container" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <Users className="activity-icon" style={{ color: 'var(--color-secondary)' }} />
              </div>
              <div className="activity-content">
                <p className="activity-title">
                  <strong>New client</strong> inquiry received
                </p>
                <p className="activity-details">
                  Contact: Maria Garcia • Today at 1:15 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clients Tab Component
const ClientsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Past Due': return 'badge-danger';
      case 'Paid in Full': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const calculateProgress = (paid, total) => {
    if (!total) return 0;
    return Math.min(100, Math.round((paid / total) * 100));
  };

  return (
    <div className="container">
      <div className="header-with-actions">
        <h2 className="section-title">Client Management</h2>
        <button className="button">
          <Plus size={16} />
          Add Client
        </button>
      </div>
      
      <div className="search-container card">
        <div className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="button button-outline">
            <Filter size={16} />
            Filter
          </button>
        </div>
        
        <div className="table-container">
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Client</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Balance</th>
                  <th className="table-header-cell">Next Due</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockClients.map((client) => {
                  const progress = calculateProgress(client.paidAmount, client.totalBalance);
                  
                  return (
                    <tr key={client.id} className="table-row">
                      <td className="table-cell">
                        <div className="client-cell">
                          <div className="client-avatar">
                            <User style={{ width: '24px', height: '24px', color: 'var(--color-primary)' }} />
                          </div>
                          <div className="client-info">
                            <div className="client-name">{client.name}</div>
                            <div className="client-email">{client.email}</div>
                            <div className="client-phone">{client.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${getStatusClass(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="balance-cell">
                          <div className="balance-text">
                            ${client.paidAmount.toLocaleString()} / ${client.totalBalance.toLocaleString()}
                          </div>
                          <div className="progress-container">
                            <div 
                              className="progress-bar" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">{client.dueDate}</td>
                      <td className="table-cell">
                        <div className="action-buttons">
                          <button className="icon-button icon-button-blue" title="Edit">
                            <Settings size={16} />
                          </button>
                          <button className="icon-button icon-button-green" title="Message">
                            <Bell size={16} />
                          </button>
                          <button className="icon-button icon-button-purple" title="Payment">
                            <CreditCard size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple placeholder for other tabs
const PlaceholderTab = ({ title, icon: Icon }) => (
  <div className="container">
    <h2 className="section-title">{title}</h2>
    <div className="card">
      <div className="empty-state">
        <Icon className="empty-state-icon" />
        <p>{title} features will be displayed here</p>
      </div>
    </div>
  </div>
);

// Main Layout Component
const EnhancedLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'clients':
        return <ClientsTab />;
      case 'collections':
        return <PlaceholderTab title="Collections Management" icon={AlertTriangle} />;
      case 'integrations':
        return <PlaceholderTab title="Integrations" icon={Zap} />;
      case 'settings':
        return <PlaceholderTab title="Settings" icon={Settings} />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="app-layout">
      <Header 
        user={{ name: 'John Doe' }}
        onSignOut={() => console.log('Sign out')}
      />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main">
        <div className="content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default EnhancedLayout;