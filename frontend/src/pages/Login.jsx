import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LifeBuoy, Lock, User, ArrowRight, ShieldCheck, KeyRound, Mail, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
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
      setError(err.message || 'Invalid username or password.');
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 50%, #020617 100%)', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem auto', boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}>
            <LifeBuoy style={{ width: '30px', height: '30px', color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Campus IT Service Portal</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>Faculty, Staff & Student Institutional Login</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Username / Official Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="e.g. admin or ydp"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label">Account Password</label>
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
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9375rem' }}>
            {submitting ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
          </button>
        </form>

        {/* Institutional Directory Box */}
        <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
            <ShieldCheck style={{ width: '1rem', height: '1rem' }} /> Authorized Staff Directory:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>• 🛡️ <strong>Admin:</strong> <code>admin</code> / <code>admin123</code></div>
            <div>• 👨‍🏫 <strong>Faculty (YDP):</strong> <code>ydp</code> / <code>faculty123</code></div>
            <div>• 👨‍🏫 <strong>Prof. Alan:</strong> <code>faculty_alan</code> / <code>faculty123</code></div>
            <div>• 🔧 <strong>Tech:</strong> <code>tech_rahul</code> / <code>tech123</code></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
          Student? <Link to="/register" style={{ color: '#38bdf8', fontWeight: 600 }}>Register Student Account</Link>
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
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>Enter your username or email to receive reset instructions.</p>
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
                <label className="form-label">Username or Registered Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="e.g. ydp or admin"
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