import React, { useState, memo } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * NotificationsDropdown component
 * Displays notifications in a dropdown menu
 */
const NotificationsDropdown = () => {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    markAsRead 
  } = useNotifications();
  
  const [showDropdown, setShowDropdown] = useState(false);

  // Toggle the dropdown
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.notifications-dropdown-container')) {
      setShowDropdown(false);
    }
  };

  // Mark a notification as read when clicked
  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get notification type color
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'alert':
        return 'var(--color-danger)';
      case 'warning':
        return 'var(--color-warning)';
      case 'success':
        return 'var(--color-success)';
      case 'info':
      default:
        return 'var(--color-secondary)';
    }
  };

  // Add event listener for outside clicks
  React.useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="notifications-dropdown-container">
      <button 
        onClick={toggleDropdown}
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
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="mark-read-button"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div 
                    className="notification-indicator"
                    style={{
                      backgroundColor: getNotificationTypeColor(notification.type)
                    }}
                  ></div>
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <p className="notification-time">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <Bell style={{ width: '48px', height: '48px', opacity: 0.3 }} />
                <p>No notifications</p>
              </div>
            )}
          </div>
          {notifications.length > 10 && (
            <div className="notification-footer">
              <button className="view-all-button">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(NotificationsDropdown);