import React, { useState } from 'react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * ClientForm component
 * Form for adding and editing clients
 * 
 * @param {Object} initialData - Initial client data for editing (empty for new clients)
 * @param {boolean} isEdit - Whether this is an edit form (true) or add form (false)
 * @param {Function} onClose - Function to call when form is closed
 */
const ClientForm = ({ initialData = {}, isEdit = false, onClose }) => {
  const { addClient, updateClient } = useClients();
  const { addNotification, NotificationType } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize form data
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    law_firm: initialData.law_firm || '',
    total_balance: initialData.total_balance || '',
    paid_amount: initialData.paid_amount || '',
    next_due_date: initialData.next_due_date || '',
    payment_plan: initialData.payment_plan || '',
    status: initialData.status || 'Active',
    third_party_payor: initialData.third_party_payor || '',
    retainer_signed: initialData.retainer_signed || false
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Client name is required');
      }
      
      // Ensure numeric fields are valid
      const totalBalance = parseFloat(formData.total_balance) || 0;
      const paidAmount = parseFloat(formData.paid_amount) || 0;
      
      if (totalBalance < 0) {
        throw new Error('Total balance cannot be negative');
      }
      
      if (paidAmount < 0) {
        throw new Error('Paid amount cannot be negative');
      }
      
      if (paidAmount > totalBalance) {
        throw new Error('Paid amount cannot exceed total balance');
      }
      
      // Format client data
      const clientData = {
        ...formData,
        total_balance: totalBalance,
        paid_amount: paidAmount
      };
      
      // Add or update client
      if (isEdit) {
        await updateClient(initialData.id, clientData);
        addNotification(`Client ${clientData.name} updated successfully`, NotificationType.SUCCESS);
      } else {
        await addClient(clientData);
        addNotification(`Client ${clientData.name} added successfully`, NotificationType.SUCCESS);
      }
      
      // Close the form
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      setError(error.message);
      addNotification(`Error: ${error.message}`, NotificationType.ALERT);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Law Firm</label>
          <input
            name="law_firm"
            type="text"
            value={formData.law_firm}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Total Balance ($)</label>
          <input
            name="total_balance"
            type="number"
            step="0.01"
            value={formData.total_balance}
            onChange={handleChange}
            className="form-input"
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Amount Paid ($)</label>
          <input
            name="paid_amount"
            type="number"
            step="0.01"
            value={formData.paid_amount}
            onChange={handleChange}
            className="form-input"
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Next Due Date</label>
          <input
            name="next_due_date"
            type="date"
            value={formData.next_due_date}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Payment Plan</label>
          <input
            name="payment_plan"
            type="text"
            value={formData.payment_plan}
            onChange={handleChange}
            className="form-input"
            placeholder="Monthly - $500"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Active">Active</option>
            <option value="Past Due">Past Due</option>
            <option value="Paid in Full">Paid in Full</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Third Party Payor</label>
          <input
            name="third_party_payor"
            type="text"
            value={formData.third_party_payor}
            onChange={handleChange}
            className="form-input"
            placeholder="Insurance Company, etc."
          />
        </div>
      </div>
      
      <div className="form-checkbox">
        <input
          name="retainer_signed"
          type="checkbox"
          checked={formData.retainer_signed}
          onChange={handleChange}
          id="retainer-signed"
        />
        <label htmlFor="retainer-signed" className="form-label">
          Retainer Agreement Signed
        </label>
      </div>
      
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
      
      <div className="form-footer">
        <button
          type="button"
          onClick={onClose}
          className="button button-outline"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;