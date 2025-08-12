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
      
      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              We're sorry, but an error occurred while rendering this component.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details</summary>
                <p className="error-name">{this.state.error?.toString()}</p>
                <pre className="error-stack">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              className="button button-primary"
              onClick={this.resetError}
            >
              Try Again
            </button>
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