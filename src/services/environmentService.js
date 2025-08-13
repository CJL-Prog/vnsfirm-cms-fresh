/**
 * Environment Service
 * Manages environment variables and configuration for integrations
 */

// LawPay Configuration
export const lawpayConfig = {
  apiKey: process.env.REACT_APP_LAWPAY_API_KEY || '',
  apiSecret: process.env.REACT_APP_LAWPAY_API_SECRET || '',
  environment: process.env.REACT_APP_LAWPAY_ENVIRONMENT || 'sandbox'
};

// RingCentral Configuration
export const ringCentralConfig = {
  clientId: process.env.REACT_APP_RINGCENTRAL_CLIENT_ID || '',
  clientSecret: process.env.REACT_APP_RINGCENTRAL_CLIENT_SECRET || '',
  serverUrl: process.env.REACT_APP_RINGCENTRAL_SERVER_URL || 'https://platform.ringcentral.com'
};

// Gmail Configuration
export const gmailConfig = {
  clientId: process.env.REACT_APP_GMAIL_CLIENT_ID || '',
  clientSecret: process.env.REACT_APP_GMAIL_CLIENT_SECRET || '',
  primaryEmail: process.env.REACT_APP_GMAIL_PRIMARY_EMAIL || '',
  signature: process.env.REACT_APP_GMAIL_SIGNATURE || '',
  autoTracking: process.env.REACT_APP_GMAIL_AUTO_TRACKING === 'true'
};

// DocuSign Configuration
export const docusignConfig = {
  accountId: process.env.REACT_APP_DOCUSIGN_ACCOUNT_ID || '',
  integrationKey: process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY || '',
  secretKey: process.env.REACT_APP_DOCUSIGN_SECRET_KEY || '',
  environment: process.env.REACT_APP_DOCUSIGN_ENVIRONMENT || 'demo',
  autoWorkflow: process.env.REACT_APP_DOCUSIGN_AUTO_WORKFLOW === 'true'
};

// Trello Configuration
export const trelloConfig = {
  apiKey: process.env.REACT_APP_TRELLO_API_KEY || '',
  accessToken: process.env.REACT_APP_TRELLO_ACCESS_TOKEN || '',
  newClientList: process.env.REACT_APP_TRELLO_NEW_CLIENT_LIST || 'New Leads',
  retainerSentList: process.env.REACT_APP_TRELLO_RETAINER_SENT_LIST || 'Retainer Sent',
  activeClientList: process.env.REACT_APP_TRELLO_ACTIVE_CLIENT_LIST || 'Active',
  autoCreateFromSlack: process.env.REACT_APP_TRELLO_AUTO_CREATE_FROM_SLACK === 'true',
  autoMoveOnRetainer: process.env.REACT_APP_TRELLO_AUTO_MOVE_ON_RETAINER === 'true',
  addDueDates: process.env.REACT_APP_TRELLO_ADD_DUE_DATES === 'true'
};

// Slack Configuration
export const slackConfig = {
  botToken: process.env.REACT_APP_SLACK_BOT_TOKEN || '',
  signingSecret: process.env.REACT_APP_SLACK_SIGNING_SECRET || '',
  autoCreateCards: process.env.REACT_APP_SLACK_AUTO_CREATE_CARDS === 'true'
};

// General App Configuration
export const appConfig = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  debugMode: process.env.REACT_APP_DEBUG_MODE === 'true'
};

/**
 * Check if integration is configured
 * @param {string} integration - Integration name
 * @returns {boolean} - Whether integration has required config
 */
export const isIntegrationConfigured = (integration) => {
  switch (integration.toLowerCase()) {
    case 'lawpay':
      return !!(lawpayConfig.apiKey && lawpayConfig.apiSecret);
    case 'ringcentral':
      return !!(ringCentralConfig.clientId && ringCentralConfig.clientSecret);
    case 'gmail':
      return !!(gmailConfig.clientId && gmailConfig.clientSecret);
    case 'docusign':
      return !!(docusignConfig.accountId && docusignConfig.integrationKey);
    case 'trello':
      return !!(trelloConfig.apiKey && trelloConfig.accessToken);
    case 'slack':
      return !!(slackConfig.botToken && slackConfig.signingSecret);
    default:
      return false;
  }
};

/**
 * Get integration status
 * @param {string} integration - Integration name
 * @returns {string} - Status: 'connected', 'not-connected', 'error'
 */
export const getIntegrationStatus = (integration) => {
  try {
    if (isIntegrationConfigured(integration)) {
      return 'connected';
    }
    return 'not-connected';
  } catch (error) {
    console.error(`Error checking ${integration} status:`, error);
    return 'error';
  }
};

/**
 * Validate environment configuration
 * @returns {Object} - Validation results
 */
export const validateEnvironment = () => {
  const results = {
    valid: true,
    errors: [],
    warnings: []
  };

  // Check required Supabase configuration
  if (!process.env.REACT_APP_SUPABASE_URL) {
    results.valid = false;
    results.errors.push('REACT_APP_SUPABASE_URL is required');
  }

  if (!process.env.REACT_APP_SUPABASE_ANON_KEY) {
    results.valid = false;
    results.errors.push('REACT_APP_SUPABASE_ANON_KEY is required');
  }

  // Check optional integrations
  const integrations = ['lawpay', 'ringcentral', 'gmail', 'docusign', 'trello', 'slack'];
  integrations.forEach(integration => {
    if (!isIntegrationConfigured(integration)) {
      results.warnings.push(`${integration} integration not configured`);
    }
  });

  return results;
};

// Export default configuration object
export default {
  lawpay: lawpayConfig,
  ringcentral: ringCentralConfig,
  gmail: gmailConfig,
  docusign: docusignConfig,
  trello: trelloConfig,
  slack: slackConfig,
  app: appConfig,
  isIntegrationConfigured,
  getIntegrationStatus,
  validateEnvironment
};