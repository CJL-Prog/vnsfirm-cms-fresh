import React, { useState } from 'react';
import { Plus, CreditCard, MessageSquare, Mail, FileSignature, Trello, Slack } from 'lucide-react';
import LawPayIntegration from './LawPayIntegration';
import RingCentralIntegration from './RingCentralIntegration';
import GmailIntegration from './GmailIntegration';
import DocusignIntegration from './DocusignIntegration';
import TrelloIntegration from './TrelloIntegration';
import SlackIntegration from './SlackIntegration';
import IntegrationCard from './IntegrationCard';

/**
 * IntegrationsTab component
 * Manages third-party integrations
 */
const IntegrationsTab = () => {
  const [activeIntegration, setActiveIntegration] = useState(null);
  
  // Get integration component based on type
  const renderIntegrationView = () => {
    switch (activeIntegration) {
      case 'lawpay':
        return <LawPayIntegration onBack={() => setActiveIntegration(null)} />;
      case 'ringcentral':
        return <RingCentralIntegration onBack={() => setActiveIntegration(null)} />;
      case 'gmail':
        return <GmailIntegration onBack={() => setActiveIntegration(null)} />;
      case 'docusign':
        return <DocusignIntegration onBack={() => setActiveIntegration(null)} />;
      case 'trello':
        return <TrelloIntegration onBack={() => setActiveIntegration(null)} />;
      case 'slack':
        return <SlackIntegration onBack={() => setActiveIntegration(null)} />;
      default:
        return null;
    }
  };
  
  // If an integration is selected, show its detail view
  if (activeIntegration) {
    return renderIntegrationView();
  }
  
  return (
    <div className="container">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="section-title">Integrations</h2>
        <button 
          className="button button-success"
        >
          <Plus size={16} />
          Add Integration
        </button>
      </div>
      
      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
        
        {/* RingCentral Card */}
        <IntegrationCard 
          title="RingCentral"
          description="SMS & Voice Communications"
          icon={<MessageSquare size={24} />}
          iconBackground="#fef3c7"
          iconColor="#d97706"
          status="connected"
          onClick={() => setActiveIntegration('ringcentral')}
        />
        
        {/* Gmail Card */}
        <IntegrationCard 
          title="Gmail"
          description="Email communications & automation"
          icon={<Mail size={24} />}
          iconBackground="#f3e8ff"
          iconColor="#9333ea"
          status="connected"
          onClick={() => setActiveIntegration('gmail')}
        />
        
        {/* LawPay Card */}
        <IntegrationCard 
          title="LawPay"
          description="Payment processing for law firms"
          icon={<CreditCard size={24} />}
          iconBackground="#f0f9ff"
          iconColor="#0369a1"
          status="connected"
          onClick={() => setActiveIntegration('lawpay')}
        />
        
        {/* DocuSign Card */}
        <IntegrationCard 
          title="DocuSign"
          description="Digital signature and document automation"
          icon={<FileSignature size={24} />}
          iconBackground="#dcfce7"
          iconColor="#16a34a"
          status="connected"
          onClick={() => setActiveIntegration('docusign')}
        />
        
        {/* Trello Card */}
        <IntegrationCard 
          title="Trello"
          description="Project management and client tracking"
          icon={<Trello size={24} />}
          iconBackground="#dbeafe"
          iconColor="#2563eb"
          status="connected"
          onClick={() => setActiveIntegration('trello')}
        />
        
        {/* Slack Card */}
        <IntegrationCard 
          title="Slack"
          description="Team communication and workflow automation"
          icon={<Slack size={24} />}
          iconBackground="#f3e8ff"
          iconColor="#7c3aed"
          status="connected"
          onClick={() => setActiveIntegration('slack')}
        />
        
      </div>
      
      {/* Integration Stats */}
      <div className="card mt-lg">
        <h3>Integration Activity</h3>
        <div className="grid grid-cols-2 grid-cols-3 grid-cols-4 gap-md">
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-xs)'
            }}>
              6
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Active Integrations
            </div>
          </div>
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-success)',
              marginBottom: 'var(--space-xs)'
            }}>
              127
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Actions Automated Today
            </div>
          </div>
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-info)',
              marginBottom: 'var(--space-xs)'
            }}>
              98%
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Success Rate
            </div>
          </div>
          <div className="text-center">
            <div style={{ 
              fontSize: 'var(--font-xl)', 
              fontWeight: '600', 
              color: 'var(--color-text)',
              marginBottom: 'var(--space-xs)'
            }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ 
              fontSize: 'var(--font-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              Last Sync
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;