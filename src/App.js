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
 * Main App component with accessibility skip link
 */
const App = () => {
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
};

export default App;