import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Server, Shield, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-title">IT Helpdesk</span>
            <span className="sidebar-badge" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              v1.0 Live
            </span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/tickets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Ticket style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Support Tickets</span>
          </NavLink>

          <NavLink to="/assets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Server style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Hardware Assets</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Shield style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Staff Administration</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot-pulse" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Campus Network Online</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.6875rem', marginTop: '0.35rem' }}>Institutional Helpdesk System</p>
        </div>
      </aside>
    </>
  );
}