import React from 'react';

export default function PriorityBadge({ priority }) {
  const getStyle = (pr) => {
    switch (pr) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  return <span className={`priority-badge ${getStyle(priority)}`}>{priority || 'Medium'}</span>;
}