import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { collectionsApi } from '../../services/apiService';
import Pagination from '../common/Pagination';
import { useNotifications } from '../../contexts/NotificationsContext';

/**
 * CollectionEffortsTable component
 * Displays history of collection efforts
 * 
 * @param {Function} onBack - Function to call when Back button is clicked
 */
const CollectionEffortsTable = ({ onBack }) => {
  const { addNotification, NotificationType } = useNotifications();
  const [efforts, setEfforts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Fetch collection efforts
  useEffect(() => {
    const fetchEfforts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, totalPages } = await collectionsApi.getCollectionEfforts({
          page: currentPage,
          limit: pageSize
        });
        
        setEfforts(data);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching collection efforts:', error);
        setError('Error loading collection history');
        addNotification('Error loading collection history', NotificationType.ALERT);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEfforts();
  }, [currentPage, pageSize, addNotification, NotificationType]);
  
  // Filter efforts based on search term
  const filteredEfforts = efforts.filter(effort => 
    effort.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    effort.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get badge class for effort type
  const getEffortTypeBadgeClass = (type) => {
    switch (type) {
      case 'SMS':
        return 'badge-info';
      case 'EMAIL':
        return 'badge-purple';
      case 'CALL':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="collection-efforts-container">
      <div className="back-button-container">
        <button 
          onClick={onBack}
          className="button button-outline"
        >
          <ChevronLeft size={16} />
          Back to Collections
        </button>
      </div>
      
      <h3 className="card-title mt-md">Collection History</h3>
      
      <div className="search-container card">
        <div className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search collection efforts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading collection history...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              onClick={() => setCurrentPage(1)}
              className="button"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Client</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Message</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Sent By</th>
                </tr>
              </thead>
              <tbody>
                {filteredEfforts.length > 0 ? (
                  filteredEfforts.map((effort) => (
                    <tr key={effort.id} className="table-row">
                      <td className="table-cell">
                        {formatDate(effort.sent_date)}
                      </td>
                      <td className="table-cell">
                        {effort.client_name || 'Unknown Client'}
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${getEffortTypeBadgeClass(effort.type)}`}>
                          {effort.type}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="message-cell" title={effort.message}>
                          {effort.message}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="badge badge-success">
                          {effort.status || 'Sent'}
                        </span>
                      </td>
                      <td className="table-cell">
                        {effort.created_by || 'System'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="table-cell-empty">
                      <div className="empty-state">
                        <p>No collection efforts found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionEffortsTable;