import React, { useMemo, useState } from 'react';
import { 
  DollarSign, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CreditCard, 
  Bell, 
  Filter, 
  Calendar, 
  Info, 
  Clock, 
  ArrowUp, 
  ArrowDown,
  PieChart as PieIcon
} from 'lucide-react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import PieChart from '../common/PieChart';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * DashboardTab component
 * Main dashboard with key metrics, charts, and actionable insights
 */
const DashboardTab = () => {
  const { metrics, pastDueClients, isLoading, error } = useClients();
  const { notifications } = useNotifications();
  
  // Local state for filtering and sorting
  const [sortField, setSortField] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [notificationFilter, setNotificationFilter] = useState('all');

  // Calculate payment data for pie chart (memoized)
  const paymentData = useMemo(() => {
    if (!metrics || metrics.totalBalance === 0) {
      return [{ label: 'No Data', value: 0, percentage: 1, color: '#e5e7eb' }];
    }
    
    const totalBalance = metrics.totalBalance;
    const totalPaid = metrics.totalRevenue;
    const outstandingBalance = metrics.outstandingBalance;
    
    // Use actual metrics data if available, otherwise fallback to estimate
    const paidOnTime = metrics.paidOnTime || totalPaid * 0.75;
    const paidLate = totalPaid - paidOnTime;
    
    return [
      {
        label: 'Paid On Time',
        value: paidOnTime,
        percentage: paidOnTime / totalBalance,
        color: '#059669',
        id: 'on-time'
      },
      {
        label: 'Paid After Due',
        value: paidLate,
        percentage: paidLate / totalBalance,
        color: '#f59e0b',
        id: 'late'
      },
      {
        label: 'Not Yet Paid',
        value: outstandingBalance,
        percentage: outstandingBalance / totalBalance,
        color: '#ef4444',
        id: 'unpaid'
      }
    ].filter(item => item.value > 0);
  }, [metrics]);

  // Filter notifications based on type
  const filteredNotifications = useMemo(() => {
    if (notificationFilter === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.type === notificationFilter);
  }, [notifications, notificationFilter]);

  // Sort past due clients
  const sortedPastDueClients = useMemo(() => {
    if (!pastDueClients?.length) return [];
    
    return [...pastDueClients].sort((a, b) => {
      const getValue = (client, field) => {
        switch (field) {
          case 'amount':
            return (client.total_balance || 0) - (client.paid_amount || 0);
          case 'name':
            return client.name;
          case 'date':
            return new Date(client.next_due_date);
          default:
            return 0;
        }
      };
      
      const aValue = getValue(a, sortField);
      const bValue = getValue(b, sortField);
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [pastDueClients, sortField, sortDirection]);

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 text-red-800 my-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Error Loading Dashboard
        </h2>
        <p className="mb-4">{error.message || 'Failed to load dashboard data. Please try refreshing the page.'}</p>
        <button 
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors" 
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500 flex items-center">
            <Clock size={14} className="mr-1" />
            Last updated: {formatDate(new Date(), 'time')}
          </span>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
            aria-label="Refresh dashboard data"
            onClick={() => window.location.reload()}
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </header>
      
      {/* Key Metrics */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <MetricCard 
            icon={<Users />} 
            label="Total Clients" 
            value={metrics.totalClients} 
            bgColor="rgba(220, 38, 38, 0.1)" 
            iconColor="var(--color-primary)"
            tooltip="Total number of all clients in the system"
          />
          
          <MetricCard 
            icon={<TrendingUp />} 
            label="Active Clients" 
            value={metrics.activeClients} 
            bgColor="rgba(16, 185, 129, 0.1)" 
            iconColor="var(--color-success)"
            tooltip="Number of clients with active projects or retainers"
          />
          
          <MetricCard 
            icon={<AlertTriangle />} 
            label="Past Due" 
            value={metrics.pastDueCount} 
            bgColor="rgba(245, 158, 11, 0.1)" 
            iconColor="var(--color-warning)"
            tooltip="Clients with payments past their due date"
          />
          
          <MetricCard 
            icon={<DollarSign />} 
            label="Total Revenue" 
            value={formatCurrency(metrics.totalRevenue)} 
            bgColor="rgba(5, 150, 105, 0.1)" 
            iconColor="#059669"
            tooltip="Total amount collected from all clients"
          />
          
          <MetricCard 
            icon={<CreditCard />} 
            label="Outstanding" 
            value={formatCurrency(metrics.outstandingBalance)} 
            bgColor="rgba(239, 68, 68, 0.1)" 
            iconColor="var(--color-danger)"
            tooltip="Total amount that is still unpaid"
          />
        </div>
      </section>

      {/* Charts and notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Collection Chart */}
        <section aria-labelledby="chart-heading" className="bg-white rounded-lg shadow p-6">
          <h2 id="chart-heading" className="text-lg font-semibold mb-4 flex items-center">
            <PieIcon className="mr-2" size={18} />
            Payment Collection Breakdown
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="chart-container w-full sm:w-auto flex justify-center" aria-hidden="true">
              <PieChart data={paymentData} size={220} />
            </div>
            <div className="collection-rate-container text-center sm:text-left mt-4 sm:mt-0">
              <div className="text-3xl font-bold text-blue-600">{metrics.collectionRate}%</div>
              <div className="text-sm font-medium text-gray-600 mb-2">Overall Collection Rate</div>
              <div className="text-sm text-gray-500">
                {formatCurrency(metrics.totalRevenue)} collected of {formatCurrency(metrics.totalBalance)} total
              </div>
              
              {/* Chart legend with percentages */}
              <div className="mt-4 space-y-2">
                {paymentData.map(item => (
                  <div key={item.id} className="flex items-center text-sm">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    ></span>
                    <span className="flex-1">{item.label}</span>
                    <span className="font-medium">
                      {Math.round(item.percentage * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section aria-labelledby="notifications-heading" className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="notifications-heading" className="text-lg font-semibold flex items-center">
              <Bell className="mr-2" size={18} />
              Recent Notifications
            </h2>
            <div className="flex items-center">
              <label htmlFor="notification-filter" className="sr-only">Filter notifications</label>
              <div className="relative">
                <select
                  id="notification-filter"
                  value={notificationFilter}
                  onChange={(e) => setNotificationFilter(e.target.value)}
                  className="text-sm border rounded-md pl-8 pr-2 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter notifications"
                >
                  <option value="all">All</option>
                  <option value="payment">Payments</option>
                  <option value="client">Clients</option>
                  <option value="system">System</option>
                </select>
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>
          </div>
          
          <div className="notifications-list space-y-3 max-h-[300px] overflow-y-auto" role="log">
            {filteredNotifications.slice(0, 5).map(notification => (
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
              />
            ))}
            {filteredNotifications.length === 0 && (
              <EmptyState 
                icon={<Bell />} 
                message={notificationFilter === 'all' 
                  ? "No recent notifications" 
                  : `No ${notificationFilter} notifications`} 
              />
            )}
          </div>
        </section>
      </div>
      
      {/* Recent Activity - Past Due Clients */}
      <section aria-labelledby="activity-heading" className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="activity-heading" className="text-lg font-semibold flex items-center">
            <AlertTriangle className="mr-2" size={18} />
            Past Due Clients
          </h2>
          <div className="flex gap-2 text-sm">
            <SortButton 
              label="Sort by client" 
              field="name"
              currentField={sortField}
              direction={sortDirection}
              onClick={() => handleSortChange('name')}
            />
            <SortButton 
              label="Sort by amount" 
              field="amount"
              currentField={sortField}
              direction={sortDirection}
              onClick={() => handleSortChange('amount')}
            />
            <SortButton 
              label="Sort by date" 
              field="date"
              currentField={sortField}
              direction={sortDirection}
              onClick={() => handleSortChange('date')}
            />
          </div>
        </div>
        
        <div className="activity-list space-y-4">
          {sortedPastDueClients.slice(0, 5).map(client => (
            <PastDueClientCard key={client.id} client={client} />
          ))}
          {sortedPastDueClients.length === 0 && (
            <EmptyState 
              icon={<TrendingUp />} 
              message="No past due clients! Great job! 🎉" 
            />
          )}
        </div>
        
        {sortedPastDueClients.length > 5 && (
          <div className="mt-4 text-center">
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              aria-label="View all past due clients"
            >
              View all {sortedPastDueClients.length} past due clients
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

/**
 * MetricCard Component
 * Displays a single metric with icon and value
 */
const MetricCard = ({ icon, label, value, bgColor, iconColor, tooltip }) => (
  <div 
    className="bg-white rounded-lg shadow p-4 flex items-center"
    role="group"
    aria-labelledby={`metric-label-${label.replace(/\s+/g, '-').toLowerCase()}`}
  >
    <div 
      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4" 
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      {React.cloneElement(icon, { 
        className: "h-6 w-6", 
        style: { color: iconColor } 
      })}
    </div>
    <div className="flex-1">
      <div className="flex items-center">
        <h3 
          id={`metric-label-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm font-medium text-gray-500"
        >
          {label}
        </h3>
        {tooltip && (
          <div className="group relative ml-1">
            <button 
              aria-label={`Information about ${label}`}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
            >
              <Info size={14} />
            </button>
            <div className="absolute z-10 invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded-md shadow-lg">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

/**
 * NotificationCard Component
 * Displays a single notification with formatting based on type
 */
const NotificationCard = ({ notification }) => {
  const typeClasses = {
    payment: "border-green-200 bg-green-50",
    client: "border-blue-200 bg-blue-50",
    system: "border-purple-200 bg-purple-50",
    warning: "border-yellow-200 bg-yellow-50",
    error: "border-red-200 bg-red-50"
  };
  
  const baseClasses = "border-l-4 p-3 rounded-r-md";
  const classes = `${baseClasses} ${typeClasses[notification.type] || "border-gray-200 bg-gray-50"}`;
  
  return (
    <div className={classes} role="listitem">
      <p className="text-sm">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-1 flex items-center">
        <Calendar size={12} className="mr-1" />
        {new Date(notification.created_at).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  );
};

/**
 * PastDueClientCard Component
 * Displays information about a past due client
 */
const PastDueClientCard = ({ client }) => {
  const pastDueAmount = (client.total_balance || 0) - (client.paid_amount || 0);
  
  // Calculate days overdue
  const dueDate = new Date(client.next_due_date);
  const today = new Date();
  const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
  
  // Determine severity based on days overdue
  let severityClass = "bg-yellow-50 border-yellow-200";
  if (daysOverdue > 30) {
    severityClass = "bg-red-50 border-red-200";
  } else if (daysOverdue > 14) {
    severityClass = "bg-orange-50 border-orange-200";
  }
  
  return (
    <div className={`border-l-4 rounded-r-md p-4 ${severityClass}`}>
      <div className="flex flex-wrap items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {client.name}
          </h3>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap gap-y-1 gap-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="mr-1 flex-shrink-0" size={14} />
              Amount due: {formatCurrency(pastDueAmount)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="mr-1 flex-shrink-0" size={14} />
              Due date: {formatDate(client.next_due_date)}
            </div>
            <div className="flex items-center text-sm font-medium text-red-600">
              <AlertTriangle className="mr-1 flex-shrink-0" size={14} />
              {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
            </div>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex-shrink-0">
          <button 
            className="text-sm bg-white border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition-colors"
            aria-label={`Send payment reminder to ${client.name}`}
          >
            Send Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * EmptyState Component
 * Displays a message when no data is available
 */
const EmptyState = ({ icon, message }) => (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-gray-500">{message}</p>
  </div>
);

/**
 * SortButton Component
 * Button for sorting data
 */
const SortButton = ({ label, field, currentField, direction, onClick }) => {
  const isActive = currentField === field;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-2 py-1 border rounded ${
        isActive ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-600 bg-white'
      } hover:bg-gray-50 transition-colors`}
      aria-pressed={isActive}
      aria-label={`${label}, currently ${isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'not sorted'}`}
    >
      <span className="mr-1">{label}</span>
      {isActive && (
        direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
      )}
    </button>
  );
};

export default DashboardTab;