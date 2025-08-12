import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DocuSignIntegration = ({ clientData }) => {
  const [signers, setSigners] = useState([
    { name: '', email: '', role: 'signer' }
  ]);
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [documentContent, setDocumentContent] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  const addSigner = () => {
    setSigners([...signers, { name: '', email: '', role: 'signer' }]);
  };

  const updateSigner = (index, field, value) => {
    const updatedSigners = [...signers];
    updatedSigners[index][field] = value;
    setSigners(updatedSigners);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentName(file.name);
      
      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        // Get the base64 string (remove the data:*/*;base64, prefix)
        const base64Content = event.target.result.split(',')[1];
        setDocumentContent(base64Content);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendForSigning = async () => {
    if (!documentContent || signers.some(s => !s.name || !s.email)) {
      setError('Please upload a document and add at least one signer with name and email');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Call Supabase Edge Function for DocuSign
      const { data, error } = await supabase.functions.invoke('docusign-integration', {
        body: {
          action: 'create_envelope',
          data: {
            documentName,
            documentContent,
            signers,
            clientInfo: clientData
          }
        }
      });

      if (error) throw error;
      
      setResult(data);
      
      // Add to collection efforts if successful
      if (data.envelopeId && clientData?.id) {
        await supabase
          .from('collection_efforts')
          .insert([{
            client_id: clientData.id,
            type: 'DOCUSIGN',
            message: `DocuSign envelope sent for "${documentName}"`,
            sent_date: new Date().toISOString().split('T')[0],
            status: 'Sent',
            created_by: clientData.created_by || 'system'
          }]);
      }
    } catch (err) {
      console.error('Error sending document for signing:', err);
      setError(err.message || 'Error sending document for signing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
        Send Document for Signing
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Upload Document
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ 
            border: '1px solid #d1d5db', 
            padding: '8px', 
            borderRadius: '6px',
            width: '100%'
          }}
        />
        <small style={{ color: '#6b7280', display: 'block', marginTop: '4px' }}>
          Supported formats: PDF, Word Document
        </small>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Document Name
        </label>
        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Enter document name"
          style={{ 
            border: '1px solid #d1d5db', 
            padding: '8px 12px', 
            borderRadius: '6px',
            width: '100%'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Signers
        </label>
        
        {signers.map((signer, index) => (
          <div key={index} style={{ 
            marginBottom: '12px', 
            padding: '12px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '6px',
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Name
              </label>
              <input
                type="text"
                value={signer.name}
                onChange={(e) => updateSigner(index, 'name', e.target.value)}
                placeholder="Signer's name"
                style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Email
              </label>
              <input
                type="email"
                value={signer.email}
                onChange={(e) => updateSigner(index, 'email', e.target.value)}
                placeholder="Signer's email"
                style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Role
              </label>
              <select
                value={signer.role}
                onChange={(e) => updateSigner(index, 'role', e.target.value)}
                style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  width: '100%',
                  backgroundColor: '#fff'
                }}
              >
                <option value="signer">Signer</option>
                <option value="cc">Carbon Copy</option>
                <option value="approver">Approver</option>
              </select>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addSigner}
          style={{
            backgroundColor: '#f9fafb',
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Add Another Signer
        </button>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={sendForSigning}
          disabled={loading || !documentContent || signers.some(s => !s.name || !s.email)}
          style={{
            backgroundColor: '#dc2626',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: (loading || !documentContent || signers.some(s => !s.name || !s.email)) ? 0.7 : 1
          }}
        >
          {loading ? 'Processing...' : 'Send for Signing'}
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
          Document sent successfully! Envelope ID: {result.envelopeId}
        </div>
      )}
    </div>
  );
};

export default DocuSignIntegration;