import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, KeyRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Navbar({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return { bg: '#fee2e2', color: '#dc2626', label: 'Admin' };
      case 'faculty':
        return { bg: '#fef3c7', color: '#b45309', label: 'Faculty / Professor' };
      case 'technician':
        return { bg: '#e0e7ff', color: '#4338ca', label: 'Technician' };
      default:
        return { bg: '#eff6ff', color: '#2563eb', label: 'Student / User' };
    }
  };

  const roleStyle = getRoleBadgeStyle(currentUser?.role);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setSubmitting(true);
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword });
      setStatusMsg({ type: 'success', text: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setStatusMsg({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
            <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          <span className="navbar-system-name">IT Helpdesk & Asset Management System</span>
        </div>

        <div className="navbar-right">
          <div className="notification-btn" title="Live College IT Alerts">
            <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
            <span className="notification-dot"></span>
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

              {/* Change Password Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="action-btn"
                title="Change Password"
                style={{
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.4rem 0.625rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)'
                }}
              >
                <KeyRound style={{ width: '0.875rem', height: '0.875rem' }} /> Password
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="action-btn"
                title="Logout session"
                style={{
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.4rem 0.625rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowPasswordModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>Change Account Password</h3>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Update your login credentials securely.</p>

            {statusMsg.text && (
              <div style={{
                backgroundColor: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${statusMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: statusMsg.type === 'success' ? '#34d399' : '#f87171',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.8125rem'
              }}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Current Password</label>
                <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" className="form-input" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">New Password (Min 6 chars)</label>
                <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="form-input" />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm New Password</label>
                <input type="password" required minLength="6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="form-input" />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}