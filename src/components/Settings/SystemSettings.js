import React, { useState } from 'react';
import { ChevronLeft, Globe, Calendar, Database, Download, Upload, Save } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * SystemSettings component
 * Manages system preferences, regional settings, and data management
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const SystemSettings = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  const [systemData, setSystemData] = useState({
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'English',
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification('System settings updated successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error updating system settings:', error);
      addNotification('Error updating system settings', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    addNotification('Data export started. You will receive an email when ready.', NotificationType.INFO);
  };

  const handleImportData = () => {
    addNotification('Data import functionality coming soon', NotificationType.INFO);
  };

  const handleBackupNow = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addNotification('Backup completed successfully', NotificationType.SUCCESS);
    } catch (error) {
      addNotification('Backup failed', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

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
        
        <h2 className="section-title">System Preferences</h2>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Regional Settings */}
        <div className="card">
          <h3 className="mb-md">Regional Settings</h3>

          <div className="form-group">
            <label className="form-label">
              <Globe size={16} style={{ 
                display: 'inline', 
                marginRight: 'var(--space-xs)', 
                verticalAlign: 'middle' 
              }} />
              Timezone
            </label>
            <select 
              value={systemData.timezone}
              onChange={(e) => setSystemData(prev => ({ ...prev, timezone: e.target.value }))}
              className="form-select"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} style={{ 
                display: 'inline', 
                marginRight: 'var(--space-xs)', 
                verticalAlign: 'middle' 
              }} />
              Date Format
            </label>
            <select 
              value={systemData.dateFormat}
              onChange={(e) => setSystemData(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="form-select"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Time Format</label>
            <select 
              value={systemData.timeFormat}
              onChange={(e) => setSystemData(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="form-select"
            >
              <option value="12">12-hour (AM/PM)</option>
              <option value="24">24-hour</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Currency</label>
            <select 
              value={systemData.currency}
              onChange={(e) => setSystemData(prev => ({ ...prev, currency: e.target.value }))}
              className="form-select"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Language</label>
            <select 
              value={systemData.language}
              onChange={(e) => setSystemData(prev => ({ ...prev, language: e.target.value }))}
              className="form-select"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
            </select>
          </div>
        </div>

        {/* Backup & Storage */}
        <div className="card">
          <h3 className="mb-md">Backup & Storage</h3>

          {/* Auto Backup Status */}
          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex justify-between items-center mb-sm">
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Automatic Backup
              </span>
              <span className={`badge ${systemData.autoBackup ? 'badge-success' : 'badge-warning'}`}>
                {systemData.autoBackup ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)', 
              marginBottom: 'var(--space-sm)' 
            }}>
              Automatically backup your data to secure cloud storage
            </p>
            
            <div className="form-group">
              <label className="form-label">Backup Frequency</label>
              <select 
                value={systemData.backupFrequency}
                onChange={(e) => setSystemData(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="form-select"
                disabled={!systemData.autoBackup}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-sm)', 
              cursor: 'pointer' 
            }}>
              <input 
                type="checkbox"
                checked={systemData.autoBackup}
                onChange={(e) => setSystemData(prev => ({ ...prev, autoBackup: e.target.checked }))}
              />
              <span style={{ fontSize: 'var(--font-sm)' }}>
                Enable automatic backups
              </span>
            </label>
          </div>

          {/* Manual Actions */}
          <div className="grid grid-cols-1 gap-sm">
            <button 
              onClick={handleBackupNow}
              disabled={loading}
              className="button button-secondary"
            >
              <Database size={16} />
              {loading ? 'Backing up...' : 'Backup Now'}
            </button>
            
            <button 
              onClick={handleExportData}
              className="button button-outline"
            >
              <Download size={16} />
              Export Data
            </button>
            
            <button 
              onClick={handleImportData}
              className="button button-outline"
            >
              <Upload size={16} />
              Import Data
            </button>
          </div>
        </div>
      </div>

      {/* Storage Information */}
      <div className="card mt-lg">
        <h3 className="mb-md">Storage Information</h3>
        
        <div className="grid grid-cols-1 grid-cols-4 gap-md">
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-primary)' 
            }}>
              2.4 GB
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Total Used
            </div>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-success)' 
            }}>
              7.6 GB
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Available
            </div>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-info)' 
            }}>
              24%
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Usage
            </div>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-text)' 
            }}>
              {systemData.backupFrequency === 'daily' ? 'Daily' : 
               systemData.backupFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
            </div>
            <div style={{ 
              fontSize: 'var(--font-xs)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Backup Schedule
            </div>
          </div>
        </div>
        
        {/* Storage Usage Bar */}
        <div className="mt-md">
          <div style={{ 
            height: '8px', 
            backgroundColor: 'var(--color-border)', 
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              width: '24%', 
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-full)'
            }} />
          </div>
          <p style={{ 
            fontSize: 'var(--font-xs)', 
            color: 'var(--color-text-secondary)', 
            marginTop: 'var(--space-xs)',
            margin: 0
          }}>
            2.4 GB of 10 GB used
          </p>
        </div>
      </div>

      {/* Preview of Current Settings */}
      <div className="card mt-lg">
        <h3 className="mb-md">Current Settings Preview</h3>
        
        <div className="grid grid-cols-1 grid-cols-2 gap-md">
          <div>
            <h4 style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-sm)' }}>
              Date & Time Format
            </h4>
            <div style={{ 
              padding: 'var(--space-sm)', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-sm)',
              fontFamily: 'monospace'
            }}>
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: systemData.dateFormat.includes('MM') ? '2-digit' : 'short',
                day: '2-digit'
              })} {new Date().toLocaleTimeString('en-US', {
                hour12: systemData.timeFormat === '12'
              })}
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-sm)' }}>
              Currency Format
            </h4>
            <div style={{ 
              padding: 'var(--space-sm)', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-sm)',
              fontFamily: 'monospace'
            }}>
              {systemData.currency === 'USD' ? '$1,234.56' :
               systemData.currency === 'EUR' ? '€1.234,56' :
               systemData.currency === 'GBP' ? '£1,234.56' :
               'CA$1,234.56'}
            </div>
          </div>
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
          {loading ? 'Saving...' : 'Save System Settings'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;