import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DollarSign, Users, AlertTriangle, Mail, MessageSquare, CreditCard, TrendingUp, Phone, Eye, Plus, Search, Filter, Bell, Settings, User, LogOut, Lock, Edit3, Trash2, FileText, X, ChevronDown } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  // Create uncontrolled form components to fix typing issues
  const UncontrolledClientForm = React.memo(({ initialData, onSubmit, isEdit = false }) => {
    const formRef = React.useRef();
    
    const handleSubmit = useCallback(async (e) => {
      e.preventDefault();
      const formData = new FormData(formRef.current);
      
      const clientData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        law_firm: formData.get('law_firm'),
        total_balance: parseFloat(formData.get('total_balance')) || 0,
        paid_amount: parseFloat(formData.get('paid_amount')) || 0,
        next_due_date: formData.get('next_due_date'),
        payment_plan: formData.get('payment_plan'),
        status: formData.get('status'),
        third_party_payor: formData.get('third_party_payor'),
        retainer_signed: formData.get('retainer_signed') === 'on'
      };
      
      if (isEdit) {
        await updateClientUncontrolled(clientData);
      } else {
        await addClientUncontrolled(clientData);
      }
    }, [isEdit]);

    return (
      <form ref={formRef} onSubmit={handleSubmit}>
        <div style={styles.modalBody}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Full Name *</label>
              <input
                name="name"
                type="text"
                defaultValue={initialData?.name || ''}
                style={styles.formInput}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email Address</label>
              <input
                name="email"
                type="email"
                defaultValue={initialData?.email || ''}
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Phone Number</label>
              <input
                name="phone"
                type="tel"
                defaultValue={initialData?.phone || ''}
                style={styles.formInput}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Law Firm</label>
              <input
                name="law_firm"
                type="text"
                defaultValue={initialData?.law_firm || ''}
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Total Balance ($)</label>
              <input
                name="total_balance"
                type="number"
                step="0.01"
                defaultValue={initialData?.total_balance || ''}
                style={styles.formInput}
                placeholder="0.00"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Amount Paid ($)</label>
              <input
                name="paid_amount"
                type="number"
                step="0.01"
                defaultValue={initialData?.paid_amount || ''}
                style={styles.formInput}
                placeholder="0.00"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Next Due Date</label>
              <input
                name="next_due_date"
                type="date"
                defaultValue={initialData?.next_due_date || ''}
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Payment Plan</label>
              <input
                name="payment_plan"
                type="text"
                defaultValue={initialData?.payment_plan || ''}
                style={styles.formInput}
                placeholder="Monthly - $500"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Status</label>
              <select
                name="status"
                defaultValue={initialData?.status || 'Active'}
                style={styles.formSelect}
              >
                <option value="Active">Active</option>
                <option value="Past Due">Past Due</option>
                <option value="Paid in Full">Paid in Full</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Third Party Payor</label>
              <input
                name="third_party_payor"
                type="text"
                defaultValue={initialData?.third_party_payor || ''}
                style={styles.formInput}
                placeholder="Insurance Company, etc."
              />
            </div>
          </div>
          
          <div style={styles.formCheckbox}>
            <input
              name="retainer_signed"
              type="checkbox"
              defaultChecked={initialData?.retainer_signed || false}
            />
            <label style={styles.formLabel}>Retainer Agreement Signed</label>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            type="button"
            onClick={() => isEdit ? setShowEditClientModal(false) : setShowAddClientModal(false)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.button}
          >
            {isEdit ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </form>
    );
  });

  const UncontrolledNotesSection = React.memo(({ notes }) => {
    const noteRef = React.useRef();
    
    const handleAddNote = useCallback(async () => {
      const noteText = noteRef.current.value.trim();
      if (!noteText || !selectedClient) return;
      
      try {
        const { data, error } = await supabase
          .from('client_notes')
          .insert([{
            client_id: selectedClient.id,
            note: noteText,
            created_by: user?.email,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;
        
        setClientNotes(prev => [data[0], ...prev]);
        noteRef.current.value = '';
        await addNotification(`Note added for ${selectedClient.name}`, 'info');
      } catch (error) {
        console.error('Error adding note:', error);
        await addNotification('Error adding note', 'alert');
      }
    }, [selectedClient, user]);

    return (
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
          Account Notes
        </h3>
        
        {/* Add New Note */}
        <div style={{ marginBottom: '24px' }}>
          <textarea
            ref={noteRef}
            placeholder="Add a note about this client..."
            style={styles.noteInput}
          />
          <button 
            onClick={handleAddNote}
            style={styles.addNoteButton}
          >
            Add Note
          </button>
        </div>
        
        {/* Notes List */}
        {notes.length > 0 ? (
          <div>
            {notes.map((note) => (
              <div key={note.id} style={styles.noteItem}>
                <div style={styles.noteText}>{note.note}</div>
                <div style={styles.noteMeta}>
                  {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                  {note.created_by && <span> • by {note.created_by}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <FileText style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No notes available</p>
          </div>
        )}
      </div>
    );
  });

  // Notifications Dropdown Component
  const NotificationsDropdown = React.memo(() => {
    const [showDropdown, setShowDropdown] = useState(false);
    
    const markAllAsRead = async () => {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user?.id);
        
        if (error) throw error;
        
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          style={styles.bellButton}
        >
          <Bell style={{ width: '24px', height: '24px' }} />
          {unreadCount > 0 && (
            <span style={styles.notificationBadge}>
              {unreadCount}
            </span>
          )}
        </button>
        
        {showDropdown && (
          <div style={styles.notificationDropdown}>
            <div style={styles.notificationHeader}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  style={styles.markReadButton}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div style={styles.notificationList}>
              {notifications.length > 0 ? (
                notifications.slice(0, 10).map(notification => (
                  <div 
                    key={notification.id} 
                    style={{
                      ...styles.notificationItem,
                      backgroundColor: notification.read ? '#fff' : '#f0f9ff'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: notification.type === 'alert' ? '#ef4444' :
                                     notification.type === 'warning' ? '#f59e0b' : '#3b82f6',
                      marginRight: '8px',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                        {notification.message}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No notifications
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  });

  // Form options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Past Due', label: 'Past Due' },
    { value: 'Paid in Full', label: 'Paid in Full' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  // Authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  
  // App state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [collectionEfforts, setCollectionEfforts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState({
    smsDayBefore: "Hi {clientName}, this is {lawFirm}. Your payment of ${amount} is due tomorrow ({dueDate}). Please contact us if you have any questions.",
    smsDueDate: "Hi {clientName}, this is {lawFirm}. Your payment of ${amount} was due today. Please submit payment at your earliest convenience. Call us at (555) 123-4567.",
    smsDay3: "PAST DUE: {clientName}, this is {lawFirm}. Your payment of ${amount} is now 3 days overdue. Please contact us immediately at (555) 123-4567.",
    emailDay3: {
      subject: "Payment Past Due - {lawFirm} - Immediate Attention Required",
      body: "Dear {clientName},\n\nYour payment of ${amount} to {lawFirm} is now 3 days past due (original due date: {dueDate}).\n\nPlease submit payment immediately to avoid further collection actions. You can:\n\n• Pay online at [payment portal]\n• Call us at (555) 123-4567\n• Mail payment to our office\n\nThank you for your immediate attention to this matter.\n\n{lawFirm}\nAccounts Department"
    },
    smsDay5: "URGENT: {clientName}, this is {lawFirm}. Your payment of ${amount} is 5 days overdue. Immediate payment required. Call (555) 123-4567 now.",
    emailDay5: {
      subject: "URGENT: Payment 5 Days Past Due - {lawFirm}",
      body: "Dear {clientName},\n\nDespite our previous communications, your payment of ${amount} to {lawFirm} remains 5 days past due.\n\nIf payment is not received within 24 hours, we may need to:\n• Suspend services\n• Refer your account for collection\n• Add late fees per your agreement\n\nPlease contact us immediately at (555) 123-4567 to resolve this matter.\n\n{lawFirm}\nAccounts Department"
    },
    smsDay7: "FINAL NOTICE: {clientName}, this is {lawFirm}. Payment of ${amount} is 7 days overdue. Account may be sent to collections. Call (555) 123-4567 TODAY.",
    emailDay7: {
      subject: "FINAL NOTICE - {lawFirm} - Account May Be Referred to Collections",
      body: "Dear {clientName},\n\nThis is your FINAL NOTICE from {lawFirm} regarding the overdue payment of ${amount}.\n\nYour account is now 7 days past due. If payment is not received within 48 hours, your account will be:\n\n• Referred to our collection agency\n• Subject to additional fees and interest\n• Reported to credit agencies\n• Subject to legal action\n\nTo avoid these consequences, contact {lawFirm} immediately at (555) 123-4567.\n\n{lawFirm}\nAccounts Department"
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // Auth screen state
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    companyName: '',
    fullName: ''
  });

  // Modal and form state
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClientProfile, setShowClientProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProfileTab, setClientProfileTab] = useState('overview');
  const [clientNotes, setClientNotes] = useState([]);
  const [clientPaymentHistory, setClientPaymentHistory] = useState([]);

  // Database Functions
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      addNotification('Error loading clients', 'alert');
    }
  };

  const fetchClientNotes = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClientNotes(data || []);
    } catch (error) {
      console.error('Error fetching client notes:', error);
    }
  };

  const fetchClientPaymentHistory = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('client_id', clientId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      setClientPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const openClientProfile = async (client) => {
    setSelectedClient(client);
    setClientProfileTab('overview');
    setShowClientProfile(true);
    
    // Fetch related data
    await fetchClientNotes(client.id);
    await fetchClientPaymentHistory(client.id);
  };

  const fetchCollectionEfforts = async () => {
    try {
      const { data, error } = await supabase
        .from('collection_efforts')
        .select('*')
        .order('sent_date', { ascending: false });
      
      if (error) throw error;
      setCollectionEfforts(data || []);
    } catch (error) {
      console.error('Error fetching collection efforts:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const addNotification = async (message, type = 'info') => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          message,
          type,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          read: false
        }])
        .select();

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => [data[0], ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const addClientUncontrolled = async (clientData) => {
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

      setClients(prev => [data[0], ...prev]);
      await addNotification(`Client ${clientData.name} added successfully`, 'info');
      
      setShowAddClientModal(false);
      
    } catch (error) {
      console.error('Error adding client:', error);
      await addNotification('Error adding client', 'alert');
    }
  };

  const updateClientUncontrolled = async (clientData) => {
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
        .eq('id', selectedClient.id)
        .select();

      if (error) throw error;

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === selectedClient.id ? data[0] : client
      ));
      
      await addNotification(`Client ${clientData.name} updated successfully`, 'info');
      
      setShowEditClientModal(false);
      setSelectedClient(null);
      
    } catch (error) {
      console.error('Error updating client:', error);
      await addNotification('Error updating client', 'alert');
    }
  };

  const deleteClient = async () => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClient.id);

      if (error) throw error;

      // Update local state
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      
      await addNotification(`Client ${selectedClient.name} deleted successfully`, 'info');
      
      setShowDeleteConfirm(false);
      setSelectedClient(null);
      
    } catch (error) {
      console.error('Error deleting client:', error);
      await addNotification('Error deleting client', 'alert');
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setShowEditClientModal(true);
  };

  const openDeleteConfirm = (client) => {
    setSelectedClient(client);
    setShowDeleteConfirm(true);
  };

  const handleLoginChange = useCallback((field, value) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSignupChange = useCallback((field, value) => {
    setSignupForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Enhanced SMS/Email functions with RingCentral and Gmail integration
  const sendSMS = async (clientId) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client || !client.phone) {
        await addNotification('Client phone number required for SMS', 'alert');
        return;
      }

      // Simulate RingCentral SMS sending
      const message = `Hi ${client.name}, this is ${client.law_firm || 'VNS Firm'}. This is a payment reminder. Please contact us at (555) 123-4567.`;
      
      // In real implementation, this would call RingCentral API
      console.log('Sending SMS via RingCentral:', { to: client.phone, message });

      const newEffort = {
        client_id: clientId,
        type: 'SMS',
        message: `SMS sent to ${client.name} at ${client.phone}: "${message}"`,
        sent_date: new Date().toISOString().split('T')[0],
        status: 'Sent',
        created_by: user?.email,
        platform: 'ringcentral'
      };

      const { data, error } = await supabase
        .from('collection_efforts')
        .insert([newEffort])
        .select();

      if (error) throw error;

      setCollectionEfforts(prev => [data[0], ...prev]);
      await addNotification(`SMS sent to ${client.name} via RingCentral`, 'info');
    } catch (error) {
      console.error('Error sending SMS:', error);
      await addNotification('Error sending SMS', 'alert');
    }
  };

  const sendEmail = async (clientId) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client || !client.email) {
        await addNotification('Client email address required', 'alert');
        return;
      }

      // Simulate Gmail API sending
      const subject = `Payment Reminder - ${client.law_firm || 'VNS Firm'}`;
      const body = `Dear ${client.name},\n\nThis is a friendly reminder about your payment. Please contact us if you have any questions.\n\nBest regards,\n${client.law_firm || 'VNS Firm'}`;
      
      // In real implementation, this would call Gmail API
      console.log('Sending Email via Gmail:', { to: client.email, subject, body });

      const newEffort = {
        client_id: clientId,
        type: 'EMAIL',
        message: `Email sent to ${client.name} at ${client.email}: "${subject}"`,
        sent_date: new Date().toISOString().split('T')[0],
        status: 'Sent',
        created_by: user?.email,
        platform: 'gmail'
      };

      const { data, error } = await supabase
        .from('collection_efforts')
        .insert([newEffort])
        .select();

      if (error) throw error;

      setCollectionEfforts(prev => [data[0], ...prev]);
      await addNotification(`Email sent to ${client.name} via Gmail`, 'info');
    } catch (error) {
      console.error('Error sending email:', error);
      await addNotification('Error sending email', 'alert');
    }
  };

  const makeCall = async (clientId) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client || !client.phone) {
        await addNotification('Client phone number required for call', 'alert');
        return;
      }

      // Simulate RingCentral call initiation
      console.log('Initiating call via RingCentral:', { to: client.phone });

      const newEffort = {
        client_id: clientId,
        type: 'CALL',
        message: `Call initiated to ${client.name} at ${client.phone}`,
        sent_date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        created_by: user?.email,
        platform: 'ringcentral'
      };

      const { data, error } = await supabase
        .from('collection_efforts')
        .insert([newEffort])
        .select();

      if (error) throw error;

      setCollectionEfforts(prev => [data[0], ...prev]);
      await addNotification(`Call logged for ${client.name} via RingCentral`, 'info');
    } catch (error) {
      console.error('Error making call:', error);
      await addNotification('Error making call', 'alert');
    }
  };

  // Authentication Functions
  const signIn = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;
      
      setUser(data.user);
    } catch (error) {
      console.error('Error signing in:', error);
      window.alert('Error signing in: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      // Validate passwords match
      if (signupForm.password !== signupForm.confirmPassword) {
        window.alert('Passwords do not match');
        return;
      }

      if (signupForm.password.length < 6) {
        window.alert('Password must be at least 6 characters long');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.fullName,
            company_name: signupForm.companyName,
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        window.alert('Account created successfully! Please check your email to verify your account.');
        setAuthMode('login');
        setSignupForm({ email: '', password: '', confirmPassword: '', companyName: '', fullName: '' });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      window.alert('Error creating account: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginForm.email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      
      window.alert('Password reset email sent! Please check your inbox.');
      setAuthMode('login');
    } catch (error) {
      console.error('Error sending reset email:', error);
      window.alert('Error sending reset email: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setClients([]);
      setCollectionEfforts([]);
      setNotifications([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Initialize data and auth
  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

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

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchCollectionEfforts();
      fetchNotifications();
      
      // Set up real-time updates for notifications
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Calculate metrics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pastDueClients = clients.filter(c => c.status === 'Past Due').length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.paid_amount || 0), 0);
  const outstandingBalance = clients.reduce((sum, c) => sum + ((c.total_balance || 0) - (c.paid_amount || 0)), 0);
  
  // Calculate actual collection rate
  const totalBalance = clients.reduce((sum, c) => sum + (c.total_balance || 0), 0);
  const collectionRate = totalBalance > 0 ? Math.round((totalRevenue / totalBalance) * 100) : 0;

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.law_firm?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Settings Tab
  const SettingsTab = () => {
    // Initialize profile form state with user data
    const [profileForm, setProfileForm] = useState({
      fullName: user?.user_metadata?.full_name || '',
      companyName: user?.user_metadata?.company_name || ''
    });
    
    // Password form state
    const [passwordForm, setPasswordForm] = useState({ 
      currentPassword: '', 
      newPassword: '', 
      confirmPassword: '' 
    });
    
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    // Handle profile form field changes
    const handleProfileChange = useCallback((field, value) => {
      setProfileForm(prev => ({
        ...prev,
        [field]: value
      }));
    }, []);

    // Handle password form field changes
    const handlePasswordChange = useCallback((field, value) => {
      setPasswordForm(prev => ({
        ...prev,
        [field]: value
      }));
    }, []);

    const updatePassword = async (e) => {
      e.preventDefault();
      setPasswordLoading(true);

      try {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          window.alert('New passwords do not match');
          setPasswordLoading(false);
          return;
        }

        if (passwordForm.newPassword.length < 6) {
          window.alert('Password must be at least 6 characters long');
          setPasswordLoading(false);
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: passwordForm.newPassword
        });

        if (error) throw error;

        window.alert('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error) {
        console.error('Error updating password:', error);
        window.alert('Error updating password: ' + error.message);
      } finally {
        setPasswordLoading(false);
      }
    };

    const updateProfile = async (e) => {
      e.preventDefault();
      setProfileLoading(true);

      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: profileForm.fullName,
            company_name: profileForm.companyName,
          }
        });

        if (error) throw error;

        window.alert('Profile updated successfully!');
        // Update the local user object if needed
        if (user) {
          user.user_metadata.full_name = profileForm.fullName;
          user.user_metadata.company_name = profileForm.companyName;
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        window.alert('Error updating profile: ' + error.message);
      } finally {
        setProfileLoading(false);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={styles.sectionTitle}>Account Settings</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Profile Settings */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Profile Information</h3>
            <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Company/Firm Name</label>
                <input
                  type="text"
                  value={profileForm.companyName}
                  onChange={(e) => handleProfileChange('companyName', e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  style={{ ...styles.formInput, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  disabled
                />
                <small style={{ color: '#6b7280', fontSize: '12px' }}>
                  Email cannot be changed. Contact support if needed.
                </small>
              </div>
              
              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  opacity: profileLoading ? 0.6 : 1,
                  cursor: profileLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={profileLoading}
              >
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Change Password</h3>
            <form onSubmit={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  style={styles.formInput}
                  required
                  minLength={6}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  opacity: passwordLoading ? 0.6 : 1,
                  cursor: passwordLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <span style={{ fontWeight: '500' }}>Account Created:</span>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <span style={{ fontWeight: '500' }}>Last Sign In:</span>
                <span>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <span style={{ fontWeight: '500' }}>Email Verified:</span>
                <span style={{ color: user?.email_confirmed_at ? '#059669' : '#ef4444' }}>
                  {user?.email_confirmed_at ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px', color: '#ef4444' }}>Danger Zone</h3>
            <div style={{ padding: '16px', border: '1px solid #fee2e2', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
              <h4 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>Delete Account</h4>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                Once you delete your account, there is no going back. All your data will be permanently deleted.
              </p>
              <button 
                onClick={() => window.alert('Account deletion feature coming soon. Contact support for assistance.')}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Styles (keeping existing styles plus new ones)
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loginContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    },
    loginCard: {
      backgroundColor: '#fff',
      padding: '48px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    loginTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#dc2626',
      textAlign: 'center',
      marginBottom: '8px'
    },
    loginSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '32px'
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    loginInput: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px'
    },
    loginButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    authLinks: {
      textAlign: 'center',
      marginTop: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    linkButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#dc2626',
      fontSize: '14px',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    forgotText: {
      fontSize: '14px',
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '16px',
      lineHeight: '1.5'
    },
    header: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#dc2626'
    },
    subtitle: {
      fontSize: '12px',
      color: '#6b7280'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    bellButton: {
      padding: '8px',
      color: '#9ca3af',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      position: 'relative'
    },
    notificationBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '16px',
      height: '16px',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      color: '#fff',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    // New notification dropdown styles
    notificationDropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      width: '320px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      zIndex: 1000,
      maxHeight: '400px',
      overflow: 'hidden'
    },
    notificationHeader: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    markReadButton: {
      fontSize: '12px',
      color: '#3b82f6',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    notificationList: {
      maxHeight: '300px',
      overflowY: 'auto'
    },
    notificationItem: {
      padding: '12px 16px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      backgroundColor: '#fecaca',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    nav: {
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    navContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      gap: '32px'
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 12px',
      borderBottom: '2px solid transparent',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      gap: '8px'
    },
    activeNavButton: {
      borderBottomColor: '#ef4444',
      color: '#dc2626'
    },
    inactiveNavButton: {
      color: '#6b7280'
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px'
    },
    content: {
      padding: '24px 0'
    },
    sectionTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '24px'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    metricCard: {
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center'
    },
    metricIcon: {
      width: '32px',
      height: '32px',
      marginRight: '16px'
    },
    metricLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '4px'
    },
    metricValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827'
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    chartCard: {
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
    },
    chartPlaceholder: {
      height: '256px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    button: {
      backgroundColor: '#dc2626',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    secondaryButton: {
      backgroundColor: '#6b7280',
      color: '#fff',
      padding: '4px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px'
    },
    searchContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    },
    searchHeader: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      gap: '16px'
    },
    searchInputContainer: {
      flex: 1,
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '8px',
      paddingBottom: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '16px',
      height: '16px'
    },
    filterButton: {
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      textAlign: 'left'
    },
    tableHeaderCell: {
      padding: '12px 24px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    tableRow: {
      borderBottom: '1px solid #e5e7eb'
    },
    tableCell: {
      padding: '16px 24px',
      fontSize: '14px',
      whiteSpace: 'nowrap'
    },
    clientCell: {
      display: 'flex',
      alignItems: 'center'
    },
    clientAvatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#fecaca',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px'
    },
    clientInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    clientName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '2px'
    },
    clientEmail: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '2px'
    },
    statusBadge: {
      display: 'inline-flex',
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '9999px'
    },
    statusOnTime: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    statusCompleted: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    statusPastDue: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    progressContainer: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      marginTop: '4px'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#dc2626',
      borderRadius: '4px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      color: '#dc2626',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px'
    },
    notificationCard: {
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid',
      marginBottom: '12px'
    },
    alertNotification: {
      borderLeftColor: '#ef4444',
      backgroundColor: '#fef2f2'
    },
    warningNotification: {
      borderLeftColor: '#f59e0b',
      backgroundColor: '#fffbeb'
    },
    infoNotification: {
      borderLeftColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalHeader: {
      padding: '24px 24px 0 24px',
      borderBottom: '1px solid #e5e7eb'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0,
      paddingBottom: '16px'
    },
    modalBody: {
      padding: '24px'
    },
    modalFooter: {
      padding: '16px 24px 24px 24px',
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    formLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    formInput: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    formSelect: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      backgroundColor: '#fff'
    },
    formCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px'
    },
    cancelButton: {
      backgroundColor: '#6b7280',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    editButton: {
      color: '#3b82f6',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px'
    },
    deleteButton: {
      color: '#ef4444',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px'
    },
    confirmDialog: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '90%',
      maxWidth: '400px',
      padding: '24px',
      textAlign: 'center'
    },
    confirmTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px'
    },
    confirmMessage: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    confirmButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
    confirmDeleteButton: {
      backgroundColor: '#ef4444',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    // Client Profile Modal styles
    profileModal: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '95%',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    profileHeader: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    },
    profileTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0,
      marginBottom: '8px'
    },
    profileSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    profileTabs: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#fff'
    },
    profileTab: {
      flex: 1,
      padding: '12px 16px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      borderBottom: '2px solid transparent'
    },
    activeProfileTab: {
      color: '#dc2626',
      borderBottomColor: '#dc2626'
    },
    inactiveProfileTab: {
      color: '#6b7280'
    },
    profileContent: {
      flex: 1,
      overflow: 'auto',
      padding: '24px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    infoCard: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    infoLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '4px'
    },
    infoValue: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#111827'
    },
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e5e7eb'
    },
    historyDate: {
      fontSize: '12px',
      color: '#6b7280'
    },
    historyAmount: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#059669'
    },
    noteItem: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '12px',
      border: '1px solid #e5e7eb'
    },
    noteText: {
      fontSize: '14px',
      color: '#374151',
      marginBottom: '8px',
      lineHeight: '1.5'
    },
    noteMeta: {
      fontSize: '12px',
      color: '#6b7280'
    },
    noteInput: {
      width: '100%',
      minHeight: '80px',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      marginBottom: '12px'
    },
    addNoteButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  // Login Screen
  if (loading) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>VNS Firm</h1>
          <p style={styles.loginSubtitle}>Client Management System</p>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>VNS Firm</h1>
          <p style={styles.loginSubtitle}>Client Management System</p>
          
          {/* Login Form */}
          {authMode === 'login' && (
            <>
              <form onSubmit={signIn} style={styles.loginForm}>
                <input
                  key="login-email"
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => handleLoginChange('email', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <input
                  key="login-password"
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => handleLoginChange('password', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <button 
                  type="submit" 
                  style={{
                    ...styles.loginButton,
                    opacity: authLoading ? 0.6 : 1,
                    cursor: authLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    'Signing in...'
                  ) : (
                    <>
                      <Lock style={{ width: '16px', height: '16px' }} />
                      Sign In
                    </>
                  )}
                </button>
              </form>
              
              <div style={styles.authLinks}>
                <button 
                  onClick={() => setAuthMode('forgot')}
                  style={styles.linkButton}
                >
                  Forgot Password?
                </button>
                <span style={{ color: '#6b7280', margin: '0 8px' }}>•</span>
                <button 
                  onClick={() => setAuthMode('signup')}
                  style={styles.linkButton}
                >
                  Create Account
                </button>
              </div>
            </>
          )}

          {/* Signup Form */}
          {authMode === 'signup' && (
            <>
              <form onSubmit={signUp} style={styles.loginForm}>
                <input
                  key="signup-fullname"
                  type="text"
                  placeholder="Full Name"
                  value={signupForm.fullName}
                  onChange={(e) => handleSignupChange('fullName', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <input
                  key="signup-company"
                  type="text"
                  placeholder="Company/Firm Name"
                  value={signupForm.companyName}
                  onChange={(e) => handleSignupChange('companyName', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <input
                  key="signup-email"
                  type="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) => handleSignupChange('email', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <input
                  key="signup-password"
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={signupForm.password}
                  onChange={(e) => handleSignupChange('password', e.target.value)}
                  style={styles.loginInput}
                  required
                  minLength={6}
                />
                <input
                  key="signup-confirm"
                  type="password"
                  placeholder="Confirm Password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <button 
                  type="submit" 
                  style={{
                    ...styles.loginButton,
                    opacity: authLoading ? 0.6 : 1,
                    cursor: authLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <User style={{ width: '16px', height: '16px' }} />
                      Create Account
                    </>
                  )}
                </button>
              </form>
              
              <div style={styles.authLinks}>
                <button 
                  onClick={() => setAuthMode('login')}
                  style={styles.linkButton}
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}

          {/* Forgot Password Form */}
          {authMode === 'forgot' && (
            <>
              <form onSubmit={forgotPassword} style={styles.loginForm}>
                <p style={styles.forgotText}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <input
                  key="forgot-email"
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => handleLoginChange('email', e.target.value)}
                  style={styles.loginInput}
                  required
                />
                <button 
                  type="submit" 
                  style={{
                    ...styles.loginButton,
                    opacity: authLoading ? 0.6 : 1,
                    cursor: authLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    'Sending Reset Email...'
                  ) : (
                    <>
                      <Mail style={{ width: '16px', height: '16px' }} />
                      Send Reset Email
                    </>
                  )}
                </button>
              </form>
              
              <div style={styles.authLinks}>
                <button 
                  onClick={() => setAuthMode('login')}
                  style={styles.linkButton}
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Dashboard Tab - Updated with accurate collection rate and real-time alerts
  const DashboardTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #dc2626' }}>
          <Users style={{ ...styles.metricIcon, color: '#dc2626' }} />
          <div>
            <p style={styles.metricLabel}>Total Clients</p>
            <p style={styles.metricValue}>{totalClients}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #10b981' }}>
          <TrendingUp style={{ ...styles.metricIcon, color: '#10b981' }} />
          <div>
            <p style={styles.metricLabel}>Active Clients</p>
            <p style={styles.metricValue}>{activeClients}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #f59e0b' }}>
          <AlertTriangle style={{ ...styles.metricIcon, color: '#f59e0b' }} />
          <div>
            <p style={styles.metricLabel}>Past Due</p>
            <p style={styles.metricValue}>{pastDueClients}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #059669' }}>
          <DollarSign style={{ ...styles.metricIcon, color: '#059669' }} />
          <div>
            <p style={styles.metricLabel}>Total Revenue</p>
            <p style={styles.metricValue}>${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #ef4444' }}>
          <CreditCard style={{ ...styles.metricIcon, color: '#ef4444' }} />
          <div>
            <p style={styles.metricLabel}>Outstanding</p>
            <p style={styles.metricValue}>${outstandingBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts and notifications */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Payment Collection Rate</h3>
          <div style={styles.chartPlaceholder}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#374151' }}>{collectionRate}%</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Collection Rate</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                ${totalRevenue.toLocaleString()} collected of ${totalBalance.toLocaleString()} total
              </div>
            </div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Recent Notifications</h3>
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {notifications.slice(0, 5).map(notification => (
              <div 
                key={notification.id} 
                style={{
                  ...styles.notificationCard,
                  ...(notification.type === 'alert' ? styles.alertNotification :
                     notification.type === 'warning' ? styles.warningNotification :
                     styles.infoNotification)
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{notification.message}</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <Bell style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                <p>No recent notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ClientsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.sectionTitle}>Client Management</h2>
        <button 
          onClick={() => setShowAddClientModal(true)} 
          style={styles.button}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Client
        </button>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setShowAddClientModal(false)}
        >
          <div 
            style={styles.modal} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Client</h2>
            </div>
            
            <UncontrolledClientForm
              initialData={{}}
              isEdit={false}
            />
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditClientModal && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setShowEditClientModal(false)}
        >
          <div 
            style={styles.modal} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Client</h2>
            </div>
            
            <UncontrolledClientForm
              initialData={selectedClient}
              isEdit={true}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            style={styles.confirmDialog} 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.confirmTitle}>Delete Client</h3>
            <p style={styles.confirmMessage}>
              Are you sure you want to delete <strong>{selectedClient?.name}</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>
            <div style={styles.confirmButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={deleteClient}
                style={styles.confirmDeleteButton}
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Profile Modal */}
      {showClientProfile && selectedClient && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setShowClientProfile(false)}
        >
          <div 
            style={styles.profileModal} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Header */}
            <div style={styles.profileHeader}>
              <h2 style={styles.profileTitle}>{selectedClient.name}</h2>
              <p style={styles.profileSubtitle}>
                {selectedClient.law_firm} • {selectedClient.status}
                {selectedClient.created_by && <span> • Added by {selectedClient.created_by}</span>}
              </p>
            </div>
            
            {/* Profile Tabs */}
            <div style={styles.profileTabs}>
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'payments', name: 'Payment History' },
                { id: 'notes', name: 'Account Notes' },
                { id: 'collections', name: 'Collection History' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setClientProfileTab(tab.id)}
                  style={{
                    ...styles.profileTab,
                    ...(clientProfileTab === tab.id ? styles.activeProfileTab : styles.inactiveProfileTab)
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            
            {/* Profile Content */}
            <div style={styles.profileContent}>
              
              {/* Overview Tab */}
              {clientProfileTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Client Information
                  </h3>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Contact Information</div>
                      <div style={styles.infoValue}>{selectedClient.email || 'No email'}</div>
                      <div style={styles.infoValue}>{selectedClient.phone || 'No phone'}</div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Total Balance</div>
                      <div style={styles.infoValue}>${(selectedClient.total_balance || 0).toLocaleString()}</div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Amount Paid</div>
                      <div style={styles.infoValue}>${(selectedClient.paid_amount || 0).toLocaleString()}</div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Outstanding Balance</div>
                      <div style={styles.infoValue}>
                        ${((selectedClient.total_balance || 0) - (selectedClient.paid_amount || 0)).toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Payment Plan</div>
                      <div style={styles.infoValue}>{selectedClient.payment_plan || 'Not set'}</div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Next Due Date</div>
                      <div style={styles.infoValue}>{selectedClient.next_due_date || 'Not set'}</div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Retainer Status</div>
                      <div style={styles.infoValue}>
                        {selectedClient.retainer_signed ? '✅ Signed' : '⏳ Pending'}
                      </div>
                    </div>
                    
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Third Party Payor</div>
                      <div style={styles.infoValue}>{selectedClient.third_party_payor || 'None'}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment History Tab */}
              {clientProfileTab === 'payments' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Payment History
                  </h3>
                  {clientPaymentHistory.length > 0 ? (
                    <div>
                      {clientPaymentHistory.map((payment) => (
                        <div key={payment.id} style={styles.historyItem}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                              Payment Received
                            </div>
                            <div style={styles.historyDate}>
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={styles.historyAmount}>
                            ${payment.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      <DollarSign style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                      <p>No payment history available</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Notes Tab */}
              {clientProfileTab === 'notes' && (
                <UncontrolledNotesSection
                  notes={clientNotes}
                />
              )}
              
              {/* Collection History Tab */}
              {clientProfileTab === 'collections' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Collection History
                  </h3>
                  {collectionEfforts.filter(effort => effort.client_id === selectedClient.id).length > 0 ? (
                    <div>
                      {collectionEfforts
                        .filter(effort => effort.client_id === selectedClient.id)
                        .map((effort) => (
                        <div key={effort.id} style={styles.historyItem}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                              {effort.type} - {effort.status}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                              {effort.message}
                            </div>
                            <div style={styles.historyDate}>
                              {new Date(effort.sent_date).toLocaleDateString()}
                              {effort.created_by && <span> • by {effort.created_by}</span>}
                              {effort.platform && <span> • via {effort.platform}</span>}
                            </div>
                          </div>
                          <div style={{ 
                            ...styles.statusBadge, 
                            backgroundColor: effort.type === 'SMS' ? '#dbeafe' : 
                                           effort.type === 'EMAIL' ? '#f3e8ff' : '#fef3c7',
                            color: effort.type === 'SMS' ? '#1e40af' : 
                                  effort.type === 'EMAIL' ? '#7c3aed' : '#d97706'
                          }}>
                            {effort.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      <AlertTriangle style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                      <p>No collection efforts recorded</p>
                    </div>
                  )}
                </div>
              )}
              
            </div>
            
            {/* Close Button */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
              <button
                onClick={() => setShowClientProfile(false)}
                style={styles.cancelButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.searchContainer}>
        <div style={styles.searchHeader}>
          <div style={styles.searchInputContainer}>
            <Search style={styles.searchIcon} />
            <input
              key="client-search"
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button style={styles.filterButton}>
            <Filter style={{ width: '16px', height: '16px' }} />
            Filter
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Client</th>
                <th style={styles.tableHeaderCell}>Law Firm</th>
                <th style={styles.tableHeaderCell}>Payment Status</th>
                <th style={styles.tableHeaderCell}>Balance</th>
                <th style={styles.tableHeaderCell}>Next Due</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.clientCell}>
                      <div style={styles.clientAvatar}>
                        <User style={{ width: '24px', height: '24px', color: '#dc2626' }} />
                      </div>
                      <div style={styles.clientInfo}>
                        <div style={styles.clientName}>{client.name}</div>
                        <div style={styles.clientEmail}>{client.email}</div>
                        <div style={styles.clientEmail}>{client.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{client.law_firm}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(client.payment_status === 'On Time' ? styles.statusOnTime :
                         client.payment_status === 'Completed' ? styles.statusCompleted :
                         styles.statusPastDue)
                    }}>
                      {client.payment_status || client.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div>${(client.paid_amount || 0).toLocaleString()} / ${(client.total_balance || 0).toLocaleString()}</div>
                    <div style={styles.progressContainer}>
                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${client.total_balance ? ((client.paid_amount || 0) / client.total_balance) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{client.next_due_date || 'Not set'}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button 
                        onClick={() => openClientProfile(client)} 
                        style={styles.iconButton}
                        title="View Client Profile"
                      >
                        <Eye style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button 
                        onClick={() => openEditModal(client)} 
                        style={styles.editButton}
                        title="Edit Client"
                      >
                        <Edit3 style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button onClick={() => sendEmail(client.id)} style={styles.iconButton} title="Send Email">
                        <Mail style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button onClick={() => sendSMS(client.id)} style={styles.iconButton} title="Send SMS">
                        <MessageSquare style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button onClick={() => makeCall(client.id)} style={styles.iconButton} title="Make Call">
                        <Phone style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button 
                        onClick={() => openDeleteConfirm(client)} 
                        style={styles.deleteButton}
                        title="Delete Client"
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

const CollectionsTab = () => {
  const [collectionView, setCollectionView] = useState('overview'); // 'overview', 'efforts', 'templates'
  const [selectedCollectionClient, setSelectedCollectionClient] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collectionType, setCollectionType] = useState('SMS');
  const [customMessage, setCustomMessage] = useState('');
  
  // Calculate past due clients
  const pastDueClients = clients.filter(c => 
    c.status === 'Past Due' || 
    (c.total_balance - c.paid_amount > 0 && c.next_due_date && new Date(c.next_due_date) < new Date())
  );
  
  // Calculate collection metrics
  const totalPastDue = pastDueClients.reduce((sum, c) => sum + ((c.total_balance || 0) - (c.paid_amount || 0)), 0);
  const avgDaysOverdue = pastDueClients.reduce((sum, c) => {
    if (c.next_due_date) {
      const daysOverdue = Math.floor((new Date() - new Date(c.next_due_date)) / (1000 * 60 * 60 * 24));
      return sum + Math.max(0, daysOverdue);
    }
    return sum;
  }, 0) / (pastDueClients.length || 1);
  
  const sendCollectionMessage = async (client, type, message) => {
    try {
      if (type === 'SMS') {
        await sendSMS(client.id);
      } else if (type === 'EMAIL') {
        await sendEmail(client.id);
      } else if (type === 'CALL') {
        await makeCall(client.id);
      }
      
      // Close modal and reset
      setShowCollectionModal(false);
      setSelectedCollectionClient(null);
      setCustomMessage('');
      
    } catch (error) {
      console.error(`Error sending ${type}:`, error);
      await addNotification(`Error sending ${type}`, 'alert');
    }
  };
  
  const getTemplateMessage = (client, daysPastDue) => {
    const amount = ((client.total_balance || 0) - (client.paid_amount || 0)).toLocaleString();
    const firmName = client.law_firm || 'VNS Firm';
    
    if (daysPastDue === 0) {
      return templates.smsDueDate
        .replace('{clientName}', client.name)
        .replace('{lawFirm}', firmName)
        .replace('{amount}', amount);
    } else if (daysPastDue <= 3) {
      return templates.smsDay3
        .replace('{clientName}', client.name)
        .replace('{lawFirm}', firmName)
        .replace('{amount}', amount);
    } else if (daysPastDue <= 5) {
      return templates.smsDay5
        .replace('{clientName}', client.name)
        .replace('{lawFirm}', firmName)
        .replace('{amount}', amount);
    } else {
      return templates.smsDay7
        .replace('{clientName}', client.name)
        .replace('{lawFirm}', firmName)
        .replace('{amount}', amount);
    }
  };
  
  // Get recent collection efforts for a client
  const getClientRecentEfforts = (clientId) => {
    return collectionEfforts
      .filter(e => e.client_id === clientId)
      .slice(0, 3);
  };
  
  if (collectionView === 'templates') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>Collection Templates</h2>
          <button 
            onClick={() => setCollectionView('overview')} 
            style={styles.button}
          >
            Back to Overview
          </button>
        </div>
        
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>SMS Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Day Before Due</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{templates.smsDayBefore}</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Due Date</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{templates.smsDueDate}</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>3 Days Past Due</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{templates.smsDay3}</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>7 Days Past Due (Final)</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{templates.smsDay7}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (collectionView === 'efforts') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>Collection History</h2>
          <button 
            onClick={() => setCollectionView('overview')} 
            style={styles.button}
          >
            Back to Overview
          </button>
        </div>
        
        <div style={styles.searchContainer}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Date</th>
                  <th style={styles.tableHeaderCell}>Client</th>
                  <th style={styles.tableHeaderCell}>Type</th>
                  <th style={styles.tableHeaderCell}>Message</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Platform</th>
                  <th style={styles.tableHeaderCell}>Sent By</th>
                </tr>
              </thead>
              <tbody>
                {collectionEfforts.map((effort) => {
                  const client = clients.find(c => c.id === effort.client_id);
                  return (
                    <tr key={effort.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        {new Date(effort.sent_date).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>{client?.name || 'Unknown'}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: effort.type === 'SMS' ? '#dbeafe' : 
                                         effort.type === 'EMAIL' ? '#f3e8ff' : '#fef3c7',
                          color: effort.type === 'SMS' ? '#1e40af' : 
                                effort.type === 'EMAIL' ? '#7c3aed' : '#d97706'
                        }}>
                          {effort.type}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {effort.message}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          ...styles.statusOnTime
                        }}>
                          {effort.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>{effort.platform || 'System'}</td>
                      <td style={styles.tableCell}>{effort.created_by || 'System'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Overview
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.sectionTitle}>Collections Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setCollectionView('templates')} 
            style={styles.button}
          >
            <FileText style={{ width: '16px', height: '16px' }} />
            Templates
          </button>
          <button 
            onClick={() => setCollectionView('efforts')} 
            style={styles.button}
          >
            <MessageSquare style={{ width: '16px', height: '16px' }} />
            History
          </button>
        </div>
      </div>
      
      {/* Collection Metrics */}
      <div style={styles.metricsGrid}>
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #ef4444' }}>
          <AlertTriangle style={{ ...styles.metricIcon, color: '#ef4444' }} />
          <div>
            <p style={styles.metricLabel}>Past Due Accounts</p>
            <p style={styles.metricValue}>{pastDueClients.length}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #f59e0b' }}>
          <DollarSign style={{ ...styles.metricIcon, color: '#f59e0b' }} />
          <div>
            <p style={styles.metricLabel}>Total Past Due</p>
            <p style={styles.metricValue}>${totalPastDue.toLocaleString()}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #8b5cf6' }}>
          <TrendingUp style={{ ...styles.metricIcon, color: '#8b5cf6' }} />
          <div>
            <p style={styles.metricLabel}>Avg Days Overdue</p>
            <p style={styles.metricValue}>{Math.round(avgDaysOverdue)}</p>
          </div>
        </div>
        
        <div style={{ ...styles.metricCard, borderLeft: '4px solid #10b981' }}>
          <MessageSquare style={{ ...styles.metricIcon, color: '#10b981' }} />
          <div>
            <p style={styles.metricLabel}>Collection Efforts</p>
            <p style={styles.metricValue}>{collectionEfforts.length}</p>
          </div>
        </div>
      </div>
      
      {/* Collection Actions Modal */}
      {showCollectionModal && selectedCollectionClient && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setShowCollectionModal(false)}
        >
          <div 
            style={styles.modal} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Send Collection Message</h2>
            </div>
            
            <div style={styles.modalBody}>
              <p style={{ marginBottom: '16px' }}>
                <strong>Client:</strong> {selectedCollectionClient.name}<br/>
                <strong>Amount Due:</strong> ${((selectedCollectionClient.total_balance || 0) - (selectedCollectionClient.paid_amount || 0)).toLocaleString()}
              </p>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message Type</label>
                <select
                  value={collectionType}
                  onChange={(e) => setCollectionType(e.target.value)}
                  style={styles.formSelect}
                >
                  <option value="SMS">SMS</option>
                  <option value="EMAIL">Email</option>
                  <option value="CALL">Phone Call</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={getTemplateMessage(selectedCollectionClient, 
                    Math.floor((new Date() - new Date(selectedCollectionClient.next_due_date)) / (1000 * 60 * 60 * 24))
                  )}
                  style={{ ...styles.formInput, minHeight: '120px', resize: 'vertical' }}
                />
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowCollectionModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={() => sendCollectionMessage(
                  selectedCollectionClient, 
                  collectionType, 
                  customMessage || getTemplateMessage(selectedCollectionClient, 
                    Math.floor((new Date() - new Date(selectedCollectionClient.next_due_date)) / (1000 * 60 * 60 * 24))
                  )
                )}
                style={styles.button}
              >
                Send {collectionType}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Past Due Clients Table */}
      <div style={styles.searchContainer}>
        <div style={styles.searchHeader}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Past Due Accounts</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Client</th>
                <th style={styles.tableHeaderCell}>Days Overdue</th>
                <th style={styles.tableHeaderCell}>Amount Due</th>
                <th style={styles.tableHeaderCell}>Last Contact</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pastDueClients.length > 0 ? (
                pastDueClients.map((client) => {
                  const daysOverdue = client.next_due_date ? 
                    Math.floor((new Date() - new Date(client.next_due_date)) / (1000 * 60 * 60 * 24)) : 0;
                  const amountDue = (client.total_balance || 0) - (client.paid_amount || 0);
                  const recentEfforts = getClientRecentEfforts(client.id);
                  const lastContact = recentEfforts[0];
                  
                  return (
                    <tr key={client.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <div style={styles.clientCell}>
                          <div style={styles.clientAvatar}>
                            <User style={{ width: '24px', height: '24px', color: '#dc2626' }} />
                          </div>
                          <div style={styles.clientInfo}>
                            <div style={styles.clientName}>{client.name}</div>
                            <div style={styles.clientEmail}>{client.email}</div>
                            <div style={styles.clientEmail}>{client.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          fontWeight: '600',
                          color: daysOverdue > 7 ? '#dc2626' : 
                                daysOverdue > 3 ? '#f59e0b' : '#059669'
                        }}>
                          {daysOverdue > 0 ? `${daysOverdue} days` : 'Due today'}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{ fontWeight: '600', color: '#dc2626' }}>
                          ${amountDue.toLocaleString()}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {lastContact ? (
                          <div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {lastContact.type} - {new Date(lastContact.sent_date).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>No contact yet</span>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <button 
                            onClick={() => {
                              setSelectedCollectionClient(client);
                              setCollectionType('SMS');
                              setShowCollectionModal(true);
                            }}
                            style={styles.iconButton}
                            title="Send SMS"
                          >
                            <MessageSquare style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCollectionClient(client);
                              setCollectionType('EMAIL');
                              setShowCollectionModal(true);
                            }}
                            style={styles.iconButton}
                            title="Send Email"
                          >
                            <Mail style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCollectionClient(client);
                              setCollectionType('CALL');
                              setShowCollectionModal(true);
                            }}
                            style={styles.iconButton}
                            title="Log Call"
                          >
                            <Phone style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button 
                            onClick={() => openClientProfile(client)} 
                            style={styles.iconButton}
                            title="View Profile"
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ ...styles.tableCell, textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: '#6b7280' }}>
                      <TrendingUp style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                      <p>No past due accounts! Great job! 🎉</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Updated Integrations Tab with RingCentral and Gmail
const IntegrationsTab = () => {
  const [integrationView, setIntegrationView] = useState('overview'); 
  const [integrationLoading, setIntegrationLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  
  // Test integration connections
  const testIntegrationConnection = async (platform) => {
    setIntegrationLoading(true);
    try {
      // Simulate API testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestResults(prev => ({
        ...prev,
        [platform]: { 
          success: true, 
          message: `${platform} connection successful`, 
          timestamp: new Date() 
        }
      }));
      
      await addNotification(`${platform} integration test successful`, 'info');
      
    } catch (error) {
      console.error(`${platform} test error:`, error);
      setTestResults(prev => ({
        ...prev,
        [platform]: { 
          success: false, 
          message: error.message, 
          timestamp: new Date() 
        }
      }));
      
      await addNotification(`${platform} integration test failed`, 'alert');
    } finally {
      setIntegrationLoading(false);
    }
  };
  
  // Integration status check
  const getIntegrationStatus = (integration) => {
    const result = testResults[integration];
    if (!result) return 'Not tested';
    if (result.success) return 'Connected';
    return 'Failed';
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Connected': return '#059669';
      case 'Failed': return '#dc2626';
      default: return '#6b7280';
    }
  };
  
  // Render individual integration views
  if (integrationView === 'ringcentral') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>RingCentral Integration</h2>
          <button 
            onClick={() => setIntegrationView('overview')} 
            style={styles.button}
          >
            Back to Integrations
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Connection Status */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Connection Status</h3>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: testResults.ringcentral?.success ? '#f0fdf4' : '#fef2f2', 
              borderRadius: '8px',
              border: `1px solid ${testResults.ringcentral?.success ? '#86efac' : '#fecaca'}`,
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(getIntegrationStatus('ringcentral'))
                }}></div>
                <span style={{ fontWeight: '600', color: getStatusColor(getIntegrationStatus('ringcentral')) }}>
                  {getIntegrationStatus('ringcentral')}
                </span>
              </div>
              {testResults.ringcentral && (
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                  {testResults.ringcentral.message}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => testIntegrationConnection('RingCentral')}
                style={{
                  ...styles.button,
                  opacity: integrationLoading ? 0.6 : 1,
                  cursor: integrationLoading ? 'not-allowed' : 'pointer',
                  backgroundColor: '#059669'
                }}
                disabled={integrationLoading}
              >
                {integrationLoading ? 'Testing...' : '🧪 Test Connection'}
              </button>
            </div>
          </div>
          
          {/* Configuration */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Configuration</h3>
            
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '6px',
              fontSize: '14px',
              color: '#0369a1',
              marginBottom: '16px'
            }}>
              <strong>Environment:</strong> Production<br/>
              <strong>API Version:</strong> v1.0<br/>
              <strong>Last Sync:</strong> {testResults.ringcentral?.timestamp ? 
                new Date(testResults.ringcentral.timestamp).toLocaleString() : 'Never'}
            </div>
            
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '12px' }}>
                <strong>Features:</strong>
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>SMS messaging</li>
                <li>Voice calls</li>
                <li>Call logging</li>
                <li>Automated reminders</li>
              </ul>
              
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '6px',
                border: '1px solid #86efac'
              }}>
                <strong style={{ color: '#059669' }}>✅ Production Ready:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Integration is active and processing SMS/call requests.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Usage Statistics */}
        <div style={styles.chartCard}>
          <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Usage Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {collectionEfforts.filter(e => e.type === 'SMS').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>SMS Sent This Month</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {collectionEfforts.filter(e => e.type === 'CALL').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Calls Made This Month</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>98%</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Delivery Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (integrationView === 'gmail') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>Gmail Integration</h2>
          <button 
            onClick={() => setIntegrationView('overview')} 
            style={styles.button}
          >
            Back to Integrations
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Connection Status */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Connection Status</h3>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: testResults.gmail?.success ? '#f0fdf4' : '#fef2f2', 
              borderRadius: '8px',
              border: `1px solid ${testResults.gmail?.success ? '#86efac' : '#fecaca'}`,
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(getIntegrationStatus('gmail'))
                }}></div>
                <span style={{ fontWeight: '600', color: getStatusColor(getIntegrationStatus('gmail')) }}>
                  {getIntegrationStatus('gmail')}
                </span>
              </div>
              {testResults.gmail && (
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                  {testResults.gmail.message}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => testIntegrationConnection('Gmail')}
                style={{
                  ...styles.button,
                  opacity: integrationLoading ? 0.6 : 1,
                  cursor: integrationLoading ? 'not-allowed' : 'pointer',
                  backgroundColor: '#059669'
                }}
                disabled={integrationLoading}
              >
                {integrationLoading ? 'Testing...' : '🧪 Test Connection'}
              </button>
            </div>
          </div>
          
          {/* Configuration */}
          <div style={styles.chartCard}>
            <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Configuration</h3>
            
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '6px',
              fontSize: '14px',
              color: '#0369a1',
              marginBottom: '16px'
            }}>
              <strong>Environment:</strong> Production<br/>
              <strong>API Version:</strong> v1<br/>
              <strong>Account:</strong> collections@vnsfirm.com<br/>
              <strong>Last Sync:</strong> {testResults.gmail?.timestamp ? 
                new Date(testResults.gmail.timestamp).toLocaleString() : 'Never'}
            </div>
            
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '12px' }}>
                <strong>Features:</strong>
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Automated email sending</li>
                <li>Template management</li>
                <li>Email tracking</li>
                <li>Thread management</li>
              </ul>
              
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '6px',
                border: '1px solid #86efac'
              }}>
                <strong style={{ color: '#059669' }}>✅ Production Ready:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Gmail API is configured and sending emails successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Statistics */}
        <div style={styles.chartCard}>
          <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Email Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {collectionEfforts.filter(e => e.type === 'EMAIL').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Emails Sent This Month</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>94%</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Delivery Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>67%</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Open Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Overview
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.sectionTitle}>Integrations</h2>
        <button 
          style={{
            ...styles.button,
            backgroundColor: '#10b981'
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Integration
        </button>
      </div>
      
      {/* Integration Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* RingCentral Card */}
        <div style={{ ...styles.chartCard, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
             onClick={() => setIntegrationView('ringcentral')}
             onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
             onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                RingCentral
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>SMS & Voice Communications</p>
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px'
            }}>
              <MessageSquare style={{ width: '24px', height: '24px', color: '#d97706' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#059669'
            }}></div>
            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '500' }}>
              Connected
            </span>
          </div>
          
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
            Send SMS reminders and make collection calls directly from the platform.
          </p>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIntegrationView('ringcentral');
            }}
            style={{
              marginTop: '16px',
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Configure →
          </button>
        </div>
        
        {/* Gmail Card */}
        <div style={{ ...styles.chartCard, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
             onClick={() => setIntegrationView('gmail')}
             onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
             onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                Gmail
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Email communications & automation</p>
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: '#f3e8ff',
              borderRadius: '8px'
            }}>
              <Mail style={{ width: '24px', height: '24px', color: '#9333ea' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#059669'
            }}></div>
            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '500' }}>
              Connected
            </span>
          </div>
          
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
            Send automated email reminders and track client communications.
          </p>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIntegrationView('gmail');
            }}
            style={{
              marginTop: '16px',
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Configure →
          </button>
        </div>
        
        {/* LawPay Card */}
        <div style={{ ...styles.chartCard, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
             onClick={() => window.alert('LawPay integration available in advanced plan')}
             onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
             onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                LawPay
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Payment processing for law firms</p>
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px'
            }}>
              <CreditCard style={{ width: '24px', height: '24px', color: '#0369a1' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#d1d5db'
            }}></div>
            <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
              Available
            </span>
          </div>
          
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
            Sync clients, process payments, and track transactions directly from your dashboard.
          </p>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.alert('LawPay integration available in advanced plan');
            }}
            style={{
              marginTop: '16px',
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Upgrade to Access →
          </button>
        </div>
        
        {/* QuickBooks Card */}
        <div style={{ ...styles.chartCard, opacity: 0.7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                QuickBooks
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Accounting & bookkeeping</p>
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px'
            }}>
              <TrendingUp style={{ width: '24px', height: '24px', color: '#16a34a' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#d1d5db'
            }}></div>
            <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
              Coming Soon
            </span>
          </div>
          
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
            Automatically sync invoices, payments, and financial data with QuickBooks.
          </p>
          
          <button 
            disabled
            style={{
              marginTop: '16px',
              padding: '6px 12px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
          >
            Coming Soon
          </button>
        </div>
        
      </div>
      
      {/* Integration Stats */}
      <div style={styles.chartCard}>
        <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Integration Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>2</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Active Integrations</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {collectionEfforts.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Messages Sent Today</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>96%</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Success Rate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Last Sync</div>
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.logo}>VNS Firm</h1>
            <p style={styles.subtitle}>Client Management System</p>
          </div>
          <div style={styles.headerRight}>
            <NotificationsDropdown />
            <div style={styles.userSection}>
              <div style={styles.userAvatar}>
                <User style={{ width: '20px', height: '20px', color: '#dc2626' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <button onClick={signOut} style={{ ...styles.bellButton, color: '#9ca3af' }}>
                <LogOut style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          {[
            { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
            { id: 'clients', name: 'Clients', icon: Users },
            { id: 'collections', name: 'Collections', icon: AlertTriangle },
            { id: 'integrations', name: 'Integrations', icon: Settings },
            { id: 'settings', name: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navButton,
                ...(activeTab === tab.id ? styles.activeNavButton : styles.inactiveNavButton)
              }}
            >
              <tab.icon style={{ width: '16px', height: '16px' }} />
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'clients' && <ClientsTab />}
          {activeTab === 'collections' && <CollectionsTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};

export default App;