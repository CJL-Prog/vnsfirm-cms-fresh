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
      <div className="card">
        <div>
          <h1 className="logo">VNS Firm</h1>
          <p className="subtitle">Client Management System</p>
        </div>
        <div className="card">
          <NotificationsDropdown />
          <div className="card">
            <div className="card">
              <User style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
            </div>
            <span className="card">
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