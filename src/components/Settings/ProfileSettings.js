import React, { useState } from 'react';
import { ChevronLeft, Upload, Save } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * ProfileSettings component
 * Manages user profile information and avatar
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const ProfileSettings = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@vnslawfirm.com',
    phone: '(555) 123-4567',
    title: 'Managing Partner',
    avatar: null
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification('Profile updated successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('Error updating profile', NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // In a real implementation, this would handle file upload
    addNotification('Avatar upload functionality coming soon', NotificationType.INFO);
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
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
            </div>
            <button 
              onClick={handleAvatarUpload}
              className="button button-outline"
            >
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
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input 
                type="text"
                value={profileData.title}
                onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                className="form-input"
              />
            </div>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="button button-success"
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;