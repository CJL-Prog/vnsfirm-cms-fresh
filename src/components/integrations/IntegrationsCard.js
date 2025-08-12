import React from 'react';

/**
 * IntegrationCard component
 * Card displaying integration information
 * 
 * @param {string} title - Integration title
 * @param {string} description - Integration description
 * @param {ReactNode} icon - Icon component
 * @param {string} iconBackground - Background color for icon
 * @param {string} iconColor - Color for icon
 * @param {string} status - Integration status ('connected', 'not-connected', 'coming-soon')
 * @param {Function} onClick - Function to call when card is clicked
 * @param {boolean} disabled - Whether the card is disabled
 */
const IntegrationCard = ({ 
  title, 
  description, 
  icon, 
  iconBackground, 
  iconColor,
  status = 'not-connected',
  onClick,
  disabled = false
}) => {
  // Get status display
  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return { 
          color: 'var(--color-success)', 
          text: 'Connected' 
        };
      case 'coming-soon':
        return { 
          color: 'var(--color-text-secondary)', 
          text: 'Coming Soon' 
        };
      case 'not-connected':
      default:
        return { 
          color: 'var(--color-text-secondary)', 
          text: 'Not Connected' 
        };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  
  return (
    <div 
      className={`integration-card ${disabled ? 'integration-card-disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="integration-card-header">
        <div>
          <h3 className="integration-card-title">{title}</h3>
          <p className="integration-card-description">{description}</p>
        </div>
        <div 
          className="integration-card-icon"
          style={{ backgroundColor: iconBackground }}
        >
          {React.cloneElement(icon, { style: { color: iconColor } })}
        </div>
      </div>
      
      <div className="integration-card-status">
        <div 
          className="integration-status-indicator"
          style={{ backgroundColor: statusDisplay.color }}
        ></div>
        <span 
          className="integration-status-text"
          style={{ color: statusDisplay.color }}
        >
          {statusDisplay.text}
        </span>
      </div>
      
      <button 
        className={`integration-card-button ${disabled ? 'integration-card-button-disabled' : ''}`}
        disabled={disabled}
      >
        {disabled ? 'Coming Soon' : 'Configure →'}
      </button>
    </div>
  );
};

export default IntegrationCard;