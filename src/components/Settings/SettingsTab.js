import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Shield, 
  Bell, 
  Settings, 
  Users,
  CreditCard,
  Database,
  ChevronLeft,
  Upload,
  Save,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  AlertCircle,
  FileText,
  Globe,
  Calendar,
  Download
} from 'lucide-react';

/**
 * SettingsTab component
 * Complete settings management system for the law firm CRM
 */
const SettingsTab = () => {
  // Single state object containing all settings
  const [state, setState] = useState({
    // UI state
    activeSection: 'overview',
    showPassword: false,
    loading: false,
    
    // User profile settings
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@vnslawfirm.com',
      phone: '(555) 123-4567',
      title: 'Managing Partner',
      avatar: null
    },
    
    // Firm settings
    firm: {
      firmName: 'VNS Law Firm',
      address: '123 Legal Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      phone: '(555) 987-6543',
      website: 'https://vnslawfirm.com',
      taxId: '12-3456789'
    },
    
    // Security settings
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: true,
      sessionTimeout: 480,
      loginNotifications: true
    },
    
    // Notification preferences
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      paymentReminders: true,
      clientUpdates: true,
      systemAlerts: true,
      weeklyReports: true,
      marketingEmails: false
    },
    
    // System preferences
    system: {
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12',
      currency: 'USD',
      language: 'English',
      autoBackup: true,
      backupFrequency: 'daily'
    }
  });
  
  // Helper function to update state
  const updateState = (updates) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  };
  
  // Helper function to update nested state objects
  const updateNestedState = (section, updates) => {
    setState(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        ...updates
      }
    }));
  };

  const handleSave = async (section) => {
    updateState({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${section} settings saved successfully!`);
    } catch (error) {
      alert(`Error saving ${section} settings`);
    } finally {
      updateState({ loading: false });
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'firm', label: 'Firm Settings', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  // Profile Settings Component
  const renderProfileSection = () => (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={() => updateState({ activeSection: 'overview' })}
          className="button button-outline mb-lg"
        >
          <ChevronLeft size={16} />
          Back to Settings
        </button>
        
        <h2 className="section-title">Profile Settings</h2>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Avatar Section */}
        <div>
          <div className="card text-center">
            <div className="mb-md">
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 auto'
              }}>
                {state.profile.firstName[0]}{state.profile.lastName[0]}
              </div>
            </div>
            <button className="button button-outline">
              <Upload size={16} />
              Upload Photo
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div>
          <div className="card">
            <div className="grid grid-cols-1 grid-cols-2 gap-md">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text"
                  value={state.profile.firstName}
                  onChange={(e) => updateNestedState('profile', { firstName: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text"
                  value={state.profile.lastName}
                  onChange={(e) => updateNestedState('profile', { lastName: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email"
                value={state.profile.email}
                onChange={(e) => updateNestedState('profile', { email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel"
                value={state.profile.phone}
                onChange={(e) => updateNestedState('profile', { phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input 
                type="text"
                value={state.profile.title}
                onChange={(e) => updateNestedState('profile', { title: e.target.value })}
                className="form-input"
              />
            </div>

            <button 
              onClick={() => handleSave('Profile')}
              disabled={state.loading}
              className="button button-success"
            >
              <Save size={16} />
              {state.loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Firm Settings Component
  const renderFirmSection = () => (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={() => updateState({ activeSection: 'overview' })}
          className="button button-outline mb-lg"
        >
          <ChevronLeft size={16} />
          Back to Settings
        </button>
        
        <h2 className="section-title">Firm Settings</h2>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Primary Information */}
        <div className="card">
          <h3 className="mb-md">Primary Information</h3>
          
          <div className="form-group">
            <label className="form-label">Firm Name</label>
            <input 
              type="text"
              value={state.firm.firmName}
              onChange={(e) => updateNestedState('firm', { firmName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input 
              type="text"
              value={state.firm.address}
              onChange={(e) => updateNestedState('firm', { address: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 grid-cols-3 gap-sm">
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text"
                value={state.firm.city}
                onChange={(e) => updateNestedState('firm', { city: e.target.value })}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">State</label>
              <select 
                value={state.firm.state}
                onChange={(e) => updateNestedState('firm', { state: e.target.value })}
                className="form-select"
              >
                <option value="CA">CA</option>
                <option value="NY">NY</option>
                <option value="TX">TX</option>
                <option value="FL">FL</option>
                <option value="NV">NV</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Zip Code</label>
              <input 
                type="text"
                value={state.firm.zipCode}
                onChange={(e) => updateNestedState('firm', { zipCode: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="mb-md">Contact Information</h3>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel"
              value={state.firm.phone}
              onChange={(e) => updateNestedState('firm', { phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input 
              type="url"
              value={state.firm.website}
              onChange={(e) => updateNestedState('firm', { website: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tax ID</label>
            <input 
              type="text"
              value={state.firm.taxId}
              onChange={(e) => updateNestedState('firm', { taxId: e.target.value })}
              className="form-input"
            />
          </div>

          <button 
            onClick={() => handleSave('Firm')}
            disabled={state.loading}
            className="button button-success"
          >
            <Save size={16} />
            {state.loading ? 'Saving...' : 'Save Firm Settings'}
          </button>
        </div>
      </div>

      {/* Office Locations */}
      <div className="card mt-lg">
        <h3 className="mb-md">Office Locations</h3>
        
        <div className="grid grid-cols-1 grid-cols-3 gap-md">
          {[
            { name: 'Orange County', clients: 42, status: 'Active' },
            { name: 'Los Angeles', clients: 38, status: 'Active' },
            { name: 'Las Vegas', clients: 25, status: 'Active' }
          ].map((location, index) => (
            <div key={index} className="card" style={{ backgroundColor: 'var(--color-background)' }}>
              <div className="flex items-center gap-sm mb-sm">
                <Building size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: '500' }}>{location.name}</span>
              </div>
              <p style={{ 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)', 
                margin: 0 
              }}>
                {location.status} â€¢ {location.clients} clients
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Security Settings Component
  const renderSecuritySection = () => (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={() => updateState({ activeSection: 'overview' })}
          className="button button-outline mb-lg"
        >
          <ChevronLeft size={16} />
          Back to Settings
        </button>
        
        <h2 className="section-title">Security Settings</h2>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-lg">
        {/* Password Change */}
        <div className="card">
          <h3 className="mb-md">Change Password</h3>

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={state.showPassword ? 'text' : 'password'}
                value={state.security.currentPassword}
                onChange={(e) => updateNestedState('security', { currentPassword: e.target.value })}
                className="form-input"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => updateState({ showPassword: !state.showPassword })}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {state.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password"
              value={state.security.newPassword}
              onChange={(e) => updateNestedState('security', { newPassword: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password"
              value={state.security.confirmPassword}
              onChange={(e) => updateNestedState('security', { confirmPassword: e.target.value })}
              className="form-input"
            />
          </div>

          <button 
            onClick={() => handleSave('Security')}
            disabled={state.loading}
            className="button button-success"
          >
            <Lock size={16} />
            {state.loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>

        {/* Security Options */}
        <div className="card">
          <h3 className="mb-md">Security Options</h3>

          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex justify-between items-center mb-sm">
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Two-Factor Authentication
              </span>
              <span className={`badge ${state.security.twoFactorEnabled ? 'badge-success' : 'badge-warning'}`}>
                {state.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)', 
              marginBottom: 'var(--space-sm)' 
            }}>
              Add an extra layer of security to your account
            </p>
            <button 
              className="button button-outline"
              onClick={() => updateNestedState('security', { twoFactorEnabled: !state.security.twoFactorEnabled })}
            >
              <Shield size={16} />
              {state.security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Session Timeout</label>
            <select 
              value={state.security.sessionTimeout}
              onChange={(e) => updateNestedState('security', { sessionTimeout: parseInt(e.target.value) })}
              className="form-select"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours</option>
              <option value={1440}>24 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Notification Settings Component
  const renderNotificationsSection = () => (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={() => updateState({ activeSection: 'overview' })}
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
          
          <div className="mb-md">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-sm)', 
              cursor: 'pointer',
              padding: 'var(--space-sm)'
            }}>
              <input 
                type="checkbox"
                checked={state.notifications.emailNotifications}
                onChange={(e) => updateNestedState('notifications', { emailNotifications: e.target.checked })}
              />
              <Mail size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: 'var(--font-sm)' }}>Email Notifications</span>
            </label>
          </div>

          <div className="mb-md">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-sm)', 
              cursor: 'pointer',
              padding: 'var(--space-sm)'
            }}>
              <input 
                type="checkbox"
                checked={state.notifications.smsNotifications}
                onChange={(e) => updateNestedState('notifications', { smsNotifications: e.target.checked })}
              />
              <Phone size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: 'var(--font-sm)' }}>SMS Notifications</span>
            </label>
          </div>

          <div className="mb-md">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-sm)', 
              cursor: 'pointer',
              padding: 'var(--space-sm)'
            }}>
              <input 
                type="checkbox"
                checked={state.notifications.pushNotifications}
                onChange={(e) => updateNestedState('notifications', { pushNotifications: e.target.checked })}
              />
              <Bell size={16} style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontSize: 'var(--font-sm)' }}>Push Notifications</span>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div className="card">
          <h3 className="mb-md">Notification Types</h3>
          
          {[
            { key: 'paymentReminders', label: 'Payment Reminders', icon: CreditCard },
            { key: 'clientUpdates', label: 'Client Updates', icon: User },
            { key: 'systemAlerts', label: 'System Alerts', icon: AlertCircle },
            { key: 'weeklyReports', label: 'Weekly Reports', icon: FileText },
            { key: 'marketingEmails', label: 'Marketing Emails', icon: Mail }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="mb-md">
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)', 
                cursor: 'pointer',
                padding: 'var(--space-sm)'
              }}>
                <input 
                  type="checkbox"
                  checked={state.notifications[key]}
                  onChange={(e) => updateNestedState('notifications', { [key]: e.target.checked })}
                />
                <Icon size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ fontSize: 'var(--font-sm)' }}>{label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-lg">
        <button 
          onClick={() => handleSave('Notifications')}
          disabled={state.loading}
          className="button button-success"
        >
          <Save size={16} />
          {state.loading ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </div>
  );

  // System Settings Component
  const renderSystemSection = () => (
    <div className="container">
      <div className="mb-lg">
        <button 
          onClick={() => updateState({ activeSection: 'overview' })}
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
              value={state.system.timezone}
              onChange={(e) => updateNestedState('system', { timezone: e.target.value })}
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
              value={state.system.dateFormat}
              onChange={(e) => updateNestedState('system', { dateFormat: e.target.value })}
              className="form-select"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Currency</label>
            <select 
              value={state.system.currency}
              onChange={(e) => updateNestedState('system', { currency: e.target.value })}
              className="form-select"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
        </div>

        {/* Backup & Storage */}
        <div className="card">
          <h3 className="mb-md">Backup & Storage</h3>

          <div className="card mb-md" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex justify-between items-center mb-sm">
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: '500' }}>
                Automatic Backup
              </span>
              <span className={`badge ${state.system.autoBackup ? 'badge-success' : 'badge-warning'}`}>
                {state.system.autoBackup ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className="form-group">
              <label className="form-label">Backup Frequency</label>
              <select 
                value={state.system.backupFrequency}
                onChange={(e) => updateNestedState('system', { backupFrequency: e.target.value })}
                className="form-select"
                disabled={!state.system.autoBackup}
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
                checked={state.system.autoBackup}
                onChange={(e) => updateNestedState('system', { autoBackup: e.target.checked })}
              />
              <span style={{ fontSize: 'var(--font-sm)' }}>
                Enable automatic backups
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-sm">
            <button className="button button-secondary">
              <Database size={16} />
              Backup Now
            </button>
            
            <button className="button button-outline">
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="mt-lg">
        <button 
          onClick={() => handleSave('System')}
          disabled={state.loading}
          className="button button-success"
        >
          <Save size={16} />
          {state.loading ? 'Saving...' : 'Save System Settings'}
        </button>
      </div>
    </div>
  );

  // Main render logic
  const renderContent = () => {
    switch (state.activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'firm':
        return renderFirmSection();
      case 'security':
        return renderSecuritySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'system':
        return renderSystemSection();
      case 'users':
        return (
          <div className="container">
            <button 
              onClick={() => updateState({ activeSection: 'overview' })}
              className="button button-outline mb-lg"
            >
              <ChevronLeft size={16} />
              Back to Settings
            </button>
            <h2 className="section-title">User Management</h2>
            <div className="card">
              <p className="text-center" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                User management features coming soon. Contact support for user access requests.
              </p>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="container">
            <button 
              onClick={() => updateState({ activeSection: 'overview' })}
              className="button button-outline mb-lg"
            >
              <ChevronLeft size={16} />
              Back to Settings
            </button>
            <h2 className="section-title">Billing & Subscription</h2>
            <div className="card">
              <p className="text-center" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                Billing management features coming soon. Contact support for billing inquiries.
              </p>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="container">
            <button 
              onClick={() => updateState({ activeSection: 'overview' })}
              className="button button-outline mb-lg"
            >
              <ChevronLeft size={16} />
              Back to Settings
            </button>
            <h2 className="section-title">Data Management</h2>
            <div className="grid grid-cols-1 grid-cols-2 gap-md">
              <div className="card">
                <h4 className="mb-sm">Import Data</h4>
                <p style={{ 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: 'var(--space-md)' 
                }}>
                  Import clients, cases, and documents from other systems
                </p>
                <button className="button button-outline">
                  Import Data
                </button>
              </div>
              <div className="card">
                <h4 className="mb-sm">Export Data</h4>
                <p style={{ 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: 'var(--space-md)' 
                }}>
                  Export your data for backup or migration purposes
                </p>
                <button className="button button-outline">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // If a specific section is selected, show its detail view
  if (state.activeSection !== 'overview') {
    return renderContent();
  }

  // Overview/Dashboard view
  return (
    <div className="container">
      <div className="mb-lg">
        <h1 className="section-title">Settings</h1>
        <p style={{ fontSize: 'var(--font-md)', color: 'var(--color-text-secondary)' }}>
          Manage your account, firm, and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
        {/* Profile Settings Card */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => updateState({ activeSection: 'profile' })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="flex items-center gap-md mb-md">
            <div style={{
              padding: 'var(--space-sm)',
              backgroundColor: '#dbeafe',
              borderRadius: 'var(--radius-lg)'
            }}>
              <User size={24} style={{ color: 'var(--color-secondary)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Profile Settings</h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Personal information and avatar
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: 'var(--font-sm)', 
            color: 'var(--color-text-secondary)', 
            margin: 0 
          }}>
            Update your personal details, contact information, and profile photo.
          </p>
        </div>

        {/* Firm Settings Card */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => updateState({ activeSection: 'firm' })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="flex items-center gap-md mb-md">
            <div style={{
              padding: 'var(--space-sm)',
              backgroundColor: '#f3e8ff',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Building size={24} style={{ color: 'var(--color-info)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Firm Settings</h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Company information and locations
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: 'var(--font-sm)', 
            color: 'var(--color-text-secondary)', 
            margin: 0 
          }}>
            Manage your law firm's details, office locations, and contact information.
          </p>
        </div>

        {/* Security Settings Card */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => updateState({ activeSection: 'security' })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="flex items-center gap-md mb-md">
            <div style={{
              padding: 'var(--space-sm)',
              backgroundColor: '#fee2e2',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Shield size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Security</h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Password and authentication
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: 'var(--font-sm)', 
            color: 'var(--color-text-secondary)', 
            margin: 0 
          }}>
            Update password, enable two-factor authentication, and manage security preferences.
          </p>
        </div>

        {/* Notifications Card */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => updateState({ activeSection: 'notifications' })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="flex items-center gap-md mb-md">
            <div style={{
              padding: 'var(--space-sm)',
              backgroundColor: '#fef3c7',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Bell size={24} style={{ color: 'var(--color-warning)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Notifications</h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Communication preferences
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: 'var(--font-sm)', 
            color: 'var(--color-text-secondary)', 
            margin: 0 
          }}>
            Configure email, SMS, and push notifications for payments and client updates.
          </p>
        </div>

        {/* System Settings Card */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => updateState({ activeSection: 'system' })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="flex items-center gap-md mb-md">
            <div style={{
              padding: 'var(--space-sm)',
              backgroundColor: '#dcfce7',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Settings size={24} style={{ color: 'var(--color-success)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>System</h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Regional and backup settings
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: 'var(--font-sm)', 
            color: 'var(--color-text-secondary)', 
            margin: 0 
          }}>
            Manage timezone, date formats, backup settings, and data management.
          </p>
        </div>

        {/* User Management Card */}
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'transform 0.2s', opacity: 0.6 }}
          onClick={() => updateState({ activeSection: 'users' })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="flex items-center gap-md mb-md">
            <div style={{
              padding: 'var(--space-sm)',
              backgroundColor: '#f0f9ff',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Users size={24} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>User Management</h3>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Team access and permissions
              </p>
            </div>
          </div>
          <p style={{ 
            fontSize: 'var(--font-sm)', 
            color: 'var(--color-text-secondary)', 
            margin: 0 
          }}>
            Manage team member access, roles, and permissions. (Coming Soon)
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-lg">
        <h3 className="mb-md">Quick Actions</h3>
        
        <div className="grid grid-cols-1 grid-cols-4 gap-md">
          <button 
            onClick={() => updateState({ activeSection: 'security' })}
            className="button button-outline"
          >
            <Shield size={16} />
            Change Password
          </button>
          
          <button 
            onClick={() => updateState({ activeSection: 'system' })}
            className="button button-outline"
          >
            <Database size={16} />
            Backup Data
          </button>
          
          <button 
            onClick={() => updateState({ activeSection: 'notifications' })}
            className="button button-outline"
          >
            <Bell size={16} />
            Update Notifications
          </button>
          
          <button 
            onClick={() => updateState({ activeSection: 'data' })}
            className="button button-outline"
          >
            <CreditCard size={16} />
            Export Data
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="card mt-lg">
        <h3 className="mb-md">System Status</h3>
        
        <div className="grid grid-cols-1 grid-cols-4 gap-md">
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-success)',
              marginBottom: 'var(--space-xs)'
            }}>
              99.9%
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Uptime
            </div>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-info)',
              marginBottom: 'var(--space-xs)'
            }}>
              6
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Active Integrations
            </div>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-xs)'
            }}>
              2.4 GB
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Storage Used
            </div>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-text)',
              marginBottom: 'var(--space-xs)'
            }}>
              Today
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Last Backup
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;