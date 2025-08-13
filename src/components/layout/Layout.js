import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import DashboardTab from '../dashboard/DashboardTab';
import ClientsTab from '../clients/ClientsTab';
import CollectionsTab from '../collections/CollectionsTab';
import IntegrationsTab from '../integrations/IntegrationsTab';
import SettingsTab from '../Settings/SettingsTab';
import ErrorBoundary from '../common/ErrorBoundary';

/**
 * Main Layout Component
 * Manages the overall application layout and tab switching
 */
const Layout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Render the content based on active tab
  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return (
            <ErrorBoundary>
              <DashboardTab />
            </ErrorBoundary>
          );
        case 'clients':
          return (
            <ErrorBoundary>
              <ClientsTab />
            </ErrorBoundary>
          );
        case 'collections':
          return (
            <ErrorBoundary>
              <CollectionsTab />
            </ErrorBoundary>
          );
        case 'integrations':
          return (
            <ErrorBoundary>
              <IntegrationsTab />
            </ErrorBoundary>
          );
        case 'settings':
          return (
            <ErrorBoundary>
              <SettingsTab />
            </ErrorBoundary>
          );
        default:
          return (
            <ErrorBoundary>
              <DashboardTab />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="container">
          <div className="card">
            <h2>Unable to load content</h2>
            <p>There was an error loading this section. Please try refreshing the page.</p>
            <button 
              className="button button-primary" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
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