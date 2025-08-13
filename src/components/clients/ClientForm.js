import React, { useState } from 'react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import * as Yup from 'yup';

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
  const [errors, setErrors] = useState({});
  
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

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('Client name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .nullable(),
    phone: Yup.string()
      .matches(/^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number format')
      .nullable(),
    total_balance: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .min(0, 'Total balance cannot be negative')
      .nullable(),
    paid_amount: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .min(0, 'Paid amount cannot be negative')
      .test(
        'paid-amount-test',
        'Paid amount cannot exceed total balance',
        function(value) {
          const { total_balance } = this.parent;
          if (!value || !total_balance) return true;
          return value <= total_balance;
        }
      )
      .nullable(),
    next_due_date: Yup.date()
      .nullable()
      .min(new Date(), 'Due date cannot be in the past'),
    status: Yup.string()
      .oneOf(['Active', 'Past Due', 'Paid in Full', 'Inactive'], 'Invalid status')
      .required('Status is required'),
    retainer_signed: Yup.boolean()
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear the specific error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Validate a single field
  const validateField = async (name, value) => {
    try {
      // Extract the specific field's schema
      const fieldSchema = Yup.reach(validationSchema, name);
      await fieldSchema.validate(value);
      return undefined;
    } catch (error) {
      return error.message;
    }
  };

  // Handle blur event for immediate validation feedback
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const error = await validateField(name, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  // Validate all form data
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return {};
    } catch (error) {
      const validationErrors = {};
      
      if (error.inner) {
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
      }
      
      return validationErrors;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form data using Yup
      const validationErrors = await validateForm();
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        throw new Error('Please fix the form errors');
      }
      
      // Format client data (ensuring numeric values)
      const clientData = {
        ...formData,
        total_balance: parseFloat(formData.total_balance) || 0,
        paid_amount: parseFloat(formData.paid_amount) || 0
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
      if (!Object.keys(errors).length) {
        // Only show general error if there are no field-specific errors
        addNotification(`Error: ${error.message}`, NotificationType.ALERT);
      }
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
            onBlur={handleBlur}
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
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
            onBlur={handleBlur}
            className={`form-input ${errors.total_balance ? 'form-input-error' : ''}`}
            placeholder="0.00"
          />
          {errors.total_balance && <div className="error-message">{errors.total_balance}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Amount Paid ($)</label>
          <input
            name="paid_amount"
            type="number"
            step="0.01"
            value={formData.paid_amount}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.paid_amount ? 'form-input-error' : ''}`}
            placeholder="0.00"
          />
          {errors.paid_amount && <div className="error-message">{errors.paid_amount}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Next Due Date</label>
          <input
            name="next_due_date"
            type="date"
            value={formData.next_due_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.next_due_date ? 'form-input-error' : ''}`}
          />
          {errors.next_due_date && <div className="error-message">{errors.next_due_date}</div>}
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
            onBlur={handleBlur}
            className={`form-select ${errors.status ? 'form-input-error' : ''}`}
          >
            <option value="Active">Active</option>
            <option value="Past Due">Past Due</option>
            <option value="Paid in Full">Paid in Full</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <div className="error-message">{errors.status}</div>}
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
      
      {Object.keys(errors).length > 0 && (
        <div className="form-error">
          Please fix the errors in the form
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