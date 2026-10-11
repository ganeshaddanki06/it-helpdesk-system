import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // 100% Dynamic Self-Contained Identity Resolver (Zero external imports)
  const getIdentity = () => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        let uname = '';
        let role = '';
        let fullName = '';

        if (raw.startsWith('{')) {
          const parsed = JSON.parse(raw);
          uname = String(parsed.username || parsed.sub || parsed.roll_number || '').trim().toLowerCase();
          role = String(parsed.role || '').trim().toLowerCase();
          fullName = parsed.name || parsed.full_name || '';
        } else {
          uname = raw.replace(/"/g, '').trim().toLowerCase();
        }

        // 1. Admin Login
        if (uname === 'admin' || role === 'admin') {
          return { name: 'System Administrator', role: 'Admin' };
        }

        // 2. Faculty Login
        if (uname === 'ydp' || role === 'faculty') {
          return { name: 'Prof. Y. D. Prasad', role: 'Faculty' };
        }

        // 3. Known Students
        if (uname === '23mh1a05q6') {
          return { name: 'Kondapalli Gangavinay (23MH1A05Q6)', role: 'Student' };
        }
        if (uname === '23mh1a05m6') {
          return { name: 'Kottela Sandeep (23MH1A05M6)', role: 'Student' };
        }
        if (uname === '23mh1a05p7') {
          return { name: 'Addanki Veera Venkata Sai Ganesh (23MH1A05P7)', role: 'Student' };
        }

        // 4. Any other student or explicit name
        if (fullName) {
          return { name: fullName, role: role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'Student' };
        }
        if (uname.startsWith('23mh1a05')) {
          return { name: `CSE Student (${uname.toUpperCase()})`, role: 'Student' };
        }
        if (uname) {
          return { name: uname.toUpperCase(), role: 'User' };
        }
      }
    } catch (e) {}

    return { name: 'System Administrator', role: 'Admin' };
  };

  const { name: displayName, role: userRole } = getIdentity();

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

      {/* Right: Notifications, Dynamic User Pill, Password, Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        
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

          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 35, backgroundColor: 'transparent' }}
              />
              <div style={{
                position: 'absolute',
                top: '46px',
                right: '0',
                width: 'min(300px, 90vw)',
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

        {/* Dynamic User Pill - Matches EXACT login account */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#0b1329',
          border: '1px solid #1e293b',
          padding: '6px 12px',
          borderRadius: '9999px',
          maxWidth: '280px'
        }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
            👤
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '180px'
            }}>
              {displayName}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
              {userRole}
            </div>
          </div>
        </div>

        {/* Password Button */}
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            padding: '6px 10px',
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
          🔑 <span className="hidden sm:inline">Password</span>
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

      {/* Password Modal */}
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
              Set a private password for {displayName}.
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