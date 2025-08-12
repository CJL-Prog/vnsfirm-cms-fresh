import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

/**
 * Clients Context
 * Provides client data and management functions throughout the application
 */
const ClientsContext = createContext();

/**
 * Clients Provider Component
 * Manages client state and provides methods for CRUD operations
 */
export const ClientsProvider = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientNotes, setClientNotes] = useState([]);
  const [clientPaymentHistory, setClientPaymentHistory] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch clients when user is authenticated
  useEffect(() => {
    if (user) {
      fetchClients();
    } else {
      setClients([]);
      setLoading(false);
    }
  }, [user, currentPage, pageSize, sortField, sortDirection, statusFilter]);

  // Fetch clients from Supabase
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Start building the query
      let query = supabase
        .from('clients')
        .select('*', { count: 'exact' });
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      
      // Apply status filter if selected
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setClients(data || []);
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Error loading clients');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, statusFilter]);

  // Add a new client
  const addClient = useCallback(async (clientData) => {
    setError(null);
    
    try {
      const newClient = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        total_balance: clientData.total_balance,
        paid_amount: clientData.paid_amount,
        next_due_date: clientData.next_due_date,
        status: clientData.status,
        payment_plan: clientData.payment_plan,
        payment_status: 'Pending',
        law_firm: clientData.law_firm,
        retainer_signed: clientData.retainer_signed,
        third_party_payor: clientData.third_party_payor || null,
        created_by: user?.email,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select();

      if (error) throw error;

      // Update local state - add to beginning of array
      setClients(prev => [data[0], ...prev]);
      
      // Re-fetch to ensure pagination is correct
      fetchClients();
      
      return data[0];
    } catch (error) {
      console.error('Error adding client:', error);
      setError(`Error adding client: ${error.message}`);
      throw error;
    }
  }, [user, fetchClients]);

  // Update an existing client
  const updateClient = useCallback(async (clientId, clientData) => {
    setError(null);
    
    try {
      const updatedClient = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        total_balance: clientData.total_balance,
        paid_amount: clientData.paid_amount,
        next_due_date: clientData.next_due_date,
        status: clientData.status,
        payment_plan: clientData.payment_plan,
        law_firm: clientData.law_firm,
        retainer_signed: clientData.retainer_signed,
        third_party_payor: clientData.third_party_payor || null,
        modified_by: user?.email,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', clientId)
        .select();

      if (error) throw error;

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === clientId ? data[0] : client
      ));
      
      // Update selected client if it's the one being edited
      if (selectedClient?.id === clientId) {
        setSelectedClient(data[0]);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error updating client:', error);
      setError(`Error updating client: ${error.message}`);
      throw error;
    }
  }, [user, selectedClient]);

  // Delete a client
  const deleteClient = useCallback(async (clientId) => {
    setError(null);
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      // Update local state
      setClients(prev => prev.filter(client => client.id !== clientId));
      
      // Clear selected client if it's the one being deleted
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      setError(`Error deleting client: ${error.message}`);
      throw error;
    }
  }, [selectedClient]);

  // Fetch client notes
  const fetchClientNotes = useCallback(async (clientId) => {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setClientNotes(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching client notes:', error);
      setError(`Error loading notes: ${error.message}`);
      throw error;
    }
  }, []);

  // Add client note
  const addClientNote = useCallback(async (clientId, noteText) => {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .insert([{
          client_id: clientId,
          note: noteText,
          created_by: user?.email,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      // Update local state
      setClientNotes(prev => [data[0], ...prev]);
      
      return data[0];
    } catch (error) {
      console.error('Error adding note:', error);
      setError(`Error adding note: ${error.message}`);
      throw error;
    }
  }, [user]);

  // Fetch client payment history
  const fetchClientPaymentHistory = useCallback(async (clientId) => {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('client_id', clientId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      
      setClientPaymentHistory(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError(`Error loading payment history: ${error.message}`);
      throw error;
    }
  }, []);

  // Add payment to history
  const addPayment = useCallback(async (clientId, paymentData) => {
    setError(null);
    
    try {
      // First, add payment to history
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_history')
        .insert([{
          client_id: clientId,
          amount: paymentData.amount,
          payment_date: paymentData.payment_date || new Date().toISOString(),
          payment_method: paymentData.payment_method || 'manual',
          description: paymentData.description || 'Manual payment entry',
          created_at: new Date().toISOString()
        }])
        .select();

      if (paymentError) throw paymentError;
      
      // Then, update client's paid amount
      const client = clients.find(c => c.id === clientId);
      if (client) {
        const newPaidAmount = (client.paid_amount || 0) + paymentData.amount;
        
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .update({
            paid_amount: newPaidAmount,
            payment_status: newPaidAmount >= client.total_balance ? 'Completed' : 'Partial',
            status: newPaidAmount >= client.total_balance ? 'Paid in Full' : client.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', clientId)
          .select();

        if (clientError) throw clientError;
        
        // Update local states
        setClientPaymentHistory(prev => [paymentData[0], ...prev]);
        
        setClients(prev => prev.map(c => 
          c.id === clientId ? clientData[0] : c
        ));
        
        if (selectedClient?.id === clientId) {
          setSelectedClient(clientData[0]);
        }
      }
      
      return paymentData[0];
    } catch (error) {
      console.error('Error adding payment:', error);
      setError(`Error adding payment: ${error.message}`);
      throw error;
    }
  }, [clients, selectedClient]);

  // Load client profile with related data
  const loadClientProfile = useCallback(async (clientId) => {
    setError(null);
    setSelectedClient(null);
    
    try {
      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (clientError) throw clientError;
      
      setSelectedClient(clientData);
      
      // Fetch related data
      await Promise.all([
        fetchClientNotes(clientId),
        fetchClientPaymentHistory(clientId)
      ]);
      
      return clientData;
    } catch (error) {
      console.error('Error loading client profile:', error);
      setError(`Error loading client profile: ${error.message}`);
      throw error;
    }
  }, [fetchClientNotes, fetchClientPaymentHistory]);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    return clients.filter(client =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.law_firm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  // Get past due clients
  const pastDueClients = useMemo(() => {
    return clients.filter(client => {
      // Client is explicitly marked as Past Due
      if (client.status === 'Past Due') return true;
      
      // Client has outstanding balance and past due date
      const hasOutstandingBalance = (client.total_balance || 0) - (client.paid_amount || 0) > 0;
      const isPastDueDate = client.next_due_date && new Date(client.next_due_date) < new Date();
      
      return hasOutstandingBalance && isPastDueDate;
    });
  }, [clients]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const pastDueCount = pastDueClients.length;
    
    const totalRevenue = clients.reduce((sum, c) => sum + (c.paid_amount || 0), 0);
    const outstandingBalance = clients.reduce((sum, c) => sum + ((c.total_balance || 0) - (c.paid_amount || 0)), 0);
    const totalBalance = clients.reduce((sum, c) => sum + (c.total_balance || 0), 0);
    
    const collectionRate = totalBalance > 0 ? Math.round((totalRevenue / totalBalance) * 100) : 0;
    
    return {
      totalClients,
      activeClients,
      pastDueCount,
      totalRevenue,
      outstandingBalance,
      totalBalance,
      collectionRate
    };
  }, [clients, pastDueClients]);

  // Change page
  const setPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Change page size
  const changePageSize = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Change sort
  const changeSort = useCallback((field) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to first page
  }, [sortField]);

  // Context value
  const value = {
    clients,
    filteredClients,
    pastDueClients,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    addClient,
    updateClient,
    deleteClient,
    selectedClient,
    setSelectedClient,
    clientNotes,
    clientPaymentHistory,
    fetchClientNotes,
    addClientNote,
    fetchClientPaymentHistory,
    addPayment,
    loadClientProfile,
    metrics,
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    setPage,
    changePageSize,
    // Sorting and filtering
    sortField,
    sortDirection,
    changeSort,
    statusFilter,
    setStatusFilter
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
};

/**
 * Hook to use the clients context
 */
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};