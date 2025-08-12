import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useClients } from '../../contexts/ClientsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import ClientTable from './ClientTable';
import ClientForm from './ClientForm';
import ClientProfile from './ClientProfile';
import Modal from '../common/Modal';
import MessageModal from '../common/MessageModal';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * ClientsTab component
 * Main clients management tab
 */
const ClientsTab = () => {
  const { 
    filteredClients, 
    searchTerm, 
    setSearchTerm,
    loadClientProfile,
    deleteClient,
    currentPage,
    totalPages,
    setPage
  } = useClients();
  
  const { addNotification, NotificationType } = useNotifications();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  // Selected client for operations
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Message modal data
  const [messageType, setMessageType] = useState('EMAIL');
  
  // Handle client actions
  const handleViewClient = async (client) => {
    try {
      await loadClientProfile(client.id);
      setShowProfileModal(true);
    } catch (error) {
      console.error('Error loading client profile:', error);
      addNotification('Error loading client profile', NotificationType.ALERT);
    }
  };
  
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };
  
  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setShowDeleteConfirm(true);
  };
  
  const confirmDeleteClient = async () => {
    try {
      await deleteClient(selectedClient.id);
      addNotification(`Client ${selectedClient.name} deleted successfully`, NotificationType.SUCCESS);
      setShowDeleteConfirm(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      addNotification('Error deleting client', NotificationType.ALERT);
    }
  };
  
  // Handle messaging
  const handleSendEmail = (client) => {
    setSelectedClient(client);
    setMessageType('EMAIL');
    setShowMessageModal(true);
  };
  
  const handleSendSMS = (client) => {
    setSelectedClient(client);
    setMessageType('SMS');
    setShowMessageModal(true);
  };
  
  const handleMakeCall = (client) => {
    setSelectedClient(client);
    setMessageType('CALL');
    setShowMessageModal(true);
  };
  
  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="clients-container">
      <div className="header-with-actions">
        <h2 className="section-title">Client Management</h2>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="button"
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>
      
      <div className="search-container card">
        <div className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <button className="button button-outline">
            <Filter size={16} />
            Filter
          </button>
        </div>
        
        <ClientTable
          clients={filteredClients}
          onView={handleViewClient}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onSendEmail={handleSendEmail}
          onSendSMS={handleSendSMS}
          onMakeCall={handleMakeCall}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setPage
          }}
        />
      </div>
      
      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
      >
        <ClientForm
          isEdit={false}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
      
      {/* Edit Client Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Client"
      >
        <ClientForm
          initialData={selectedClient}
          isEdit={true}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete ${selectedClient?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
      
      {/* Client Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Client Profile"
        size="large"
      >
        <ClientProfile
          onClose={() => setShowProfileModal(false)}
          onEdit={() => {
            setShowProfileModal(false);
            setShowEditModal(true);
          }}
        />
      </Modal>
      
      {/* Message Modal */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        client={selectedClient}
        type={messageType}
        onSend={() => {
          addNotification(`${messageType} sent to ${selectedClient?.name}`, NotificationType.SUCCESS);
          setShowMessageModal(false);
        }}
      />
    </div>
  );
};

export default ClientsTab;