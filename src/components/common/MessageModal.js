import React, { useState, useEffect } from 'react';
import Modal from './Modal';

/**
 * MessageModal component
 * Modal for sending email, SMS, or logging calls
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal is closed
 * @param {Object} client - Client to send message to
 * @param {string} type - Message type ('EMAIL', 'SMS', 'CALL')
 * @param {Function} onSend - Function to call when message is sent
 */
const MessageModal = ({ 
  isOpen, 
  onClose, 
  client, 
  type = 'EMAIL', 
  onSend 
}) => {
  const [messageType, setMessageType] = useState(type);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Update message when type changes
  useEffect(() => {
    if (client) {
      setMessageType(type);
      setMessage(getDefaultMessage(type, client));
    }
  }, [client, type]);
  
  // Get default message based on type
  const getDefaultMessage = (type, client) => {
    const amount = ((client.total_balance || 0) - (client.paid_amount || 0)).toLocaleString();
    const firmName = client.law_firm || 'VNS Firm';
    
    if (type === 'SMS') {
      return `Hi ${client.name}, this is ${firmName}. This is a payment reminder. Please contact us at (555) 123-4567.`;
    } else if (type === 'EMAIL') {
      return `Dear ${client.name},\n\nThis is a friendly reminder about your payment. Please contact us if you have any questions.\n\nBest regards,\n${firmName}`;
    } else if (type === 'CALL') {
      return `Call to discuss payment with ${client.name}`;
    }
    return '';
  };
  
  // Handle message type change
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setMessageType(newType);
    setMessage(getDefaultMessage(newType, client));
  };
  
  // Handle message change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  // Handle send
  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      // In a real app, this would call an API to send the message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSend({
        type: messageType,
        client,
        message
      });
    } catch (error) {
      console.error(`Error sending ${messageType}:`, error);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  
  // Get button color based on message type
  const getButtonColor = () => {
    switch (messageType) {
      case 'EMAIL':
        return 'button-purple';
      case 'SMS':
        return 'button-green';
      case 'CALL':
        return 'button-yellow';
      default:
        return '';
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Send ${messageType} to ${client?.name || 'Client'}`}
    >
      <div className="message-form">
        <div className="form-group">
          <label className="form-label">Message Type</label>
          <select
            value={messageType}
            onChange={handleTypeChange}
            className="form-select"
          >
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
            <option value="CALL">Phone Call</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            {messageType === 'EMAIL' ? 'Email Message' : 
             messageType === 'SMS' ? 'SMS Message' : 'Call Notes'}
          </label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            className="form-textarea"
            placeholder={`Enter your ${messageType.toLowerCase()} message...`}
            rows={6}
          />
        </div>
        
        {client && (
          <div className="client-info-box">
            <div className="client-info-row">
              <span className="client-info-label">Client:</span>
              <span>{client.name}</span>
            </div>
            {messageType === 'EMAIL' && client.email && (
              <div className="client-info-row">
                <span className="client-info-label">Email:</span>
                <span>{client.email}</span>
              </div>
            )}
            {(messageType === 'SMS' || messageType === 'CALL') && client.phone && (
              <div className="client-info-row">
                <span className="client-info-label">Phone:</span>
                <span>{client.phone}</span>
              </div>
            )}
            <div className="client-info-row">
              <span className="client-info-label">Amount Due:</span>
              <span>${((client.total_balance || 0) - (client.paid_amount || 0)).toLocaleString()}</span>
            </div>
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
            type="button"
            onClick={handleSend}
            className={`button ${getButtonColor()}`}
            disabled={loading || !message.trim()}
          >
            {loading ? 'Sending...' : `Send ${messageType}`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;