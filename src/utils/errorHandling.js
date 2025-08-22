/**
 * Comprehensive error handling utilities
 */

/**
 * Error types enum
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error boundary fallback component
 */
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback">
      <div className="error-content">
        <h2>Something went wrong</h2>
        <p>{error?.message || 'An unexpected error occurred'}</p>
        <div className="error-actions">
          <button onClick={resetErrorBoundary} className="button button-primary">
            Try Again
          </button>
          <button onClick={() => window.location.href = '/'} className="button button-secondary">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Log error to console and potentially to external service
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    type: error.type || ErrorTypes.UNKNOWN,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
  // if (process.env.NODE_ENV === 'production') {
  //   sendToErrorTrackingService(errorInfo);
  // }

  return errorInfo;
};

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return new AppError(
      'No internet connection. Please check your network and try again.',
      ErrorTypes.NETWORK
    );
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return new AppError(
      'Request timed out. Please try again.',
      ErrorTypes.TIMEOUT
    );
  }

  // HTTP status code errors
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new AppError(
          data?.message || 'Invalid request. Please check your input.',
          ErrorTypes.VALIDATION,
          data?.errors
        );
      
      case 401:
        return new AppError(
          'Your session has expired. Please sign in again.',
          ErrorTypes.AUTH
        );
      
      case 403:
        return new AppError(
          'You do not have permission to perform this action.',
          ErrorTypes.PERMISSION
        );
      
      case 404:
        return new AppError(
          'The requested resource was not found.',
          ErrorTypes.NOT_FOUND
        );
      
      case 429:
        return new AppError(
          'Too many requests. Please wait a moment and try again.',
          ErrorTypes.NETWORK
        );
      
      case 500:
      case 502:
      case 503:
      case 504:
        return new AppError(
          'Server error. Please try again later.',
          ErrorTypes.SERVER
        );
      
      default:
        return new AppError(
          data?.message || `An error occurred (${status})`,
          ErrorTypes.UNKNOWN
        );
    }
  }

  // Fallback for unknown errors
  return new AppError(
    error.message || 'An unexpected error occurred',
    ErrorTypes.UNKNOWN
  );
};

/**
 * Retry failed operations with exponential backoff
 */
export const retryWithBackoff = async (
  operation,
  maxRetries = 3,
  initialDelay = 1000
) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      if (
        error.type === ErrorTypes.AUTH ||
        error.type === ErrorTypes.PERMISSION ||
        error.type === ErrorTypes.VALIDATION
      ) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, i);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * delay * 0.1;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }
  
  throw lastError;
};

/**
 * Create a user-friendly error message
 */
export const getUserFriendlyError = (error) => {
  // Check if it's already an AppError with a user-friendly message
  if (error instanceof AppError) {
    return error.message;
  }

  // Handle specific error patterns
  const errorMessage = error.message?.toLowerCase() || '';
  
  if (errorMessage.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (errorMessage.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }
  
  if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
    return 'Please sign in to continue.';
  }
  
  if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
    return 'You do not have permission to access this resource.';
  }
  
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'The requested item could not be found.';
  }
  
  if (errorMessage.includes('validation')) {
    return 'Please check your input and try again.';
  }
  
  // Default message
  return 'An error occurred. Please try again later.';
};

/**
 * Validate required fields
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  if (Object.keys(errors).length > 0) {
    throw new AppError(
      'Please fill in all required fields',
      ErrorTypes.VALIDATION,
      errors
    );
  }
  
  return true;
};

/**
 * Handle form validation errors
 */
export const handleFormError = (error, setFieldError) => {
  if (error.type === ErrorTypes.VALIDATION && error.details) {
    // Set individual field errors
    Object.entries(error.details).forEach(([field, message]) => {
      if (setFieldError) {
        setFieldError(field, message);
      }
    });
    return error.details;
  }
  
  // Return general error
  return { general: getUserFriendlyError(error) };
};

/**
 * Create an error notification object
 */
export const createErrorNotification = (error) => {
  return {
    id: Date.now().toString(),
    type: 'error',
    title: 'Error',
    message: getUserFriendlyError(error),
    timestamp: new Date().toISOString(),
    dismissible: true
  };
};

/**
 * Check if an error is retryable
 */
export const isRetryableError = (error) => {
  const nonRetryableTypes = [
    ErrorTypes.AUTH,
    ErrorTypes.PERMISSION,
    ErrorTypes.VALIDATION,
    ErrorTypes.NOT_FOUND
  ];
  
  return !nonRetryableTypes.includes(error.type);
};