import React, { useState } from 'react';
import { DollarSign, Users, AlertTriangle, Mail, MessageSquare, CreditCard, TrendingUp, Phone, Eye, Plus, Search, Filter, Bell, Settings, User, LogOut } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      totalBalance: 5000,
      paidAmount: 2000,
      nextDueDate: '2025-08-15',
      status: 'Active',
      paymentPlan: 'Monthly - $500',
      lastPayment: '2025-07-15',
      paymentStatus: 'On Time',
      lawFirm: 'Smith & Associates',
      retainerSigned: true,
      thirdPartyPayor: null,
      trelloCardId: 'TR001',
      myHaseId: 'MC001',
      lawPayId: 'LP001'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      totalBalance: 3000,
      paidAmount: 3000,
      nextDueDate: '2025-08-10',
      status: 'Paid in Full',
      paymentPlan: 'Paid in Full',
      lastPayment: '2025-06-01',
      paymentStatus: 'Completed',
      lawFirm: 'Johnson Law Group',
      retainerSigned: true,
      thirdPartyPayor: 'Insurance Co.',
      trelloCardId: 'TR002',
      myHaseId: 'MC002',
      lawPayId: 'LP002'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '(555) 345-6789',
      totalBalance: 4000,
      paidAmount: 1500,
      nextDueDate: '2025-08-01',
      status: 'Past Due',
      paymentPlan: 'Monthly - $750',
      lastPayment: '2025-06-01',
      paymentStatus: 'Past Due - 4 days',
      lawFirm: 'Wilson & Partners',
      retainerSigned: true,
      thirdPartyPayor: null,
      trelloCardId: 'TR003',
      myHaseId: 'MC003',
      lawPayId: 'LP003'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '(555) 456-7890',
      totalBalance: 2500,
      paidAmount: 800,
      nextDueDate: '2025-08-20',
      status: 'Active',
      paymentPlan: 'Monthly - $400',
      lastPayment: '2025-07-20',
      paymentStatus: 'On Time',
      lawFirm: 'Davis Legal Services',
      retainerSigned: false,
      thirdPartyPayor: null,
      trelloCardId: 'TR004',
      myHaseId: 'MC004',
      lawPayId: 'LP004'
    }
  ]);

  const [collectionEfforts, setCollectionEfforts] = useState([
    {
      id: 1,
      clientId: 3,
      type: 'SMS',
      message: 'Payment reminder: Your payment of $750 is past due. Please contact us.',
      sentDate: '2025-08-02',
      status: 'Sent'
    },
    {
      id: 2,
      clientId: 3,
      type: 'EMAIL',
      message: 'Past due payment notice - immediate attention required',
      sentDate: '2025-08-04',
      status: 'Sent'
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Mike Wilson payment 4 days overdue', type: 'alert', time: '2 hours ago' },
    { id: 2, message: 'Emily Davis retainer pending signature', type: 'warning', time: '1 day ago' },
    { id: 3, message: 'New client request from Slack', type: 'info', time: '2 days ago' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser] = useState({ name: 'Admin', role: 'Administrator' });
  
  // Collection Templates
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

  // Calculate metrics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pastDueClients = clients.filter(c => c.status === 'Past Due').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.paidAmount, 0);
  const outstandingBalance = clients.reduce((sum, c) => sum + (c.totalBalance - c.paidAmount), 0);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lawFirm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addClient = () => {
    const newClient = {
      id: Date.now(),
      name: 'New Client',
      email: 'new@client.com',
      phone: '(555) 000-0000',
      totalBalance: 1000,
      paidAmount: 0,
      nextDueDate: '2025-09-01',
      status: 'Active',
      paymentPlan: 'Monthly - $250',
      lastPayment: '',
      paymentStatus: 'Pending',
      lawFirm: 'Select Law Firm',
      retainerSigned: false,
      thirdPartyPayor: null,
      trelloCardId: '',
      myHaseId: '',
      lawPayId: ''
    };
    setClients([...clients, newClient]);
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      message: 'New client added successfully',
      type: 'info',
      time: 'Just now'
    };
    setNotifications([newNotification, ...notifications]);
  };

  const sendSMS = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    const newEffort = {
      id: Date.now(),
      clientId,
      type: 'SMS',
      message: `Payment reminder sent to ${client.name}`,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Sent'
    };
    setCollectionEfforts([...collectionEfforts, newEffort]);
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      message: `SMS sent to ${client.name}`,
      type: 'info',
      time: 'Just now'
    };
    setNotifications([newNotification, ...notifications]);
  };

  const sendEmail = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    const newEffort = {
      id: Date.now(),
      clientId,
      type: 'EMAIL',
      message: `Email reminder sent to ${client.name}`,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Sent'
    };
    setCollectionEfforts([...collectionEfforts, newEffort]);
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      message: `Email sent to ${client.name}`,
      type: 'info',
      time: 'Just now'
    };
    setNotifications([newNotification, ...notifications]);
  };

  const updateTemplate = (templateKey, value) => {
    setTemplates(prev => ({
      ...prev,
      [templateKey]: value
    }));
  };

  const saveTemplates = () => {
    // In a real app, this would save to backend
    const newNotification = {
      id: Date.now(),
      message: 'Collection templates updated successfully',
      type: 'info',
      time: 'Just now'
    };
    setNotifications([newNotification, ...notifications]);
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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

      {/* Charts */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Payment Collection Rate</h3>
          <div style={styles.chartPlaceholder}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#374151' }}>90%</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Collection Rate</div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#22c55e', borderRadius: '4px', marginRight: '8px' }}></div>
                  <span style={{ fontSize: '14px' }}>On Time: 65%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#eab308', borderRadius: '4px', marginRight: '8px' }}></div>
                  <span style={{ fontSize: '14px' }}>Late but Collected: 25%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '4px', marginRight: '8px' }}></div>
                  <span style={{ fontSize: '14px' }}>Past Due: 10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Revenue Trend</h3>
          <div style={styles.chartPlaceholder}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#374151' }}>$71,000</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>July Revenue</div>
              <div style={{ fontSize: '14px', color: '#059669', marginTop: '8px' }}>↗ +8.2% from last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div style={styles.chartsGrid}>
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
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{notification.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Upcoming Due Dates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {clients.filter(c => c.status === 'Active').slice(0, 4).map(client => (
              <div key={client.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{client.name}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>{client.paymentPlan}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{client.nextDueDate}</p>
                  <p style={{ fontSize: '14px', color: '#059669', margin: '4px 0 0 0' }}>${(client.totalBalance - client.paidAmount) >= 500 ? 500 : (client.totalBalance - client.paidAmount)}</p>
                </div>
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
                  <td style={styles.tableCell}>{client.lawFirm}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(client.paymentStatus === 'On Time' ? styles.statusOnTime :
                         client.paymentStatus === 'Completed' ? styles.statusCompleted :
                         styles.statusPastDue)
                    }}>
                      {client.paymentStatus}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div>${client.paidAmount.toLocaleString()} / ${client.totalBalance.toLocaleString()}</div>
                    <div style={styles.progressContainer}>
                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${(client.paidAmount / client.totalBalance) * 100}%`
                        }}
                      ></div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{client.nextDueDate}</td>
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

  const CollectionsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.sectionTitle}>Collection Management</h2>
        <button style={styles.button}>
          Run Collection Cycle
        </button>
      </div>

      {/* Collection Rules */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Automated Collection Rules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MessageSquare style={{ width: '20px', height: '20px', color: '#f59e0b', marginRight: '8px' }} />
              <span style={{ fontWeight: '500' }}>Day Before Due</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>SMS Reminder sent automatically</p>
            <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
          </div>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MessageSquare style={{ width: '20px', height: '20px', color: '#ea580c', marginRight: '8px' }} />
              <span style={{ fontWeight: '500' }}>Due Date</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>SMS on missed payment</p>
            <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
          </div>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Mail style={{ width: '20px', height: '20px', color: '#ef4444', marginRight: '8px' }} />
              <span style={{ fontWeight: '500' }}>Days 3, 5, 7</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>SMS + Email escalation</p>
            <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
          </div>
        </div>
      </div>

      {/* Collection Templates Editor */}
      <div style={styles.chartCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={styles.chartTitle}>Collection Message Templates</h3>
          <button onClick={saveTemplates} style={styles.button}>
            Save Templates
          </button>
        </div>
        
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
          <strong>Available Variables:</strong> {'{clientName}'}, {'{amount}'}, {'{dueDate}'}, {'{lawFirm}'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* SMS Templates */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', borderBottom: '2px solid #dc2626', paddingBottom: '8px' }}>
              <MessageSquare style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
              SMS Templates
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day Before Due SMS
                </label>
                <textarea
                  value={templates.smsDayBefore}
                  onChange={(e) => updateTemplate('smsDayBefore', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Due Date SMS
                </label>
                <textarea
                  value={templates.smsDueDate}
                  onChange={(e) => updateTemplate('smsDueDate', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day 3 Past Due SMS
                </label>
                <textarea
                  value={templates.smsDay3}
                  onChange={(e) => updateTemplate('smsDay3', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day 5 Past Due SMS
                </label>
                <textarea
                  value={templates.smsDay5}
                  onChange={(e) => updateTemplate('smsDay5', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day 7 Final Notice SMS
                </label>
                <textarea
                  value={templates.smsDay7}
                  onChange={(e) => updateTemplate('smsDay7', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Email Templates */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', borderBottom: '2px solid #dc2626', paddingBottom: '8px' }}>
              <Mail style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
              Email Templates
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day 3 Past Due Email
                </label>
                <input
                  type="text"
                  placeholder="Email Subject"
                  value={templates.emailDay3.subject}
                  onChange={(e) => updateTemplate('emailDay3', { ...templates.emailDay3, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
                <textarea
                  value={templates.emailDay3.body}
                  onChange={(e) => updateTemplate('emailDay3', { ...templates.emailDay3, body: e.target.value })}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day 5 Urgent Email
                </label>
                <input
                  type="text"
                  placeholder="Email Subject"
                  value={templates.emailDay5.subject}
                  onChange={(e) => updateTemplate('emailDay5', { ...templates.emailDay5, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
                <textarea
                  value={templates.emailDay5.body}
                  onChange={(e) => updateTemplate('emailDay5', { ...templates.emailDay5, body: e.target.value })}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Day 7 Final Notice Email
                </label>
                <input
                  type="text"
                  placeholder="Email Subject"
                  value={templates.emailDay7.subject}
                  onChange={(e) => updateTemplate('emailDay7', { ...templates.emailDay7, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
                <textarea
                  value={templates.emailDay7.body}
                  onChange={(e) => updateTemplate('emailDay7', { ...templates.emailDay7, body: e.target.value })}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Past Due Clients */}
      <div style={styles.searchContainer}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={styles.chartTitle}>Past Due Accounts</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Client</th>
                <th style={styles.tableHeaderCell}>Days Past Due</th>
                <th style={styles.tableHeaderCell}>Amount Due</th>
                <th style={styles.tableHeaderCell}>Last Contact</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.filter(c => c.status === 'Past Due').map((client) => (
                <tr key={client.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.clientCell}>
                      <div style={styles.clientAvatar}>
                        <User style={{ width: '24px', height: '24px', color: '#dc2626' }} />
                      </div>
                      <div style={styles.clientInfo}>
                        <div style={styles.clientName}>{client.name}</div>
                        <div style={styles.clientEmail}>{client.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{ ...styles.statusBadge, ...styles.statusPastDue }}>
                      4 Days
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{ fontWeight: '500' }}>$750</span>
                  </td>
                  <td style={styles.tableCell}>
                    {collectionEfforts.filter(e => e.clientId === client.id).length > 0 ? 
                      `${collectionEfforts.filter(e => e.clientId === client.id).slice(-1)[0].type} - ${collectionEfforts.filter(e => e.clientId === client.id).slice(-1)[0].sentDate}` : 
                      'No contact'
                    }
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => sendSMS(client.id)} style={styles.button}>
                        Send SMS
                      </button>
                      <button onClick={() => sendEmail(client.id)} style={styles.secondaryButton}>
                        Send Email
                      </button>
                      <button style={{ ...styles.secondaryButton, backgroundColor: '#3b82f6' }}>
                        Call
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

  const IntegrationsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={styles.sectionTitle}>System Integrations</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {[
          { name: 'Slack', description: 'Retainer requests automatically sync from #retainer-requests channel' },
          { name: 'Trello', description: 'Client cards automatically created and updated with payment status' },
          { name: 'DocuSign', description: 'Retainer status and signatures automatically tracked' },
          { name: 'LawPay', description: 'Payment processing and failed payment notifications' },
          { name: 'MyCase', description: 'Client information automatically synced for lawyer access' },
          { name: 'RingCentral SMS', description: 'Automated SMS collection messages and reminders' },
          { name: 'Gmail', description: 'Automated email collection and client communication' }
        ].map((integration) => (
          <div key={integration.name} style={{ ...styles.chartCard, borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>{integration.name}</h3>
              <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>Connected</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{integration.description}</p>
            <button style={{ ...styles.secondaryButton, width: '100%', padding: '8px' }}>
              {integration.name === 'Slack' ? 'Configure Webhooks' :
               integration.name === 'Trello' ? 'Sync Now' :
               integration.name === 'LawPay' ? 'Sync Payments' : 'Test Connection'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={styles.sectionTitle}>System Settings</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Collection Settings */}
        <div style={styles.chartCard}>
          <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>Collection Automation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'SMS Day Before Due',
              'SMS on Due Date', 
              'Email + SMS on Day 3',
              'Email + SMS on Day 5',
              'Email + SMS on Day 7'
            ].map((setting) => (
              <div key={setting} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{setting}</label>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div style={styles.chartCard}>
          <h3 style={{ ...styles.chartTitle, marginBottom: '16px' }}>User Management</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#fecaca', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <User style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{currentUser.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>admin@vnsfirm.com</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px' }}>Admin</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>Staff User</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>staff@vnsfirm.com</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: '4px' }}>Staff</span>
            </div>
          </div>
          <button style={{ ...styles.button, width: '100%', marginTop: '16px', justifyContent: 'center' }}>
            Add User
          </button>
        </div>
      </div>
    </div>
  );

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
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{currentUser.name}</span>
              <button style={{ ...styles.bellButton, color: '#9ca3af' }}>
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