import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TrelloIntegration = ({ clientData }) => {
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [boardsLoading, setBoardsLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Initialize with client data if available
  useEffect(() => {
    if (clientData) {
      setCardName(`New Matter - ${clientData.name}`);
      setCardDescription(
        `Client: ${clientData.name}\n` +
        `Email: ${clientData.email || 'N/A'}\n` +
        `Phone: ${clientData.phone || 'N/A'}\n` +
        `Total Balance: $${clientData.total_balance || 0}\n` +
        `Amount Paid: $${clientData.paid_amount || 0}\n` +
        `Status: ${clientData.status || 'Active'}`
      );
    }
  }, [clientData]);

  // Fetch Trello boards
  useEffect(() => {
    const fetchBoards = async () => {
      setBoardsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('trello-integration', {
          body: { action: 'get_boards' }
        });
        
        if (error) throw error;
        
        if (data.success) {
          setBoards(data.boards);
        } else {
          throw new Error(data.message || 'Failed to fetch Trello boards');
        }
      } catch (err) {
        console.error('Error fetching Trello boards:', err);
        setError(`Error fetching Trello boards: ${err.message}`);
      } finally {
        setBoardsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // Fetch lists when a board is selected
  useEffect(() => {
    if (!selectedBoard) {
      setLists([]);
      return;
    }

    const fetchLists = async () => {
      setListsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('trello-integration', {
          body: { 
            action: 'get_lists',
            data: { boardId: selectedBoard }
          }
        });
        
        if (error) throw error;
        
        if (data.success) {
          setLists(data.lists.filter(list => !list.closed));
        } else {
          throw new Error(data.message || 'Failed to fetch Trello lists');
        }
      } catch (err) {
        console.error('Error fetching Trello lists:', err);
        setError(`Error fetching Trello lists: ${err.message}`);
      } finally {
        setListsLoading(false);
      }
    };

    fetchLists();
  }, [selectedBoard]);

  // Handle board selection
  const handleBoardChange = (e) => {
    setSelectedBoard(e.target.value);
    setSelectedList('');
  };

  // Create Trello card
  const createCard = async () => {
    if (!selectedList || !cardName) {
      setError('List and card name are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { 
          action: 'create_card',
          data: {
            listId: selectedList,
            name: cardName,
            description: cardDescription,
            clientId: clientData?.id
          }
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setResult(data.card);
      } else {
        throw new Error(data.message || 'Failed to create Trello card');
      }
    } catch (err) {
      console.error('Error creating Trello card:', err);
      setError(`Error creating Trello card: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
        Create Trello Card for Matter
      </h3>
      
      {boardsLoading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
          Loading Trello boards...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Select Board
            </label>
            <select
              value={selectedBoard}
              onChange={handleBoardChange}
              style={{ 
                border: '1px solid #d1d5db', 
                padding: '8px 12px', 
                borderRadius: '6px',
                width: '100%',
                backgroundColor: '#fff'
              }}
            >
              <option value="">-- Select a board --</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedBoard && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Select List
              </label>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                disabled={listsLoading}
                style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  width: '100%',
                  backgroundColor: '#fff'
                }}
              >
                <option value="">-- Select a list --</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
              {listsLoading && (
                <small style={{ color: '#6b7280' }}>Loading lists...</small>
              )}
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Card Title
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter card title"
              style={{ 
                border: '1px solid #d1d5db', 
                padding: '8px 12px', 
                borderRadius: '6px',
                width: '100%'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Card Description
            </label>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Enter card description"
              style={{ 
                border: '1px solid #d1d5db', 
                padding: '8px 12px', 
                borderRadius: '6px',
                width: '100%',
                minHeight: '120px'
              }}
            />
          </div>
          
          <div>
            <button
              onClick={createCard}
              disabled={loading || !selectedList || !cardName}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: (loading || !selectedList || !cardName) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: (loading || !selectedList || !cardName) ? 0.7 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create Card'}
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
              Card created successfully! 
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#065f46', textDecoration: 'underline', marginLeft: '5px' }}
              >
                Open in Trello
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrelloIntegration;