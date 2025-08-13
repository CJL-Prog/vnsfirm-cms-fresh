import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

/**
 * Gets the CSRF token from the meta tag in the document
 * @returns {string|null} - The CSRF token or null if not found
 */
export const getCsrfToken = () => {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute('content') : null;
};

/**
 * Create Supabase client with global headers for CSRF protection
 */
const createSupabaseClient = () => {
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  };
  
  // Add global headers if in browser environment
  if (typeof document !== 'undefined') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      options.global = {
        headers: {
          'X-CSRF-Token': csrfToken
        }
      };
    }
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, options);
};

export const supabase = createSupabaseClient();

/**
 * Handles Supabase errors and returns user-friendly error messages
 * @param {Object} error - The error object from Supabase
 * @returns {string} - User-friendly error message
 */
export const handleSupabaseError = (error) => {
  if (!error) return 'An unknown error occurred'
  
  // Handle auth errors
  if (error.message) {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please try again.'
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link.'
      case 'User already registered':
        return 'An account with this email already exists.'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.'
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address.'
      case 'Token has expired or is invalid':
        return 'Your session has expired. Please sign in again.'
      default:
        return error.message
    }
  }
  
  // Handle network errors
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your internet connection.'
  }
  
  // Handle other error types
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred. Please try again.'
}