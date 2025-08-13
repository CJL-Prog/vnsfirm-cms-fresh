// src/components/clients/ClientsTab.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientsProvider } from '../../contexts/ClientsContext';
import { NotificationsProvider } from '../../contexts/NotificationsContext';
import ClientsTab from './ClientsTab';

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
      <NotificationsProvider>
        <ClientsProvider>
          <ClientsTab />
        </ClientsProvider>
      </NotificationsProvider>
    );
    
    expect(screen.getByText('Client Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search clients...')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });
  
  test('opens add client modal when button clicked', async () => {
    render(
      <NotificationsProvider>
        <ClientsProvider>
          <ClientsTab />
        </ClientsProvider>
      </NotificationsProvider>
    );
    
    fireEvent.click(screen.getByText('Add Client'));
    
    await waitFor(() => {
      expect(screen.getByText('Add New Client')).toBeInTheDocument();
    });
  });
});