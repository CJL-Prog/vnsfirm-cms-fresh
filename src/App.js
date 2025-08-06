import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DollarSign, Users, AlertTriangle, Mail, MessageSquare, CreditCard, TrendingUp, Phone, Eye, Plus, Search, Filter, Bell, Settings, User, LogOut, Lock } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
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
        .order('created_at', { ascending: false })
        .limit(10);
      
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
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => [data[0], ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const addClient = async () => {
    try {
      const newClient = {
        name: 'New Client',
        email: 'new@client.com',
        phone: '(555) 000-0000',
        total_balance: 1000,
        paid_amount: 0,
        next_due_date: '2025-09-01',
        status: 'Active',
        payment_plan: 'Monthly - $250',
        payment_status: 'Pending',
        law_firm: 'Select Law Firm',
        retainer_signed: false,
        user_id: user?.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select();

      if (error) throw error;

      setClients(prev => [data[0], ...prev]);
      await addNotification('New client added successfully', 'info');
    } catch (error) {
      console.error('Error adding client:', error);
      await addNotification('Error adding client', 'alert');
    }
  };

  const sendSMS = async (clientId) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;

      const newEffort = {
        client_id: clientId,
        type: 'SMS',
        message: `Payment reminder sent to ${client.name}`,
        sent_date: new Date().toISOString().split('T')[0],
        status: 'Sent',
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('collection_efforts')
        .insert([newEffort])
        .select();

      if (error) throw error;

      setCollectionEfforts(prev => [data[0], ...prev]);
      await addNotification(`SMS sent to ${client.name}`, 'info');
    } catch (error) {
      console.error('Error sending SMS:', error);
      await addNotification('Error sending SMS', 'alert');
    }
  };

  const sendEmail = async (clientId) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;

      const newEffort = {
        client_id: clientId,
        type: 'EMAIL',
        message: `Email reminder sent to ${client.name}`,
        sent_date: new Date().toISOString().split('T')[0],
        status: 'Sent',
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('collection_efforts')
        .insert([newEffort])
        .select();

      if (error) throw error;

      setCollectionEfforts(prev => [data[0], ...prev]);
      await addNotification(`Email sent to ${client.name}`, 'info');
    } catch (error) {
      console.error('Error sending email:', error);
      await addNotification('Error sending email', 'alert');
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
      alert('Error signing in: ' + error.message);
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
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchClients();
      fetchCollectionEfforts();
      fetchNotifications();
    }
  }, [user]);

  // Calculate metrics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pastDueClients = clients.filter(c => c.status === 'Past Due').length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.paid_amount || 0), 0);
  const outstandingBalance = clients.reduce((sum, c) => sum + ((c.total_balance || 0) - (c.paid_amount || 0)), 0);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.law_firm?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles (keeping existing styles)
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
    }
  };

  // Login Screen
  if (loading) {
    return (
      <div style={styles.loginContainer}>
        <div style={{ textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>VNS Firm</h1>
          <p style={styles.loginSubtitle}>Client Management System</p>
          
          <form onSubmit={signIn} style={styles.loginForm}>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
              style={styles.loginInput}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
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
        </div>
      </div>
    );
  }

  // Rest of your components (Dashboard, Clients, Collections, etc.) - keeping the same structure
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

      {/* Charts and notifications remain the same */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Payment Collection Rate</h3>
          <div style={styles.chartPlaceholder}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#374151' }}>90%</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Collection Rate</div>
            </div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Recent Notifications</h3>
          <div>
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
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ClientsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.sectionTitle}>Client Management</h2>
        <button onClick={addClient} style={styles.button}>
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Client
        </button>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchHeader}>
          <div style={styles.searchInputContainer}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      {client.payment_status}
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
                  <td style={styles.tableCell}>{client.next_due_date}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button style={styles.iconButton}>
                        <Eye style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button onClick={() => sendEmail(client.id)} style={styles.iconButton}>
                        <Mail style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button onClick={() => sendSMS(client.id)} style={styles.iconButton}>
                        <MessageSquare style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button style={styles.iconButton}>
                        <Phone style={{ width: '16px', height: '16px' }} />
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

  // Keeping other tabs the same for now - Collections, Integrations, Settings
  const CollectionsTab = () => <div style={styles.chartCard}><h3>Collections - Coming Soon</h3></div>;
  const IntegrationsTab = () => <div style={styles.chartCard}><h3>Integrations - Coming Soon</h3></div>;
  const SettingsTab = () => <div style={styles.chartCard}><h3>Settings - Coming Soon</h3></div>;

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
            <button style={styles.bellButton}>
              <Bell style={{ width: '24px', height: '24px' }} />
              {notifications.length > 0 && (
                <span style={styles.notificationBadge}>
                  {notifications.length}
                </span>
              )}
            </button>
            <div style={styles.userSection}>
              <div style={styles.userAvatar}>
                <User style={{ width: '20px', height: '20px', color: '#dc2626' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {user?.email?.split('@')[0] || 'User'}
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