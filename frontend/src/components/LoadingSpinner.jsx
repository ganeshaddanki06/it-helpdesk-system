import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
}