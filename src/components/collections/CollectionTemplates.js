import React, { useState } from 'react';
import { ChevronLeft, Edit3 } from 'lucide-react';
import Modal from '../common/Modal';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * CollectionTemplates component
 * Manages message templates for collections
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const CollectionTemplates = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  
  // Templates state
  const [templates, setTemplates] = useState({
    smsDayBefore: "Hi {clientName}, this is {lawFirm}. Your payment of ${amount} is due tomorrow ({dueDate}). Please contact us if you have any questions.",
    smsDueDate: "Hi {clientName}, this is {lawFirm}. Your payment of ${amount} was due today. Please submit payment at your earliest convenience. Call us at (555) 123-4567.",
    smsDay3: "PAST DUE: {clientName}, this is {lawFirm}. Your payment of ${amount} is now 3 days overdue. Please contact us immediately at (555) 123-4567.",
    emailDay3: {
      subject: "Payment Past Due - {lawFirm} - Immediate Attention Required",
      body: "Dear {clientName},\n\nYour payment of ${amount} to {lawFirm} is now 3 days past due (original due date: {dueDate}).\n\nPlease submit payment immediately to avoid further collection actions. You can:\n\n• Pay online at [payment portal]\n• Call us at (555) 123-4567\n• Mail payment to our office\n\nThank you for your immediate attention to this matter.\n\n{lawFirm}\nAccounts Department"
    },
    smsDay5: "URGENT: {clientName}, this is {lawFirm}. Your payment of ${amount} is 5 days overdue. Immediate payment required. Call (555) 123-4567 now.",
    emailDay5: {
      subject: "URGENT: Payment 5 Days Past Due - {lawFirm}",
      body: "Dear {clientName},\n\nDespite our previous communications, your payment of ${amount} to {lawFirm} remains 5 days past due.\n\nIf payment is not received within 24 hours, we may need to:\n• Suspend services\n• Refer your account for collection\n• Add late fees per your agreement\n\nPlease contact us immediately at (555) 123-4567 to resolve this matter.\n\n{lawFirm}\nAccounts Department"
    },
    smsDay7: "FINAL NOTICE: {clientName}, this is {lawFirm}. Payment of ${amount} is 7 days overdue. Account may be sent to collections. Call (555) 123-4567 TODAY.",
    emailDay7: {
      subject: "FINAL NOTICE - {lawFirm} - Account May Be Referred to Collections",
      body: "Dear {clientName},\n\nThis is your FINAL NOTICE from {lawFirm} regarding the overdue payment of ${amount}.\n\nYour account is now 7 days past due. If payment is not received within 48 hours, your account will be:\n\n• Referred to our collection agency\n• Subject to additional fees and interest\n• Reported to credit agencies\n• Subject to legal action\n\nTo avoid these consequences, contact {lawFirm} immediately at (555) 123-4567.\n\n{lawFirm}\nAccounts Department"
    }
  });
  
  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState({ key: '', value: '' });
  
  // Handle opening template editor
  const openTemplateEditor = (templateKey, templateValue) => {
    setEditingTemplate({ key: templateKey, value: templateValue });
    setShowEditModal(true);
  };
  
  // Handle template update
  const handleTemplateUpdate = () => {
    setTemplates(prev => ({
      ...prev,
      [editingTemplate.key]: editingTemplate.value
    }));
    
    setShowEditModal(false);
    addNotification('Template updated successfully', NotificationType.SUCCESS);
  };

  return (
    <div className="templates-container">
      <div className="back-button-container">
        <button 
          onClick={onBack}
          className="button button-outline"
        >
          <ChevronLeft size={16} />
          Back to Collections
        </button>
      </div>
      
      <h3 className="card-title mt-md">Message Templates</h3>
      
      <div className="grid grid-cols-1">
        {/* SMS Templates */}
        <div className="card">
          <h3 className="card-title">SMS Templates</h3>
          <div className="templates-list">
            <div className="template-item">
              <div className="template-header">
                <h4 className="template-title">Day Before Due</h4>
                <button 
                  onClick={() => openTemplateEditor('smsDayBefore', templates.smsDayBefore)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                {templates.smsDayBefore}
              </div>
            </div>
            
            <div className="template-item">
              <div className="template-header">
                <h4 className="template-title">Due Date</h4>
                <button 
                  onClick={() => openTemplateEditor('smsDueDate', templates.smsDueDate)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                {templates.smsDueDate}
              </div>
            </div>
            
            <div className="template-item template-item-overdue">
              <div className="template-header">
                <h4 className="template-title">3 Days Past Due</h4>
                <button 
                  onClick={() => openTemplateEditor('smsDay3', templates.smsDay3)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                {templates.smsDay3}
              </div>
            </div>
            
            <div className="template-item template-item-overdue">
              <div className="template-header">
                <h4 className="template-title">5 Days Past Due</h4>
                <button 
                  onClick={() => openTemplateEditor('smsDay5', templates.smsDay5)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                {templates.smsDay5}
              </div>
            </div>
            
            <div className="template-item template-item-urgent">
              <div className="template-header">
                <h4 className="template-title">7 Days Past Due (Final)</h4>
                <button 
                  onClick={() => openTemplateEditor('smsDay7', templates.smsDay7)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                {templates.smsDay7}
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Templates */}
        <div className="card mt-lg">
          <h3 className="card-title">Email Templates</h3>
          <div className="templates-list">
            <div className="template-item template-item-overdue">
              <div className="template-header">
                <h4 className="template-title">3 Days Past Due Email</h4>
                <button 
                  onClick={() => openTemplateEditor('emailDay3', templates.emailDay3)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                <div className="template-subject">
                  <strong>Subject:</strong> {templates.emailDay3.subject}
                </div>
                <div className="template-body">
                  {templates.emailDay3.body.substring(0, 150)}...
                </div>
              </div>
            </div>
            
            <div className="template-item template-item-overdue">
              <div className="template-header">
                <h4 className="template-title">5 Days Past Due Email</h4>
                <button 
                  onClick={() => openTemplateEditor('emailDay5', templates.emailDay5)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                <div className="template-subject">
                  <strong>Subject:</strong> {templates.emailDay5.subject}
                </div>
                <div className="template-body">
                  {templates.emailDay5.body.substring(0, 150)}...
                </div>
              </div>
            </div>
            
            <div className="template-item template-item-urgent">
              <div className="template-header">
                <h4 className="template-title">7 Days Past Due Email (Final)</h4>
                <button 
                  onClick={() => openTemplateEditor('emailDay7', templates.emailDay7)}
                  className="icon-button icon-button-blue"
                  title="Edit Template"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <div className="template-content">
                <div className="template-subject">
                  <strong>Subject:</strong> {templates.emailDay7.subject}
                </div>
                <div className="template-body">
                  {templates.emailDay7.body.substring(0, 150)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Template Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Template: ${editingTemplate.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
      >
        {typeof editingTemplate.value === 'string' ? (
          <div className="form-group">
            <label className="form-label">Message Template</label>
            <textarea
              value={editingTemplate.value}
              onChange={(e) => setEditingTemplate(prev => ({ ...prev, value: e.target.value }))}
              className="form-textarea"
              rows={6}
            />
            <small className="form-hint">
              Available variables: {'{clientName}'}, {'{lawFirm}'}, {'{amount}'}, {'{dueDate}'}
            </small>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Email Subject</label>
              <input
                type="text"
                value={editingTemplate.value?.subject || ''}
                onChange={(e) => setEditingTemplate(prev => ({ 
                  ...prev, 
                  value: { ...prev.value, subject: e.target.value }
                }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Body</label>
              <textarea
                value={editingTemplate.value?.body || ''}
                onChange={(e) => setEditingTemplate(prev => ({ 
                  ...prev, 
                  value: { ...prev.value, body: e.target.value }
                }))}
                className="form-textarea"
                rows={10}
              />
              <small className="form-hint">
                Available variables: {'{clientName}'}, {'{lawFirm}'}, {'{amount}'}, {'{dueDate}'}
              </small>
            </div>
          </>
        )}
        
        <div className="form-footer">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="button button-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTemplateUpdate}
            className="button"
          >
            Save Template
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionTemplates;