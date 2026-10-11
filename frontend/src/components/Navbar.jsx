import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Safe User extraction
  let displayName = 'Addanki Veera Venkata Sai Ganesh (23MH1A05P7)';
  let userRole = 'Student / User';
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      if (raw.startsWith('{')) {
        const parsed = JSON.parse(raw);
        displayName = parsed.name || parsed.username || displayName;
        userRole = parsed.role ? (parsed.role.charAt(0).toUpperCase() + parsed.role.slice(1)) : userRole;
      } else {
        const clean = raw.replace(/"/g, '').trim();
        if (clean.toLowerCase() === 'admin') {
          displayName = 'System Administrator';
          userRole = 'Admin';
        } else if (clean.toLowerCase() === 'ydp') {
          displayName = 'Prof. Y. D. Prasad';
          userRole = 'Faculty';
        }
      }
    }
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordMsg('Password must be at least 4 characters');
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('custom_passwords') || '{}');
      stored['current'] = newPassword;
      localStorage.setItem('custom_passwords', JSON.stringify(stored));
      setPasswordMsg('Password updated successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMsg('');
        setNewPassword('');
      }, 1200);
    } catch (err) {
      setPasswordMsg('Error updating password.');
    }
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#070d1e',
      borderBottom: '1px solid #1e293b',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 30
    }}>
      {/* Left: Mobile Hamburger & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuToggle}
          className="lg:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ☰
        </button>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>
          IT Helpdesk & Asset Management System
        </span>
      </div>

      {/* Right: Notifications, User Pill, Password, Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              position: 'relative',
              padding: '6px'
            }}
          >
            🔔
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '800',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </span>
          </button>

          {/* Notifications Dropdown (ONLY shows when clicked) */}
          {showNotifications && (
            <>
              {/* Click-outside backdrop with pointer-events guard */}
              <div
                onClick={() => setShowNotifications(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 35,
                  backgroundColor: 'transparent'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '46px',
                right: '0',
                width: '300px',
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                zIndex: 40
              }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
                  Recent Notifications
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                  <div style={{ padding: '8px', backgroundColor: '#020617', borderRadius: '8px' }}>
                    <strong style={{ color: '#38bdf8' }}>#01-082</strong> Wi-Fi issue assigned to technician.
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#020617', borderRadius: '8px' }}>
                    <strong style={{ color: '#34d399' }}>#01-075</strong> Printer repair marked resolved.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#0b1329',
          border: '1px solid #1e293b',
          padding: '6px 14px',
          borderRadius: '9999px'
        }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
              {displayName}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
              {userRole}
            </div>
          </div>
        </div>

        {/* Password Change Button */}
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            color: '#60a5fa',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🔑 Password
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#f87171',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Password Modal (ONLY mounts when showPasswordModal is TRUE) */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '400px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
              Change Password
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
              Set a private password for your account.
            </p>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {passwordMsg && <p style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '12px' }}>{passwordMsg}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#cbd5e1', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', backgroundColor: '#2563eb', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}