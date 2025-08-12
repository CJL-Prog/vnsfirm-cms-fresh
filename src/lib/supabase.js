import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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