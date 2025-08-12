import React, { useState } from 'react';
import { ChevronLeft, Building, Save } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * FirmSettings component
 * Manages law firm information and office locations
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const FirmSettings = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  const [firmData, setFirmData] = useState({
    firmName: 'VNS Law Firm',
    address: '123 Legal Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    phone: '(555) 987-6543',
    website: 'https://vnslawfirm.com',
    taxId: '12-3456789'
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification('Firm settings updated successfully', NotificationType.SUCCESS);
    } catch (error) {
      console.error('Error updating firm settings:', error);
      addNotification('Error updating firm settings', NotificationType.ALERT);
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
              value={firmData.firmName}
              onChange={(e) => setFirmData(prev => ({ ...prev, firmName: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input 
              type="text"
              value={firmData.address}
              onChange={(e) => setFirmData(prev => ({ ...prev, address: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 grid-cols-3 gap-sm">
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text"
                value={firmData.city}
                onChange={(e) => setFirmData(prev => ({ ...prev, city: e.target.value }))}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">State</label>
              <select 
                value={firmData.state}
                onChange={(e) => setFirmData(prev => ({ ...prev, state: e.target.value }))}
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
                value={firmData.zipCode}
                onChange={(e) => setFirmData(prev => ({ ...prev, zipCode: e.target.value }))}
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
              value={firmData.phone}
              onChange={(e) => setFirmData(prev => ({ ...prev, phone: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input 
              type="url"
              value={firmData.website}
              onChange={(e) => setFirmData(prev => ({ ...prev, website: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tax ID</label>
            <input 
              type="text"
              value={firmData.taxId}
              onChange={(e) => setFirmData(prev => ({ ...prev, taxId: e.target.value }))}
              className="form-input"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="button button-success"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Firm Settings'}
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
                <span className="font-weight-500">{location.name}</span>
              </div>
              <p style={{ 
                fontSize: 'var(--font-sm)', 
                color: 'var(--color-text-secondary)', 
                margin: 0 
              }}>
                {location.status} • {location.clients} clients
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-md">
          <button className="button button-outline">
            <Building size={16} />
            Add New Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirmSettings;