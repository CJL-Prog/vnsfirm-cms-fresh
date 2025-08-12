import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

/**
 * Notifications Context
 * Provides notification data and functions throughout the application
 */
const NotificationsContext = createContext();

/**
 * Notification types
 */
export const NotificationType = {
  INFO: 'info',
  WARNING: 'warning',
  ALERT: 'alert',
  SUCCESS: 'success'
};

/**
 * Notifications Provider Component
 * Manages notifications state and provides methods for CRUD operations
 */
export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up real-time updates for notifications
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user, currentPage, pageSize]);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch notifications with pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setNotifications(data || []);
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize));
      }
      
      // Get unread count
      const { count: unreadCountResult, error: unreadError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (unreadError) throw unreadError;
      
      setUnreadCount(unreadCountResult || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Error loading notifications');
    } finally {
      setLoading(false);
    }
  }, [user, currentPage, pageSize]);

  // Add a notification
  const addNotification = useCallback(async (message, type = NotificationType.INFO) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          message,
          type,
          user_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        }])
        .select();

      if (error) throw error;
      
      // Update local state if on first page
      if (currentPage === 1) {
        setNotifications(prev => [data[0], ...prev.slice(0, pageSize - 1)]);
      }
      
      setUnreadCount(prev => prev + 1);
      
      return data[0];
    } catch (error) {
      console.error('Error adding notification:', error);
      return null;
    }
  }, [user, currentPage, pageSize]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user]);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update local state
      const deleted = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [user, notifications]);

  // Change page
  const setPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Context value
  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    NotificationType
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

/**
 * Hook to use the notifications context
 */
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};