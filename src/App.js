import React, { useState, useEffect } from 'react';
import './styles/global.css';

// Safe imports with error handling
let AuthProvider, useAuth, ClientsProvider, NotificationsProvider;
let AuthContainer, Layout;

try {
  const authModule = require('./contexts/AuthContext');
  AuthProvider = authModule.AuthProvider;
  useAuth = authModule.useAuth;
  
  const clientsModule = require('./contexts/ClientsContext');
  ClientsProvider = clientsModule.ClientsProvider;
  
  const notificationsModule = require('./contexts/NotificationsContext');
  NotificationsProvider = notificationsModule.NotificationsProvider;
  
  AuthContainer = require('./components/auth/AuthContainer').default;
  Layout = require('./components/layout/Layout').default;
} catch (error) {
  console.error('Import error:', error);
}

/**
 * Error Boundary Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif' 
        }}>
          <h1 style={{ color: '#dc2626' }}>VNS Firm - Setup Required</h1>
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            padding: '20px',
            margin: '20px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h3 style={{ color: '#991b1b', margin: '0 0 10px 0' }}>Configuration Needed</h3>
            <p style={{ color: '#7f1d1d', margin: 0 }}>
              Please set up your Supabase environment variables in Vercel settings.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * AuthContent component - properly calls hooks at top level
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
 * Safe AppContent component with error handling
 */
const AppContent = () => {
  const [initError, setInitError] = useState(null);

  // Check if required components loaded
  useEffect(() => {
    if (!AuthProvider || !useAuth || !Layout) {
      setInitError('Missing required components');
      return;
    }
  }, []);

  if (initError) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h1 style={{ color: '#dc2626' }}>VNS Firm - Loading...</h1>
        <p>Initializing application components...</p>
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          padding: '15px',
          margin: '20px auto',
          maxWidth: '500px'
        }}>
          <p style={{ color: '#92400e', margin: 0 }}>
            If this message persists, please check your environment configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

/**
 * Main App component with comprehensive error handling
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;