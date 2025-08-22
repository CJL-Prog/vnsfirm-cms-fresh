import React from 'react';

/**
 * ErrorBoundary component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Log environment information for debugging
    console.error('Environment info:', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL ? 'SET' : 'NOT SET',
        REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
      }
    });
    
    this.setState({ errorInfo });
    
    // Optional: Send to monitoring service
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;
      
      // If a custom fallback component is provided, use it
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.resetError}
          />
        );
      }
      
      // Default error UI with enhanced debugging
      return (
        <div className="error-boundary" style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div className="error-container">
            <h2 className="error-title" style={{ color: '#d63031', marginBottom: '10px' }}>
              Something went wrong
            </h2>
            <p className="error-message" style={{ color: '#636e72', marginBottom: '15px' }}>
              We're sorry, but an error occurred while rendering this component.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <button
                className="button button-primary"
                onClick={this.resetError}
                style={{
                  backgroundColor: '#0984e3',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#00b894',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Refresh Page
              </button>
            </div>

            {/* Always show environment info for production debugging */}
            <details className="error-details" style={{ marginBottom: '15px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Environment Information
              </summary>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}>
                <p>Environment: {process.env.NODE_ENV}</p>
                <p>Supabase URL: {process.env.REACT_APP_SUPABASE_URL ? 'Configured' : '❌ Missing'}</p>
                <p>Supabase Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Configured' : '❌ Missing'}</p>
                <p>Current URL: {window.location.href}</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </details>

            <details className="error-details">
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Technical Details
              </summary>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'monospace',
                fontSize: '12px',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  <strong>Component Stack:</strong>
                  {this.state.errorInfo?.componentStack}
                </pre>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  <strong>Error Stack:</strong>
                  {this.state.error?.stack}
                </pre>
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
export const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="error-boundary">
      <div className="error-container">
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          className="button button-primary"
          onClick={resetError}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;