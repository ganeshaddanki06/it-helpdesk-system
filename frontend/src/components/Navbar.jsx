import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, KeyRound, X, CheckCircle2, AlertTriangle, Info, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Navbar({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();
  
  // Modals & Dropdowns States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Notifications State
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Ticket IT-2026-0002 Assigned',
      desc: 'Assigned to Rahul Kumar for diagnosis in Lab 3.',
      time: '10 mins ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Wi-Fi AP Restored',
      desc: 'Cotton Bhavan 2nd floor network connection is now stable.',
      time: '1 hour ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Projector Scheduled for Service',
      desc: 'Seminar Hall A projector lamp replacement in progress.',
      time: '3 hours ago',
      type: 'warning',
      read: false
    },
    {
      id: 4,
      title: 'Campus IT Advisory',
      desc: 'Routine server maintenance scheduled for coming weekend.',
      time: 'Yesterday',
      type: 'info',
      read: true
    }
  ]);

  // Password Change States
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

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

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
      <header className="navbar" style={{ position: 'relative', zIndex: 40 }}>
        <div className="navbar-left">
          <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
            <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          <span className="navbar-system-name">IT Helpdesk & Asset Management System</span>
        </div>

        <div className="navbar-right" style={{ position: 'relative' }}>
          {/* Notification Bell Container */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowAccountModal(false);
              }}
              className="notification-btn"
              title="Campus IT Alerts"
              style={{
                background: showNotifications ? 'rgba(56, 189, 248, 0.15)' : 'none',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                padding: '0.625rem',
                borderRadius: '0.625rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell style={{ width: '1.35rem', height: '1.35rem', color: showNotifications ? '#38bdf8' : '#94a3b8' }} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px #ef4444'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 80 }}
                  onClick={() => setShowNotifications(false)}
                />
                <div className="card" style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0px',
                  width: 'min(360px, 92vw)',
                  zIndex: 90,
                  padding: '0',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: '#0f172a'
                }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>Campus Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div key={n.id} style={{
                        padding: '0.875rem 1.25rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: n.read ? 'transparent' : 'rgba(56, 189, 248, 0.05)',
                        display: 'flex',
                        gap: '0.75rem'
                      }}>
                        <div style={{ marginTop: '2px' }}>
                          {n.type === 'success' && <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10b981' }} />}
                          {n.type === 'warning' && <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />}
                          {n.type === 'info' && <Info style={{ width: '1rem', height: '1rem', color: '#38bdf8' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: n.read ? '#cbd5e1' : '#ffffff' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{n.desc}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock style={{ width: '0.75rem', height: '0.75rem' }} /> {n.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-glass)', fontSize: '0.75rem', backgroundColor: '#1e293b' }}>
                    <span style={{ color: '#94a3b8' }}>Live Campus Operations Feed</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill (Clickable for Profile Details) */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                onClick={() => {
                  setShowAccountModal(true);
                  setShowNotifications(false);
                }}
                className="user-profile"
                title="Click to view full account details"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
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

              {/* Password Button */}
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

      {/* Account Details Modal */}
      {showAccountModal && currentUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowAccountModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: roleStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', boxShadow: `0 0 20px ${roleStyle.color}40` }}>
                <User style={{ width: '2rem', height: '2rem', color: roleStyle.color }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>{currentUser.full_name || currentUser.username}</h3>
              <span style={{ backgroundColor: roleStyle.bg, color: roleStyle.color, fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                {roleStyle.label}
              </span>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#94a3b8' }}>Username / ID:</span>
                <span style={{ color: '#ffffff', fontWeight: 600, fontFamily: 'monospace' }}>{currentUser.username}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#94a3b8' }}>Institutional Email:</span>
                <span style={{ color: '#38bdf8', fontWeight: 500 }}>{currentUser.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#94a3b8' }}>Department:</span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>Computer Science & Eng. (ACET)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#94a3b8' }}>Account Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck style={{ width: '0.875rem', height: '0.875rem' }} /> Verified Active
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setShowPasswordModal(true);
                }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem' }}
              >
                <KeyRound style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem' }} /> Password
              </button>
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  logout();
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem', backgroundColor: '#ef4444', borderColor: '#dc2626' }}
              >
                <LogOut style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem' }} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
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