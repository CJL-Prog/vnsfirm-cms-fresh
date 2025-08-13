import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Settings,
  Zap
} from 'lucide-react';

/**
 * Navigation component
 * Main application navigation with tabs
 * 
 * @param {string} activeTab - Currently active tab
 * @param {Function} setActiveTab - Function to change the active tab
 */
const Navigation = ({ activeTab, setActiveTab }) => {
  // Navigation items configuration
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'collections', name: 'Collections', icon: AlertTriangle },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <nav className="nav">
      <div className="card">
        {navItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-button ${
              activeTab === tab.id ? 'active-nav-button' : 'inactive-nav-button'
            }`}
          >
            <tab.icon style={{ width: '16px', height: '16px' }} />
            {tab.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;