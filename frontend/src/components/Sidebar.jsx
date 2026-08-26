import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Server, ShieldAlert, LifeBuoy } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'Assets', path: '/assets', icon: Server },
    { name: 'Admin View', path: '/admin', icon: ShieldAlert },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LifeBuoy style={{ width: '1.5rem', height: '1.5rem', color: '#60a5fa' }} />
            <span className="sidebar-title">IT Helpdesk</span>
          </div>
          <span className="sidebar-badge">DEMO</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-dot"></div>
            <span>FastAPI Server Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
}