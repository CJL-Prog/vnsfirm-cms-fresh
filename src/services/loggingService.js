// src/services/loggingService.js
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

const loggingService = {
  debug: (message, data = {}) => {
    log(LOG_LEVELS.DEBUG, message, data);
  },
  
  info: (message, data = {}) => {
    log(LOG_LEVELS.INFO, message, data);
  },
  
  warn: (message, data = {}) => {
    log(LOG_LEVELS.WARN, message, data);
  },
  
  error: (message, error = null, data = {}) => {
    log(LOG_LEVELS.ERROR, message, {
      ...data,
      errorMessage: error?.message,
      stack: error?.stack
    });
  }
};

const log = (level, message, data) => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console[level](`[${level.toUpperCase()}] ${message}`, data);
  }
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    try {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (e) {
      // Fail silently to avoid infinite loops
      console.error('Error sending log:', e);
    }
  }
};

export default loggingService;