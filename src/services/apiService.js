/**
 * API Service
 * Centralized service for handling API calls with error handling and response formatting
 */
import { supabase } from '../lib/supabase';

/**
 * Handle Supabase error responses
 * @param {Object} error - Error object from Supabase
 * @param {string} customMessage - Custom error message
 * @returns {Error} Formatted error object
 */
export const handleError = (error, customMessage = 'An error occurred') => {
  console.error(`API Error: ${customMessage}`, error);
  
  const errorMessage = error?.message || error?.error_description || customMessage;
  const formattedError = new Error(errorMessage);
  formattedError.originalError = error;
  
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
      
      return { 
        data, 
        count, 
        page, 
        limit, 
        totalPages: Math.ceil(count / limit) 
      };
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
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw handleError(error, `Error fetching client with ID ${id}`);
      }
      
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
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw handleError(error, `Error fetching notes for client ${clientId}`);
      }
      
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
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('client_id', clientId)
        .order('payment_date', { ascending: false });
      
      if (error) {
        throw handleError(error, `Error fetching payments for client ${clientId}`);
      }
      
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
      
      return { 
        data, 
        count, 
        page, 
        limit, 
        totalPages: Math.ceil(count / limit) 
      };
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
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) {
        throw handleError(error, 'Error fetching unread count');
      }
      
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
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) {
        throw handleError(error, `Error marking notification ${notificationId} as read`);
      }
      
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
      
      return { 
        data, 
        count, 
        page, 
        limit, 
        totalPages: Math.ceil(count / limit) 
      };
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
      
      return data[0];
    } catch (error) {
      throw handleError(error, 'Error creating collection effort');
    }
  }
};