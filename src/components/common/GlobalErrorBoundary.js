import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service
    console.error('Critical application error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to your error service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="global-error">
          <h1>Something went wrong</h1>
          <p>We're sorry, but there was a critical error in the application.</p>
          <button 
            onClick={() => window.location.reload()}
            className="button button-primary"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Logging function (replace with your logging service)
function logErrorToService(error, errorInfo) {
  // This would connect to your error monitoring service
  // Example with a fetch request:
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: error.toString(), stack: error.stack, componentStack: errorInfo.componentStack })
  }).catch(console.error);
}

export default GlobalErrorBoundary;