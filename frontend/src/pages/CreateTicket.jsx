import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Mail } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    requester_name: currentUser?.full_name || 'Prof. Y.D.P (Faculty, CSE)',
    requester_type: currentUser?.role === 'faculty' ? 'Faculty' : 'Student',
    category: 'Computer/Lab',
    priority: 'Medium',
    location: 'Cotton Bhavan - CS Lab 3',
    issue_title: '',
    issue_description: '',
    recipient_email: 'ganeshaddanki06@gmail.com',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      const payload = {
        requester_name: formData.requester_name,
        requester_type: formData.requester_type,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        issue_title: formData.issue_title,
        issue_description: formData.issue_description,
      };

      const created = await api.post(`/tickets?recipient_email=${encodeURIComponent(formData.recipient_email)}`, payload);
      alert(`Ticket ${created.ticket_id} created successfully! Live notification dispatched to ${formData.recipient_email}`);
      navigate(`/tickets/${created.ticket_id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
        <ArrowLeft style={{ width: '1rem', height: '1rem' }} /> Back to Tickets List
      </Link>

      <PageHeader
        title="Log IT Support Incident"
        description="Submit a technical issue regarding lab workstations, Wi-Fi, seminar hall projectors, or campus software."
      />

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Requester Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" name="requester_name" required value={formData.requester_name} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Requester Role <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="requester_type" value={formData.requester_type} onChange={handleChange} className="form-select">
                <option value="Faculty">Faculty / Professor</option>
                <option value="Student">Student</option>
                <option value="Staff">Department Staff</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email for Instant Alerts & Updates <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="recipient_email"
                required
                placeholder="Enter email to receive live ticket confirmation"
                value={formData.recipient_email}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail style={{ width: '1.125rem', height: '1.125rem', color: '#38bdf8', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
              A real-time email notification with ticket details will be dispatched to this address.
            </span>
          </div>

          <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Problem Category <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                <option value="Computer/Lab">Computer / Lab PC</option>
                <option value="Network">Network / Campus Wi-Fi</option>
                <option value="Projector">Projector / Seminar Hall AV</option>
                <option value="Printer">Printer / Scanner</option>
                <option value="Software">Software / IDE Setup</option>
                <option value="Hardware">Other Hardware</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="form-select">
                <option value="Low">Low - General inquiry</option>
                <option value="Medium">Medium - Normal issue</option>
                <option value="High">High - Lab class in progress</option>
                <option value="Critical">Critical - Exam / Campus outage</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Campus Location / Room <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" name="location" required placeholder="e.g. Cotton Bhavan - CS Lab 3, System #14" value={formData.location} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Issue Summary / Title <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" name="issue_title" required placeholder="Brief description of the problem" value={formData.issue_title} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Detailed Description <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea name="issue_description" rows="4" required placeholder="Describe what happened, error messages displayed, etc." value={formData.issue_description} onChange={handleChange} className="form-textarea" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => navigate('/tickets')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              <Send style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {submitting ? 'Submitting & Dispatching Alert...' : 'Submit Support Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}