import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import DashboardTab from '../dashboard/DashboardTab';
import ClientsTab from '../clients/ClientsTab';
import CollectionsTab from '../collections/CollectionsTab';
import IntegrationsTab from '../integrations/IntegrationsTab';
import SettingsTab from '../Settings/SettingsTab';

/**
 * Layout component
 * Main application layout that manages tab state and renders content
 */
const Layout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'clients':
        return <ClientsTab />;
      case 'collections':
        return <CollectionsTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="app-layout">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main">
        <div className="content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Layout;