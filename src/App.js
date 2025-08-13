import React from 'react';
import './styles/global.css';
import './styles/design-system.css';
import './styles/components.css';
import './styles/specialized.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClientsProvider } from './contexts/ClientsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import AuthContainer from './components/auth/AuthContainer';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

/**
 * AuthContent component - handles authenticated vs non-authenticated states
 */
const AuthContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">VNS Firm</h1>
          <p className="auth-subtitle">Client Management System</p>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <AuthContainer />;
  }
  
  return (
    <ClientsProvider>
      <NotificationsProvider>
        <Layout />
      </NotificationsProvider>
    </ClientsProvider>
  );
};

/**
 * Main App component
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

// In App.js
return (
  <ErrorBoundary>
    <div className="skip-link-container">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
    </div>
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  </ErrorBoundary>
);

// Then in Layout.js:
<main className="main" id="main-content">
  <div className="content">
    {renderTabContent()}
  </div>
</main>

// Add styles in specialized.css:
.skip-link-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

export default App;