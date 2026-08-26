import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LifeBuoy, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert('Registration successful! Please login with your new credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <LifeBuoy style={{ width: '28px', height: '28px', color: '#2563eb' }} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0f172a' }}>Create User Account</h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>Register as a student or faculty member to submit IT tickets.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" name="full_name" required placeholder="e.g. Ramesh Chandra" value={formData.full_name} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Username <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" name="username" required placeholder="e.g. ramesh01" value={formData.username} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="email" name="email" required placeholder="ramesh@demo.org" value={formData.email} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Password <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="password" name="password" required minLength="6" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="password" name="confirm_password" required minLength="6" placeholder="Re-enter password" value={formData.confirm_password} onChange={handleChange} className="form-input" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.625rem' }}>
            {submitting ? 'Registering...' : 'Register Account'} <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}