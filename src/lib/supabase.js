import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../services/environmentService';

// Validate supabase configuration
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  console.error('Supabase configuration is missing. Please check your environment variables.');
}

/**
 * Supabase client instance
 * Uses environment variables from the environment service
 */
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

/**
 * Handle Supabase errors consistently
 * @param {Object} error - The error object from Supabase
 * @param {string} fallbackMessage - Fallback message if error is not available
 * @returns {string} Formatted error message
 */
export const handleSupabaseError = (error, fallbackMessage = 'An error occurred') => {
  if (!error) return fallbackMessage;
  
  // Format the error message for display
  const errorMessage = error.message || error.error_description || fallbackMessage;
  
  // Log to console in development, could send to monitoring service in production
  console.error('Supabase Error:', error);
  
  return errorMessage;
};