import React from 'react';

export default function StatusBadge({ status }) {
  const getStyle = (st) => {
    switch (st) {
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-inprogress';
      case 'Resolved': return 'badge-resolved';
      case 'Closed': return 'badge-closed';
      case 'Working': return 'badge-resolved';
      case 'Under Maintenance': return 'badge-inprogress';
      case 'Out of Service': return 'badge-critical';
      default: return 'badge-default';
    }
  };

  return (
    <span className={`status-badge ${getStyle(status)}`}>
      {status || 'Unknown'}
    </span>
  );
}