import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return { bg: '#fee2e2', color: '#dc2626', label: 'Admin' };
      case 'technician':
        return { bg: '#fef3c7', color: '#d97706', label: 'Technician' };
      default:
        return { bg: '#eff6ff', color: '#2563eb', label: 'User' };
    }
  };

  const roleStyle = getRoleBadgeStyle(currentUser?.role);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
          <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
        <span className="navbar-system-name">IT Helpdesk & Asset Management System</span>
      </div>

      <div className="navbar-right">
        <div className="notification-btn" title="Live System Alerts">
          <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#64748b' }} />
          <span className="notification-dot"></span>
        </div>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-profile">
              <div className="user-avatar" style={{ backgroundColor: roleStyle.bg }}>
                <User style={{ width: '1rem', height: '1rem', color: roleStyle.color }} />
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.full_name || currentUser.username}</span>
                <span className="user-role" style={{ textTransform: 'capitalize', color: roleStyle.color, fontWeight: 700, fontSize: '0.6875rem' }}>
                  {roleStyle.label}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="action-btn"
              title="Logout session"
              style={{
                color: '#ef4444',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '0.4rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: '#ffffff'
              }}
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