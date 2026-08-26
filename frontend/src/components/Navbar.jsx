import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
          <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
        <span className="navbar-system-name">IT Helpdesk & Asset Management System</span>
      </div>

      <div className="navbar-right">
        <div className="notification-btn" title="Demo Notifications">
          <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#64748b' }} />
          <span className="notification-dot"></span>
        </div>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-profile">
              <div className="user-avatar" style={{ backgroundColor: currentUser.role === 'admin' ? '#fee2e2' : '#dbeafe' }}>
                <User style={{ width: '1rem', height: '1rem', color: currentUser.role === 'admin' ? '#dc2626' : '#2563eb' }} />
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.full_name || currentUser.username}</span>
                <span className="user-role" style={{ textTransform: 'capitalize', color: currentUser.role === 'admin' ? '#dc2626' : '#2563eb', fontWeight: 600 }}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="action-btn"
              title="Logout session"
              style={{ color: '#ef4444', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.375rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
            >
              <LogOut style={{ width: '0.875rem', height: '0.875rem' }} /> Logout
            </button>
          </div>
        ) : (
          <span className="user-name">Guest User</span>
        )}
      </div>
    </header>
  );
}