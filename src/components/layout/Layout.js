import React, { useState, lazy, Suspense } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import ErrorBoundary from '../common/ErrorBoundary';

// Lazy load tab components for code splitting
const DashboardTab = lazy(() => import('../dashboard/DashboardTab'));
const ClientsTab = lazy(() => import('../clients/ClientsTab'));
const CollectionsTab = lazy(() => import('../collections/CollectionsTab'));
const IntegrationsTab = lazy(() => import('../integrations/IntegrationsTab'));
const SettingsTab = lazy(() => import('../Settings/SettingsTab'));

/**
 * Main Layout Component
 * Manages the overall application layout and tab switching
 */
const Layout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Loading component for Suspense fallback
  const TabLoader = () => (
    <div className="tab-loader">
      <div className="loading-spinner"></div>
      <p>Loading content...</p>
    </div>
  );

  // Render the content based on active tab
  const renderTabContent = () => {
    const TabComponent = (() => {
      switch (activeTab) {
        case 'dashboard':
          return DashboardTab;
        case 'clients':
          return ClientsTab;
        case 'collections':
          return CollectionsTab;
        case 'integrations':
          return IntegrationsTab;
        case 'settings':
          return SettingsTab;
        default:
          return DashboardTab;
      }
    })();

    return (
      <ErrorBoundary>
        <Suspense fallback={<TabLoader />}>
          <TabComponent />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="app-layout">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main" id="main-content">
        <div className="content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Layout;