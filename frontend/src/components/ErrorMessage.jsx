import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', margin: '1.5rem 0' }}>
      <AlertCircle style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', margin: '0 auto 0.5rem auto' }} />
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#7f1d1d', marginBottom: '0.25rem' }}>Backend Connection Error</h3>
      <p style={{ fontSize: '0.875rem', color: '#991b1b', maxWidth: '400px', margin: '0 auto 1rem auto' }}>{message || 'Unable to connect to the FastAPI server.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dc2626' }}
        >
          <RefreshCw style={{ width: '1rem', height: '1rem' }} /> Try Again
        </button>
      )}
    </div>
  );
}