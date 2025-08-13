/**
 * API Service
 * Centralized service for handling API calls with error handling and response formatting
 */
import { supabase } from '../lib/supabase';
import { cacheService } from '../services/cacheService';
import loggingService from './loggingService';

/**
 * Handle Supabase error responses
 * @param {Object} error - Error object from Supabase
 * @param {string} customMessage - Custom error message
 * @returns {Error} Formatted error object
 */
export const handleError = (error, customMessage = 'An error occurred') => {
  // Log the error
  loggingService.error(customMessage, error);
  
  // Determine specific error type
  let userMessage = customMessage;
  
  if (error?.code === '23505') {
    userMessage = 'This record already exists.';
  } else if (error?.code === '42P01') {
    userMessage = 'Database table not found. Please contact support.';
  } else if (error?.code === 'PGRST116') {
    userMessage = 'No permission to access this resource.';
  } else if (error?.message?.includes('network')) {
    userMessage = 'Network connection error. Please check your internet connection.';
  } else if (error?.message?.includes('timeout')) {
    userMessage = 'Request timed out. Please try again.';
  }
  
  const formattedError = new Error(userMessage);
  formattedError.originalError = error;
  formattedError.code = error?.code;
  
  return formattedError;
};

/**
 * Client API Methods
 */
export const clientsApi = {
  /**
   * Get clients with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Clients data and count
   */
  getClients: async ({ 
    page = 1, 
    limit = 10, 
    sortBy = 'created_at', 
    sortOrder = 'desc',
    status = null
  } = {}) => {
    const cacheKey = `clients_${page}_${limit}_${sortBy}_${sortOrder}_${status}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      // Calculate pagination range
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Build query
      let query = supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
      
      // Apply status filter if provided
      if (status) {
        query = query.eq('status', status);
      }
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) {
        throw handleError(error, 'Error fetching clients');
      }
      
      const result = { 
        data, 
        count, 
        page, 
        limit, 
        totalPages: Math.ceil(count / limit) 
      };
      
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      throw handleError(error, 'Error fetching clients');
    }
  },
  
  /**
   * Get a single client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client data
   */
  getClientById: async (id) => {
    const cacheKey = `client_${id}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw handleError(error, `Error fetching client with ID ${id}`);
      }
      
      cacheService.set(cacheKey, data);
      return data;
    } catch (error) {
      throw handleError(error, `Error fetching client with ID ${id}`);
    }
  },
  
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Created client data
   */
  createClient: async (clientData) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select();
      
      if (error) {
        throw handleError(error, 'Error creating client');
      }
      
      // Invalidate clients list cache
      cacheService.invalidateAll(); // Or more specifically with a prefix
      
      return data[0];
    } catch (error) {
      throw handleError(error, 'Error creating client');
    }
  },
  
  /**
   * Update an existing client
   * @param {string} id - Client ID
   * @param {Object} clientData - Updated client data
   * @returns {Promise<Object>} Updated client data
   */
  updateClient: async (id, clientData) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select();
      
      if (error) {
        throw handleError(error, `Error updating client with ID ${id}`);
      }
      
      // Invalidate specific client and clients list caches
      cacheService.invalidate(`client_${id}`);
      cacheService.invalidateAll(); // Or more specifically with a prefix
      
      return data[0];
    } catch (error) {
      throw handleError(error, `Error updating client with ID ${id}`);
    }
  },
  
  /**
   * Delete a client
   * @param {string} id - Client ID
   * @returns {Promise<boolean>} Success status
   */
  deleteClient: async (id) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw handleError(error, `Error deleting client with ID ${id}`);
      }
      
      // Invalidate specific client and clients list caches
      cacheService.invalidate(`client_${id}`);
      cacheService.invalidateAll(); // Or more specifically with a prefix
      
      return true;
    } catch (error) {
      throw handleError(error, `Error deleting client with ID ${id}`);
    }
  }
};

/**
 * Notes API Methods
 */
export const notesApi = {
  /**
   * Get notes for a client
   * @param {string} clientId - Client ID
   * @returns {Promise<Array>} Client notes
   */
  getClientNotes: async (clientId) => {
    const cacheKey = `client_notes_${clientId}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw handleError(error, `Error fetching notes for client ${clientId}`);
      }
      
      cacheService.set(cacheKey, data);
      return data;
    } catch (error) {
      throw handleError(error, `Error fetching notes for client ${clientId}`);
    }
  },
  
  /**
   * Add a note to a client
   * @param {Object} noteData - Note data
   * @returns {Promise<Object>} Created note data
   */
  addNote: async (noteData) => {
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .insert([noteData])
        .select();
      
      if (error) {
        throw handleError(error, 'Error adding note');
      }
      
      // Invalidate notes cache for this client
      const clientId = noteData.client_id;
      cacheService.invalidate(`client_notes_${clientId}`);
      
      return data[0];
    } catch (error) {
      throw handleError(error, 'Error adding note');
    }
  }
};

/**
 * Payments API Methods
 */
export const paymentsApi = {
  /**
   * Get payment history for a client
   * @param {string} clientId - Client ID
   * @returns {Promise<Array>} Payment history
   */
  getClientPayments: async (clientId) => {
    const cacheKey = `client_payments_${clientId}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('client_id', clientId)
        .order('payment_date', { ascending: false });
      
      if (error) {
        throw handleError(error, `Error fetching payments for client ${clientId}`);
      }
      
      cacheService.set(cacheKey, data);
      return data;
    } catch (error) {
      throw handleError(error, `Error fetching payments for client ${clientId}`);
    }
  },
  
  /**
   * Add a payment for a client
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment data
   */
  addPayment: async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .insert([paymentData])
        .select();
      
      if (error) {
        throw handleError(error, 'Error adding payment');
      }
      
      // Invalidate payments cache for this client
      const clientId = paymentData.client_id;
      cacheService.invalidate(`client_payments_${clientId}`);
      
      return data[0];
    } catch (error) {
      throw handleError(error, 'Error adding payment');
    }
  },
  
  /**
   * Update client balance after payment
   * @param {string} clientId - Client ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated client data
   */
  updateClientBalance: async (clientId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', clientId)
        .select();
      
      if (error) {
        throw handleError(error, `Error updating client balance for client ${clientId}`);
      }
      
      // Invalidate client cache
      cacheService.invalidate(`client_${clientId}`);
      cacheService.invalidateAll(); // Or more specifically with a prefix
      
      return data[0];
    } catch (error) {
      throw handleError(error, `Error updating client balance for client ${clientId}`);
    }
  }
};

/**
 * Notifications API Methods
 */
export const notificationsApi = {
  /**
   * Get notifications with pagination
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notifications data and count
   */
  getNotifications: async (userId, { page = 1, limit = 20 } = {}) => {
    const cacheKey = `notifications_${userId}_${page}_${limit}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      // Calculate pagination range
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw handleError(error, 'Error fetching notifications');
      }
      
      const result = { 
        data, 
        count, 
        page, 
        limit, 
        totalPages: Math.ceil(count / limit) 
      };
      
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      throw handleError(error, 'Error fetching notifications');
    }
  },
  
  /**
   * Get unread notification count
   * @param {string} userId - User ID
   * @returns {Promise<number>} Unread count
   */
  getUnreadCount: async (userId) => {
    const cacheKey = `notifications_unread_${userId}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) {
        throw handleError(error, 'Error fetching unread count');
      }
      
      cacheService.set(cacheKey, count);
      return count;
    } catch (error) {
      throw handleError(error, 'Error fetching unread count');
    }
  },
  
  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification data
   */
  createNotification: async (notificationData) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select();
      
      if (error) {
        throw handleError(error, 'Error creating notification');
      }
      
      // Invalidate notifications cache for this user
      const userId = notificationData.user_id;
      cacheService.invalidate(`notifications_unread_${userId}`);
      
      return data[0];
    } catch (error) {
      throw handleError(error, 'Error creating notification');
    }
  },
  
  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<boolean>} Success status
   */
  markAsRead: async (notificationId) => {
    try {
      // First get the notification to know the user_id
      const { data: notification, error: fetchError } = await supabase
        .from('notifications')
        .select('user_id')
        .eq('id', notificationId)
        .single();
      
      if (fetchError) {
        throw handleError(fetchError, `Error fetching notification ${notificationId}`);
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) {
        throw handleError(error, `Error marking notification ${notificationId} as read`);
      }
      
      // Invalidate notifications cache for this user
      const userId = notification.user_id;
      cacheService.invalidate(`notifications_unread_${userId}`);
      
      return true;
    } catch (error) {
      throw handleError(error, `Error marking notification ${notificationId} as read`);
    }
  },
  
  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  markAllAsRead: async (userId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) {
        throw handleError(error, 'Error marking all notifications as read');
      }
      
      // Invalidate notifications cache for this user
      cacheService.invalidate(`notifications_unread_${userId}`);
      
      return true;
    } catch (error) {
      throw handleError(error, 'Error marking all notifications as read');
    }
  }
};

/**
 * Collection Efforts API Methods
 */
export const collectionsApi = {
  /**
   * Get collection efforts
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Collection efforts
   */
  getCollectionEfforts: async ({ 
    clientId = null,
    page = 1, 
    limit = 20,
    sortBy = 'sent_date',
    sortOrder = 'desc'
  } = {}) => {
    const cacheKey = `collections_${clientId}_${page}_${limit}_${sortBy}_${sortOrder}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      // Calculate pagination range
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Build query
      let query = supabase
        .from('collection_efforts')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
      
      // Apply client filter if provided
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        throw handleError(error, 'Error fetching collection efforts');
      }
      
      const result = { 
        data, 
        count, 
        page, 
        limit, 
        totalPages: Math.ceil(count / limit) 
      };
      
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      throw handleError(error, 'Error fetching collection efforts');
    }
  },
  
  /**
   * Create a collection effort
   * @param {Object} effortData - Collection effort data
   * @returns {Promise<Object>} Created collection effort data
   */
  createCollectionEffort: async (effortData) => {
    try {
      const { data, error } = await supabase
        .from('collection_efforts')
        .insert([effortData])
        .select();
      
      if (error) {
        throw handleError(error, 'Error creating collection effort');
      }
      
      // Invalidate collections cache for this client
      const clientId = effortData.client_id;
      if (clientId) {
        cacheService.invalidate(`collections_${clientId}`);
      } else {
        // If no client ID, invalidate all collections caches
        cacheService.invalidateAll(); // Or more specifically with a prefix
      }
      
      return data[0];
    } catch (error) {
      throw handleError(error, 'Error creating collection effort');
    }
  }
};