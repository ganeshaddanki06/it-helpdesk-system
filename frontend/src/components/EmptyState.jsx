import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', description = 'There is no data to display right now.', action }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center', margin: '1rem 0' }}>
      <Inbox style={{ width: '3rem', height: '3rem', color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>{title}</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '350px', margin: '0 auto 1rem auto' }}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}