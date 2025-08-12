import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../lib/supabase';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * Manages authentication state and provides methods for login, signup, etc.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Initialize auth state on mount
  useEffect(() => {
    // Check current auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth session:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
        
        // Initialize user settings on first signup
        if (event === 'SIGNED_UP' && session?.user) {
          await initializeUserSettings(session.user);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Initialize user settings on signup
  const initializeUserSettings = async (user) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .insert([{
          user_id: user.id,
          company_name: user.user_metadata?.company_name || 'My Firm',
          automation_enabled: true,
          sms_day_before_enabled: true,
          sms_due_date_enabled: true,
          email_day3_enabled: true,
          email_day5_enabled: true,
          email_day7_enabled: true,
          created_at: new Date().toISOString()
        }]);

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error initializing user settings:', error);
      }
    } catch (error) {
      console.error('Error initializing user settings:', error);
    }
  };

  // Sign in with email/password
  const signIn = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'Error signing in');
      setAuthError(errorMessage);
      throw error;
    }
  }, []);

  // Sign up with email/password
  const signUp = useCallback(async (email, password, userData = {}) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'Error creating account');
      setAuthError(errorMessage);
      throw error;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      return true;
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'Error sending reset email');
      setAuthError(errorMessage);
      throw error;
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'Error updating profile');
      setAuthError(errorMessage);
      throw error;
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (newPassword) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = handleSupabaseError(error, 'Error updating password');
      setAuthError(errorMessage);
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  // Clear auth errors
  const clearErrors = useCallback(() => {
    setAuthError(null);
  }, []);

  // Context value
  const value = {
    user,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    clearErrors,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};