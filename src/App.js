import React from 'react';
import './styles/global.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClientsProvider } from './contexts/ClientsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import AuthContainer from './components/auth/AuthContainer';
import Layout from './components/layout/Layout';

/**
 * AppContent component
 * Conditionally renders the application content based on authentication status
 */
const AppContent = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
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
  
  // If not authenticated, show auth container
  if (!user) {
    return <AuthContainer />;
  }
  
  // If authenticated, show main layout
  return (
    <ClientsProvider>
      <NotificationsProvider>
        <Layout />
      </NotificationsProvider>
    </ClientsProvider>
  );
};

/**
 * App component
 * Root component with context providers
 */
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;