import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog component
 * Dialog for confirming actions
 * 
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {Function} onClose - Function to call when dialog is closed
 * @param {Function} onConfirm - Function to call when action is confirmed
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 * @param {string} variant - Dialog variant ('danger', 'warning', 'info')
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  variant = 'danger' 
}) => {
  if (!isOpen) return null;
  
  // Get variant classes
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return 'confirm-dialog-warning';
      case 'info':
        return 'confirm-dialog-info';
      case 'danger':
      default:
        return 'confirm-dialog-danger';
    }
  };
  
  // Get button class
  const getButtonClass = () => {
    switch (variant) {
      case 'warning':
        return 'button-warning';
      case 'info':
        return 'button-info';
      case 'danger':
      default:
        return 'button-danger';
    }
  };
  
  return (
    <div className="modal-overlay" aria-modal="true" role="dialog">
      <div className={`confirm-dialog ${getVariantClass()}`}>
        <div className="confirm-dialog-icon">
          <AlertTriangle size={32} />
        </div>
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-buttons">
          <button 
            className="button button-outline"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`button ${getButtonClass()}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;