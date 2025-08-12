import React, { useState } from 'react';
import { ChevronLeft, Mail, Phone, Bell, CreditCard, User, AlertCircle, FileText, Save } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * NotificationSettings component
 * Manages notification preferences and communication methods
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const NotificationSettings = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    paymentReminders: true,
    clientUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    marketingEmails: false
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification('Notification preferences updated successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      addNotification('Error updating notification settings', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

  const communicationMethods = [
    { 
      key: 'emailNotifications', 
      label: 'Email Notifications', 
      icon: Mail, 
      color: 'var(--color-secondary)' 
    },
    { 
      key: 'smsNotifications', 
      label: 'SMS Notifications', 
      icon: Phone, 
      color: 'var(--color-success)' 
    },
    { 
      key: 'pushNotifications', 
      label: 'Push Notifications', 
      icon: Bell, 
      color: 'var(--color-warning)' 
    }
  ];

  const notificationTypes = [
    { 
      key: 'paymentReminders', 
      label: 'Payment Reminders', 
      icon: CreditCard,
      description: 'Alerts about upcoming and overdue payments'
    },
    { 
      key: 'clientUpdates', 
      label: 'Client Updates', 
      icon: User,
      description: 'New client registrations and profile changes'
    },
    { 
      key: 'systemAlerts', 
      label: 'System Alerts', 
      icon: AlertCircle,
      description: 'Important system notifications and errors'
    },
    { 
      key: 'weeklyReports', 
      label: 'Weekly Reports', 
      icon: FileText,
      description: 'Automated weekly summary reports'
    },
    { 
      key: 'marketingEmails', 
      label: 'Marketing Emails', 
      icon: Mail,
      description: 'Product updates and promotional content'
    }
  ];

  return (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={onBack}
          className="button button-outline mb-lg"
        >
          <ChevronLeft size={16} />
          Back to Settings
        </button>
        
        <h2 className="section-title">Notification Preferences</h2>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Communication Methods */}
        <div className="card">
          <h3 className="mb-md">Communication Methods</h3>
          
          {communicationMethods.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="mb-md">
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)', 
                cursor: 'pointer',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-md)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-background)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <input 
                  type="checkbox"
                  checked={notificationData[key]}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, [key]: e.target.checked }))}
                />
                <Icon size={16} style={{ color }} />
                <span style={{ fontSize: 'var(--font-sm)' }}>{label}</span>
              </label>
            </div>
          ))}

          <div className="mt-md">
            <h4 style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-sm)' }}>
              Active Methods
            </h4>
            <div className="flex gap-sm">
              {communicationMethods.map(({ key, label, icon: Icon, color }) => 
                notificationData[key] && (
                  <span key={key} className="badge badge-info">
                    <Icon size={12} style={{ marginRight: '4px' }} />
                    {label.split(' ')[0]}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="card">
          <h3 className="mb-md">Notification Types</h3>
          
          {notificationTypes.map(({ key, label, icon: Icon, description }) => (
            <div key={key} className="mb-md">
              <div className="card" style={{ backgroundColor: 'var(--color-background)' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 'var(--space-sm)', 
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    checked={notificationData[key]}
                    onChange={(e) => setNotificationData(prev => ({ ...prev, [key]: e.target.checked }))}
                    style={{ marginTop: '2px' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <Icon size={16} style={{ color: 'var(--color-text-secondary)' }} />
                      <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                        {label}
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: 'var(--font-xs)', 
                      color: 'var(--color-text-secondary)', 
                      margin: 0 
                    }}>
                      {description}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="card mt-lg">
        <h3 className="mb-md">Notification Schedule</h3>
        
        <div className="grid grid-cols-1 grid-cols-3 gap-md">
          <div>
            <label className="form-label">Quiet Hours Start</label>
            <input 
              type="time"
              defaultValue="22:00"
              className="form-input"
            />
          </div>
          
          <div>
            <label className="form-label">Quiet Hours End</label>
            <input 
              type="time"
              defaultValue="08:00"
              className="form-input"
            />
          </div>
          
          <div>
            <label className="form-label">Timezone</label>
            <select className="form-select">
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/New_York">Eastern Time</option>
            </select>
          </div>
        </div>
        
        <div className="mt-md">
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-sm)', 
            cursor: 'pointer' 
          }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: 'var(--font-sm)' }}>
              Respect quiet hours for non-urgent notifications
            </span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-lg">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="button button-success"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;