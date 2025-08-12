import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationsDropdown from '../common/NotificationsDropdown';

/**
 * Header component
 * Main application header with logo and user controls
 */
const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="logo">VNS Firm</h1>
          <p className="subtitle">Client Management System</p>
        </div>
        <div className="header-right">
          <NotificationsDropdown />
          <div className="user-section">
            <div className="user-avatar">
              <User style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
            </div>
            <span className="user-name">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </span>
            <button onClick={signOut} className="icon-button">
              <LogOut style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;