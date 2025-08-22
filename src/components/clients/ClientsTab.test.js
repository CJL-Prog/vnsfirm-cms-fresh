// src/components/clients/ClientsTab.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { ClientsProvider } from '../../contexts/ClientsContext';
import { NotificationsProvider } from '../../contexts/NotificationsContext';
import ClientsTab from './ClientsTab';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ 
        data: { 
          session: { 
            user: { id: 'test-user-id', email: 'test@example.com' } 
          } 
        }, 
        error: null 
      })),
      onAuthStateChange: jest.fn(() => ({ 
        data: { subscription: { unsubscribe: jest.fn() } }, 
        error: null 
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

// Mock contexts
jest.mock('../../contexts/ClientsContext', () => ({
  ...jest.requireActual('../../contexts/ClientsContext'),
  useClients: () => ({
    filteredClients: [
      { id: '1', name: 'Test Client', email: 'test@example.com', status: 'Active' }
    ],
    searchTerm: '',
    setSearchTerm: jest.fn(),
    loadClientProfile: jest.fn(),
    deleteClient: jest.fn(),
    currentPage: 1,
    totalPages: 1,
    setPage: jest.fn()
  })
}));

describe('ClientsTab integration', () => {
  test('renders client list and search', () => {
    render(
      <AuthProvider>
        <NotificationsProvider>
          <ClientsProvider>
            <ClientsTab />
          </ClientsProvider>
        </NotificationsProvider>
      </AuthProvider>
    );
    
    expect(screen.getByText('Client Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search clients...')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });
  
  test('opens add client modal when button clicked', async () => {
    render(
      <AuthProvider>
        <NotificationsProvider>
          <ClientsProvider>
            <ClientsTab />
          </ClientsProvider>
        </NotificationsProvider>
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Add Client'));
    
    await waitFor(() => {
      expect(screen.getByText('Add New Client')).toBeInTheDocument();
    });
  });
});