/**
 * Environment Checker Component
 * Helps debug environment variable issues in production
 */

import React from 'react';

const EnvironmentChecker = ({ children }) => {
  const requiredEnvVars = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  // Only show environment checker in production if there are missing variables
  // or if explicitly requested via URL parameter
  const showChecker = missingVars.length > 0 || 
                     new URLSearchParams(window.location.search).has('debug-env');

  if (showChecker) {
    return (
      <div style={{
        padding: '20px',
        margin: '20px',
        border: '2px solid #f39c12',
        borderRadius: '8px',
        backgroundColor: '#fef9e7',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h2 style={{ color: '#e67e22', marginBottom: '15px' }}>
          ⚠️ Environment Configuration Issue
        </h2>
        
        {missingVars.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#d35400' }}>Missing Required Environment Variables:</h3>
            <ul style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px' }}>
              {missingVars.map(varName => (
                <li key={varName} style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  {varName}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#d35400' }}>Environment Status:</h3>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '15px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <hr style={{ margin: '10px 0' }} />
            {requiredEnvVars.map(varName => (
              <p key={varName}>
                <strong>{varName}:</strong>{' '}
                {process.env[varName] ? (
                  <span style={{ color: '#27ae60' }}>✅ Configured</span>
                ) : (
                  <span style={{ color: '#e74c3c' }}>❌ Missing</span>
                )}
              </p>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #2196f3'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>How to Fix:</h4>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Go to your Vercel Dashboard</li>
            <li>Navigate to Project Settings → Environment Variables</li>
            <li>Add the missing environment variables</li>
            <li>Redeploy your application</li>
          </ol>
        </div>

        {missingVars.length === 0 && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ color: '#27ae60' }}>
              ✅ All required environment variables are configured!
            </p>
            {children}
          </div>
        )}
      </div>
    );
  }

  return children;
};

export default EnvironmentChecker;