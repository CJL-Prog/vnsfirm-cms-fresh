import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct

// Create context
const ClientsContext = createContext();

// Custom hook to use the clients context
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

export const ClientsProvider = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientNotes, setClientNotes] = useState([]);
  const [clientPaymentHistory, setClientPaymentHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch clients on initial load
  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Error fetching clients');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add a new client
  const addClient = useCallback(async (clientData) => {
    setError(null);
    
    // Create new client with temporary ID
    const tempId = `temp-${Date.now()}`;
    const newClient = {
      id: tempId,
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
    
    // Optimistically update UI
    setClients(prev => [newClient, ...prev]);
    
    try {
      // API call - exclude the temporary ID
      const clientDataToSubmit = {...newClient};
      delete clientDataToSubmit.id;
      
      const { data, error } = await supabase
        .from('clients')
        .insert([clientDataToSubmit])
        .select();

      if (error) throw error;
      
      // Replace temp client with real one
      setClients(prev => prev.map(client => 
        client.id === tempId ? data[0] : client
      ));
      
      return data[0];
    } catch (error) {
      // Revert optimistic update on error
      setClients(prev => prev.filter(client => client.id !== tempId));
      console.error('Error adding client:', error);
      setError(`Error adding client: ${error.message}`);
      throw error;
    }
  }, [user]);

  // Update client
  const updateClient = useCallback(async (clientId, clientData) => {
    setError(null);
    
    // Find the current client to save for potential rollback
    const originalClient = clients.find(client => client.id === clientId);
    if (!originalClient) {
      setError('Client not found');
      throw new Error('Client not found');
    }
    
    // Create updated client data
    const updatedClient = {
      ...originalClient,
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
    
    // Optimistically update UI
    setClients(prev => prev.map(client => 
      client.id === clientId ? updatedClient : client
    ));
    
    // Update selected client if it's the one being edited
    if (selectedClient?.id === clientId) {
      setSelectedClient(updatedClient);
    }
    
    try {
      // Prepare data for API - exclude any fields that shouldn't be sent
      const clientDataToSubmit = {
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
        .update(clientDataToSubmit)
        .eq('id', clientId)
        .select();

      if (error) throw error;
      
      // Update with actual data from server
      setClients(prev => prev.map(client => 
        client.id === clientId ? data[0] : client
      ));
      
      // Update selected client if it's the one being edited
      if (selectedClient?.id === clientId) {
        setSelectedClient(data[0]);
      }
      
      return data[0];
    } catch (error) {
      // Revert optimistic update on error
      setClients(prev => prev.map(client => 
        client.id === clientId ? originalClient : client
      ));
      
      // Revert selected client if it's the one being edited
      if (selectedClient?.id === clientId) {
        setSelectedClient(originalClient);
      }
      
      console.error('Error updating client:', error);
      setError(`Error updating client: ${error.message}`);
      throw error;
    }
  }, [clients, user, selectedClient]);

  // Delete client
  const deleteClient = useCallback(async (clientId) => {
    setError(null);
    
    // Find the client to delete (save for potential rollback)
    const clientToDelete = clients.find(client => client.id === clientId);
    if (!clientToDelete) {
      setError('Client not found');
      throw new Error('Client not found');
    }
    
    // Optimistically update UI
    setClients(prev => prev.filter(client => client.id !== clientId));
    
    // Clear selected client if it's the one being deleted
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
    }
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      
      // Already updated UI optimistically, so just return success
      return true;
    } catch (error) {
      // Revert optimistic update on error
      setClients(prev => [...prev, clientToDelete]);
      
      // Restore selected client if it was the one being deleted
      if (selectedClient?.id === clientId) {
        setSelectedClient(clientToDelete);
      }
      
      console.error('Error deleting client:', error);
      setError(`Error deleting client: ${error.message}`);
      throw error;
    }
  }, [clients, selectedClient]);

  // Fetch client notes
  const fetchClientNotes = useCallback(async (clientId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientNotes(data || []);
    } catch (error) {
      console.error('Error fetching client notes:', error);
      setError('Error fetching client notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add client note
  const addClientNote = useCallback(async (clientId, noteText) => {
    setError(null);
    
    // Create temporary note
    const tempId = `temp-note-${Date.now()}`;
    const newNote = {
      id: tempId,
      client_id: clientId,
      note: noteText,
      created_by: user?.email,
      created_at: new Date().toISOString()
    };
    
    // Optimistically update UI
    setClientNotes(prev => [newNote, ...prev]);
    
    try {
      // Prepare data for API - exclude temporary ID
      const noteToSubmit = {
        client_id: clientId,
        note: noteText,
        created_by: user?.email,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('client_notes')
        .insert([noteToSubmit])
        .select();

      if (error) throw error;
      
      // Replace temp note with real one
      setClientNotes(prev => prev.map(note => 
        note.id === tempId ? data[0] : note
      ));
      
      return data[0];
    } catch (error) {
      // Revert optimistic update on error
      setClientNotes(prev => prev.filter(note => note.id !== tempId));
      
      console.error('Error adding note:', error);
      setError(`Error adding note: ${error.message}`);
      throw error;
    }
  }, [user]);

  // Fetch payment history
  const fetchClientPaymentHistory = useCallback(async (clientId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('client_id', clientId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setClientPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Error fetching payment history');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add payment
  const addPayment = useCallback(async (clientId, paymentData) => {
    setError(null);
    
    // Find the client
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      setError('Client not found');
      throw new Error('Client not found');
    }
    
    // Create temporary payment
    const tempId = `temp-payment-${Date.now()}`;
    const newPayment = {
      id: tempId,
      client_id: clientId,
      amount: paymentData.amount,
      payment_date: paymentData.payment_date || new Date().toISOString(),
      payment_method: paymentData.payment_method || 'manual',
      description: paymentData.description || 'Manual payment entry',
      created_at: new Date().toISOString()
    };
    
    // Calculate new paid amount and status
    const newPaidAmount = (client.paid_amount || 0) + paymentData.amount;
    const newPaymentStatus = newPaidAmount >= client.total_balance ? 'Completed' : 'Partial';
    const newStatus = newPaidAmount >= client.total_balance ? 'Paid in Full' : client.status;
    
    // Create updated client
    const updatedClient = {
      ...client,
      paid_amount: newPaidAmount,
      payment_status: newPaymentStatus,
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    // Optimistically update UI
    setClientPaymentHistory(prev => [newPayment, ...prev]);
    
    setClients(prev => prev.map(c => 
      c.id === clientId ? updatedClient : c
    ));
    
    if (selectedClient?.id === clientId) {
      setSelectedClient(updatedClient);
    }
    
    try {
      // First, add payment to history
      const paymentToSubmit = {
        client_id: clientId,
        amount: paymentData.amount,
        payment_date: paymentData.payment_date || new Date().toISOString(),
        payment_method: paymentData.payment_method || 'manual',
        description: paymentData.description || 'Manual payment entry',
        created_at: new Date().toISOString()
      };
      
      const { data: paymentResult, error: paymentError } = await supabase
        .from('payment_history')
        .insert([paymentToSubmit])
        .select();

      if (paymentError) throw paymentError;
      
      // Then, update client's paid amount
      const clientUpdate = {
        paid_amount: newPaidAmount,
        payment_status: newPaymentStatus,
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      const { data: clientResult, error: clientError } = await supabase
        .from('clients')
        .update(clientUpdate)
        .eq('id', clientId)
        .select();

      if (clientError) throw clientError;
      
      // Replace temp payment with real one
      setClientPaymentHistory(prev => prev.map(payment => 
        payment.id === tempId ? paymentResult[0] : payment
      ));
      
      // Update client with actual data from server
      setClients(prev => prev.map(c => 
        c.id === clientId ? clientResult[0] : c
      ));
      
      if (selectedClient?.id === clientId) {
        setSelectedClient(clientResult[0]);
      }
      
      return paymentResult[0];
    } catch (error) {
      // Revert all optimistic updates on error
      setClientPaymentHistory(prev => prev.filter(payment => payment.id !== tempId));
      
      setClients(prev => prev.map(c => 
        c.id === clientId ? client : c
      ));
      
      if (selectedClient?.id === clientId) {
        setSelectedClient(client);
      }
      
      console.error('Error adding payment:', error);
      setError(`Error adding payment: ${error.message}`);
      throw error;
    }
  }, [clients, selectedClient]);

  // Select a client
  const selectClient = useCallback((clientId) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    
    if (client) {
      fetchClientNotes(clientId);
      fetchClientPaymentHistory(clientId);
    }
  }, [clients, fetchClientNotes, fetchClientPaymentHistory]);

  // Context value
  const contextValue = {
    clients,
    selectedClient,
    clientNotes,
    clientPaymentHistory,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    selectClient,
    addClientNote,
    addPayment,
    fetchClientNotes,
    fetchClientPaymentHistory
  };

  return (
    <ClientsContext.Provider value={contextValue}>
      {children}
    </ClientsContext.Provider>
  );
};

export default ClientsContext;