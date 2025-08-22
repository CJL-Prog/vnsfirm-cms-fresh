/**
 * Integration Service
 * Handles all third-party integrations
 */

import { supabase } from '../lib/supabase';
import { AppError, ErrorTypes, handleApiError } from '../utils/errorHandling';

/**
 * Base integration class
 */
class Integration {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.isConnected = false;
    this.lastSync = null;
  }

  async connect() {
    throw new Error('Connect method must be implemented by subclass');
  }

  async disconnect() {
    throw new Error('Disconnect method must be implemented by subclass');
  }

  async sync() {
    throw new Error('Sync method must be implemented by subclass');
  }

  async testConnection() {
    throw new Error('Test connection method must be implemented by subclass');
  }
}

/**
 * DocuSign Integration
 */
export class DocuSignIntegration extends Integration {
  constructor(config) {
    super('DocuSign', config);
    this.apiKey = config.apiKey || process.env.REACT_APP_DOCUSIGN_API_KEY;
    this.accountId = config.accountId;
  }

  async connect() {
    try {
      // Call Supabase Edge Function for DocuSign OAuth
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: { action: 'connect', apiKey: this.apiKey }
      });

      if (error) throw error;
      
      this.isConnected = true;
      this.config = { ...this.config, ...data };
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async sendDocument(documentData) {
    if (!this.isConnected) {
      throw new AppError('DocuSign is not connected', ErrorTypes.VALIDATION);
    }

    try {
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: { 
          action: 'sendDocument',
          document: documentData,
          accountId: this.accountId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getDocumentStatus(envelopeId) {
    try {
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: { 
          action: 'getStatus',
          envelopeId,
          accountId: this.accountId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async listTemplates() {
    try {
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: { 
          action: 'listTemplates',
          accountId: this.accountId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * LawPay Integration
 */
export class LawPayIntegration extends Integration {
  constructor(config) {
    super('LawPay', config);
    this.apiKey = config.apiKey || process.env.REACT_APP_LAWPAY_API_KEY;
    this.apiSecret = config.apiSecret || process.env.REACT_APP_LAWPAY_API_SECRET;
    this.environment = config.environment || process.env.REACT_APP_LAWPAY_ENVIRONMENT || 'sandbox';
  }

  async connect() {
    try {
      const { data, error } = await supabase.functions.invoke('lawpay-integration', {
        body: { 
          action: 'connect',
          apiKey: this.apiKey,
          apiSecret: this.apiSecret,
          environment: this.environment
        }
      });

      if (error) throw error;
      
      this.isConnected = true;
      this.config = { ...this.config, ...data };
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async processPayment(paymentData) {
    if (!this.isConnected) {
      throw new AppError('LawPay is not connected', ErrorTypes.VALIDATION);
    }

    try {
      const { data, error } = await supabase.functions.invoke('lawpay-integration', {
        body: { 
          action: 'processPayment',
          payment: paymentData
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createInvoice(invoiceData) {
    try {
      const { data, error } = await supabase.functions.invoke('lawpay-integration', {
        body: { 
          action: 'createInvoice',
          invoice: invoiceData
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTransactionHistory(clientId) {
    try {
      const { data, error } = await supabase.functions.invoke('lawpay-integration', {
        body: { 
          action: 'getTransactions',
          clientId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * Slack Integration
 */
export class SlackIntegration extends Integration {
  constructor(config) {
    super('Slack', config);
    this.token = config.token;
    this.channel = config.defaultChannel || '#general';
  }

  async connect() {
    try {
      const { data, error } = await supabase.functions.invoke('slack-integration', {
        body: { 
          action: 'connect',
          token: this.token
        }
      });

      if (error) throw error;
      
      this.isConnected = true;
      this.config = { ...this.config, ...data };
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async sendMessage(message, channel = null) {
    if (!this.isConnected) {
      throw new AppError('Slack is not connected', ErrorTypes.VALIDATION);
    }

    try {
      const { data, error } = await supabase.functions.invoke('slack-integration', {
        body: { 
          action: 'sendMessage',
          message,
          channel: channel || this.channel
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createReminder(reminder) {
    try {
      const { data, error } = await supabase.functions.invoke('slack-integration', {
        body: { 
          action: 'createReminder',
          reminder
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async listChannels() {
    try {
      const { data, error } = await supabase.functions.invoke('slack-integration', {
        body: { 
          action: 'listChannels'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * Trello Integration
 */
export class TrelloIntegration extends Integration {
  constructor(config) {
    super('Trello', config);
    this.apiKey = config.apiKey || process.env.REACT_APP_TRELLO_API_KEY;
    this.token = config.token || process.env.REACT_APP_TRELLO_TOKEN;
    this.boardId = config.defaultBoardId;
  }

  async connect() {
    try {
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { 
          action: 'connect',
          apiKey: this.apiKey,
          token: this.token
        }
      });

      if (error) throw error;
      
      this.isConnected = true;
      this.config = { ...this.config, ...data };
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createCard(cardData) {
    if (!this.isConnected) {
      throw new AppError('Trello is not connected', ErrorTypes.VALIDATION);
    }

    try {
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { 
          action: 'createCard',
          card: cardData,
          boardId: this.boardId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateCard(cardId, updates) {
    try {
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { 
          action: 'updateCard',
          cardId,
          updates
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async listBoards() {
    try {
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { 
          action: 'listBoards'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getBoard(boardId) {
    try {
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { 
          action: 'getBoard',
          boardId: boardId || this.boardId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * Integration Manager
 * Manages all integrations
 */
class IntegrationManager {
  constructor() {
    this.integrations = new Map();
  }

  async loadIntegrations(userId) {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Initialize integrations based on saved configurations
      if (data) {
        data.forEach(integration => {
          this.addIntegration(integration.name, integration.config);
        });
      }

      return this.integrations;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  addIntegration(name, config) {
    let integration;
    
    switch (name.toLowerCase()) {
      case 'docusign':
        integration = new DocuSignIntegration(config);
        break;
      case 'lawpay':
        integration = new LawPayIntegration(config);
        break;
      case 'slack':
        integration = new SlackIntegration(config);
        break;
      case 'trello':
        integration = new TrelloIntegration(config);
        break;
      default:
        throw new AppError(`Unknown integration: ${name}`, ErrorTypes.VALIDATION);
    }

    this.integrations.set(name.toLowerCase(), integration);
    return integration;
  }

  getIntegration(name) {
    return this.integrations.get(name.toLowerCase());
  }

  async saveIntegration(userId, name, config) {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: userId,
          name: name.toLowerCase(),
          config,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async removeIntegration(userId, name) {
    try {
      const integration = this.getIntegration(name);
      if (integration) {
        await integration.disconnect();
        this.integrations.delete(name.toLowerCase());
      }

      const { error } = await supabase
        .from('user_integrations')
        .delete()
        .eq('user_id', userId)
        .eq('name', name.toLowerCase());

      if (error) throw error;
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async testAllConnections() {
    const results = {};
    
    for (const [name, integration] of this.integrations) {
      try {
        await integration.testConnection();
        results[name] = { connected: true };
      } catch (error) {
        results[name] = { connected: false, error: error.message };
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const integrationManager = new IntegrationManager();

// Export utility function for easy access
export const getIntegration = (name) => integrationManager.getIntegration(name);