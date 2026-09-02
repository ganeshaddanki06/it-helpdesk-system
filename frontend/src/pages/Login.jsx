import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LifeBuoy, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('faculty_alan');
  const [password, setPassword] = useState('faculty123');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 50%, #020617 100%)', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem', boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem auto', boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}>
            <LifeBuoy style={{ width: '30px', height: '30px', color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Campus IT Helpdesk Login</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>Faculty, Staff & Student Service Portal</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Username / College Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="e.g. faculty_alan or admin"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
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

          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9375rem' }}>
            {submitting ? 'Signing in...' : 'Sign In'} <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
          </button>
        </form>

        {/* Demo Logins Box */}
        <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
          <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>Direct College Logins:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>• 👨‍🏫 <strong>Faculty:</strong> <code>faculty_alan</code> / <code>faculty123</code></div>
            <div>• 🛡️ <strong>Admin:</strong> <code>admin</code> / <code>admin123</code></div>
            <div>• 🔧 <strong>Tech:</strong> <code>tech_rahul</code> / <code>tech123</code></div>
            <div>• 🎓 <strong>Student:</strong> <code>student_user</code> / <code>user123</code></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
          Student? <Link to="/register" style={{ color: '#38bdf8', fontWeight: 600 }}>Create Student Account</Link>
        </div>
      </div>
    </div>
  );
}