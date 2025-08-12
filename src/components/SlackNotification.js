import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SlackNotification = ({ clientData, notificationType = 'custom' }) => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Initialize with client data if available
  useEffect(() => {
    if (clientData) {
      let defaultMessage = '';
      
      switch (notificationType) {
        case 'payment_reminder':
          defaultMessage = `Payment Reminder: ${clientData.name} has an outstanding balance of $${(clientData.total_balance || 0) - (clientData.paid_amount || 0)}. Next payment due: ${clientData.next_due_date || 'N/A'}.`;
          break;
        case 'new_client':
          defaultMessage = `New client added: ${clientData.name}. Law Firm: ${clientData.law_firm || 'VNS Firm'}. Status: ${clientData.status || 'Active'}.`;
          break;
        case 'document_signed':
          defaultMessage = `Document signed by ${clientData.name}. Please review and follow up as needed.`;
          break;
        case 'past_due':
          defaultMessage = `PAST DUE ALERT: ${clientData.name} has a past due balance of $${(clientData.total_balance || 0) - (clientData.paid_amount || 0)}. Please follow up immediately.`;
          break;
        default:
          defaultMessage = `Message regarding client: ${clientData.name}`;
      }
      
      setMessage(defaultMessage);
    }
  }, [clientData, notificationType]);

  // Fetch Slack channels
  useEffect(() => {
    const fetchChannels = async () => {
      setChannelsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('slack-integration', {
          body: { action: 'get_channels' }
        });
        
        if (error) throw error;
        
        if (data.success) {
          setChannels(data.channels);
          
          // Try to find a default channel like 'law-firm-notifications'
          const defaultChannel = data.channels.find(c => c.name === 'law-firm-notifications');
          if (defaultChannel) {
            setSelectedChannel(defaultChannel.id);
          } else if (data.channels.length > 0) {
            setSelectedChannel(data.channels[0].id);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch Slack channels');
        }
      } catch (err) {
        console.error('Error fetching Slack channels:', err);
        setError(`Error fetching Slack channels: ${err.message}`);
      } finally {
        setChannelsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Send notification
  const sendNotification = async () => {
    if (!selectedChannel || !message) {
      setError('Channel and message are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('slack-integration', {
        body: { 
          action: 'send_message',
          data: {
            channel: selectedChannel,
            text: message,
            clientId: clientData?.id,
            messageType: 'SLACK_NOTIFICATION'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.message || 'Failed to send Slack message');
      }
    } catch (err) {
      console.error('Error sending Slack notification:', err);
      setError(`Error sending Slack notification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
        Send Slack Notification
      </h3>
      
      {channelsLoading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
          Loading Slack channels...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Select Channel
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              style={{ 
                border: '1px solid #d1d5db', 
                padding: '8px 12px', 
                borderRadius: '6px',
                width: '100%',
                backgroundColor: '#fff'
              }}
            >
              <option value="">-- Select a channel --</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.isPrivate ? '🔒' : '#'} {channel.name} ({channel.memberCount} members)
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your notification message"
              style={{ 
                border: '1px solid #d1d5db', 
                padding: '8px 12px', 
                borderRadius: '6px',
                width: '100%',
                minHeight: '120px'
              }}
            />
          </div>
          
          {clientData && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <strong>Client:</strong> {clientData.name}<br/>
              {clientData.email && <span><strong>Email:</strong> {clientData.email}<br/></span>}
              {clientData.phone && <span><strong>Phone:</strong> {clientData.phone}<br/></span>}
              <strong>Status:</strong> {clientData.status || 'Active'}<br/>
              <strong>Amount Due:</strong> ${((clientData.total_balance || 0) - (clientData.paid_amount || 0)).toLocaleString()}
            </div>
          )}
          
          <div>
            <button
              onClick={sendNotification}
              disabled={loading || !selectedChannel || !message}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: (loading || !selectedChannel || !message) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: (loading || !selectedChannel || !message) ? 0.7 : 1
              }}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
          
          {error && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#fee2e2', 
              color: '#b91c1c',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          {result && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#d1fae5', 
              color: '#065f46',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              Notification sent successfully!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SlackNotification;