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
      style={{ 
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      <div className="integration-card-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-md)'
      }}>
        <div style={{ flex: 1 }}>
          <h3 className="integration-card-title" style={{
            fontSize: 'var(--font-lg)',
            fontWeight: '600',
            margin: '0 0 var(--space-xs) 0',
            color: 'var(--color-text)'
          }}>
            {title}
          </h3>
          <p className="integration-card-description" style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {description}
          </p>
        </div>
        <div 
          className="integration-card-icon"
          style={{ 
            backgroundColor: iconBackground,
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-lg)',
            marginLeft: 'var(--space-md)'
          }}
        >
          {React.cloneElement(icon, { 
            size: 24,
            style: { color: iconColor } 
          })}
        </div>
      </div>
      
      <div className="integration-card-status" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        marginBottom: 'var(--space-md)'
      }}>
        <div 
          className="integration-status-indicator"
          style={{ 
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: statusDisplay.color 
          }}
        ></div>
        <span 
          className="integration-status-text"
          style={{ 
            fontSize: 'var(--font-xs)',
            color: statusDisplay.color,
            fontWeight: '500'
          }}
        >
          {statusDisplay.text}
        </span>
      </div>
      
      <button 
        className={`integration-card-button ${disabled ? 'integration-card-button-disabled' : ''}`}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? 'var(--color-background)' : 'var(--color-primary)',
          color: disabled ? 'var(--color-text-secondary)' : 'white',
          border: 'none',
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-sm)',
          fontWeight: '500',
          cursor: disabled ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = 'var(--color-primary-dark)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = 'var(--color-primary)';
          }
        }}
      >
        {disabled ? 'Coming Soon' : 'Configure →'}
      </button>
    </div>
  );
};

export default IntegrationCard;