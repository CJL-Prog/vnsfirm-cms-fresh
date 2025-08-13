import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Modal component
 * Reusable modal dialog
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal is closed
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size ('small', 'medium', 'large')
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium' 
}) => {
  const modalRef = useRef(null);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // In Modal.js
useEffect(() => {
  if (isOpen) {
    // Store current active element to restore focus later
    const previouslyFocused = document.activeElement;
    
    // Find focusable elements in modal
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      // Focus the first element
      focusableElements[0].focus();
    }
    
    return () => {
      // Restore focus when modal closes
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }
}, [isOpen]);
  
  if (!isOpen) return null;

  
  // Get size class
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'modal-small';
      case 'large':
        return 'modal-large';
      case 'medium':
      default:
        return 'modal-medium';
    }
  };
  
  return (
    <div className="modal-overlay" aria-modal="true" role="dialog">
      <div 
        className={`modal ${getSizeClass()}`} 
        ref={modalRef}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// In Modal.js
return (
  <div 
    className="modal-overlay" 
    aria-modal="true" 
    role="dialog"
    aria-labelledby={`modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
  >
    <div 
      className={`modal ${getSizeClass()}`} 
      ref={modalRef}
    >
      <div className="modal-header">
        <h2 
          className="modal-title" 
          id={`modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {title}
        </h2>
        <button 
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <div className="modal-content">
        {children}
      </div>
    </div>
  </div>
);

export default Modal;