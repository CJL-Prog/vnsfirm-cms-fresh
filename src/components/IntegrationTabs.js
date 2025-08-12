import React, { useState } from 'react';
import DocuSignIntegration from './DocuSignIntegration';
import TrelloIntegration from './TrelloIntegration';
import SlackNotification from './SlackNotification';

const IntegrationTabs = ({ clientData }) => {
  const [activeTab, setActiveTab] = useState('docusign');

  const tabStyles = {
    container: {
      marginTop: '24px'
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb'
    },
    tab: {
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      borderBottom: '2px solid transparent'
    },
    activeTab: {
      borderBottomColor: '#dc2626',
      color: '#dc2626'
    },
    inactiveTab: {
      color: '#6b7280'
    },
    content: {
      padding: '24px 0'
    }
  };

  return (
    <div style={tabStyles.container}>
      <div style={tabStyles.tabs}>
        <div 
          style={{
            ...tabStyles.tab, 
            ...(activeTab === 'docusign' ? tabStyles.activeTab : tabStyles.inactiveTab)
          }}
          onClick={() => setActiveTab('docusign')}
        >
          DocuSign
        </div>
        <div 
          style={{
            ...tabStyles.tab, 
            ...(activeTab === 'trello' ? tabStyles.activeTab : tabStyles.inactiveTab)
          }}
          onClick={() => setActiveTab('trello')}
        >
          Trello
        </div>
        <div 
          style={{
            ...tabStyles.tab, 
            ...(activeTab === 'slack' ? tabStyles.activeTab : tabStyles.inactiveTab)
          }}
          onClick={() => setActiveTab('slack')}
        >
          Slack
        </div>
      </div>
      
      <div style={tabStyles.content}>
        {activeTab === 'docusign' && <DocuSignIntegration clientData={clientData} />}
        {activeTab === 'trello' && <TrelloIntegration clientData={clientData} />}
        {activeTab === 'slack' && <SlackNotification clientData={clientData} />}
      </div>
    </div>
  );
};

export default IntegrationTabs;