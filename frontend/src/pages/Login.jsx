import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LifeBuoy, Lock, User, ArrowRight, KeyRound, Mail, X, Shield, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('23mh1a05p7');
  const [password, setPassword] = useState('23mh1a05p7');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ type: '', text: '' });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      await login(usernameOrEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid Roll Number/Username or Password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg({ type: '', text: '' });
    try {
      setForgotSubmitting(true);
      const res = await authService.forgotPassword({ username_or_email: forgotInput });
      setForgotMsg({ type: 'success', text: res.message || 'Password reset email dispatched!' });
      setTimeout(() => {
        if (res.status === 'success') {
          setShowForgotModal(false);
          setForgotMsg({ type: '', text: '' });
          setForgotInput('');
        }
      }, 4000);
    } catch (err) {
      setForgotMsg({ type: 'error', text: err.message || 'Failed to process request.' });
    } finally {
      setForgotSubmitting(false);
    }
  };

  // One-click quick role selector for presentation
  const setQuickRole = (u, p) => {
    setUsernameOrEmail(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0a0f1d 60%, #020617 100%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background glows */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', bottom: '-80px', right: '-80px', pointerEvents: 'none' }} />

      <div className="card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        borderRadius: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(15, 23, 42, 0.75)'
      }}>
        {/* Portal Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)'
          }}>
            <LifeBuoy style={{ width: '32px', height: '32px', color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}>Campus IT Service Portal</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.35rem' }}>Aditya College of Engineering & Technology</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '0.625rem',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            lineHeight: 1.4
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username / Roll Number Input */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Roll Number / Official ID</span>
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>e.g. 23MH1A05P7 or ydp</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter Roll Number or Staff ID"
                className="form-input"
                style={{ paddingLeft: '2.5rem', textTransform: 'uppercase' }}
              />
              <User style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8125rem', fontSize: '0.9375rem', fontWeight: 700, borderRadius: '0.625rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
          </button>
        </form>

        {/* Presentation Fast-Login Chips */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
            Quick Presentation Logins
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setQuickRole('23mh1a05p7', '23mh1a05p7')}
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                color: '#60a5fa',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <GraduationCap style={{ width: '1rem', height: '1rem' }} /> Student
            </button>

            <button
              type="button"
              onClick={() => setQuickRole('ydp', 'faculty123')}
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Briefcase style={{ width: '1rem', height: '1rem' }} /> Faculty (YDP)
            </button>

            <button
              type="button"
              onClick={() => setQuickRole('admin', 'admin123')}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Shield style={{ width: '1rem', height: '1rem' }} /> Admin
            </button>
          </div>
        </div>

        {/* Institutional Security Notice */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.6875rem', color: '#475569' }}>
          Authorized Institutional Access Only • ACET Campus Operations
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowForgotModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <KeyRound style={{ width: '24px', height: '24px', color: '#38bdf8' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Reset Account Password</h3>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>Enter your Roll Number or Staff ID to receive reset instructions.</p>
            </div>

            {forgotMsg.text && (
              <div style={{
                backgroundColor: forgotMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${forgotMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: forgotMsg.type === 'success' ? '#34d399' : '#f87171',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.8125rem'
              }}>
                {forgotMsg.text}
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Roll Number or Registered Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="e.g. 23MH1A05P7 or ydp"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Mail style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button type="submit" disabled={forgotSubmitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {forgotSubmitting ? 'Dispatching Reset Email...' : 'Send Reset Instructions'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}