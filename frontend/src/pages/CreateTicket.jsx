import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import { ticketService } from '../services/ticketService';
import api from '../services/api';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    requester_name: '',
    requester_type: 'Student',
    category: 'Network',
    issue_title: '',
    issue_description: '',
    location: '',
    priority: 'Medium',
    assigned_technician_id: '',
  });

  useEffect(() => {
    api.get('/technicians')
      .then((res) => setTechnicians(res || []))
      .catch(() => setTechnicians([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.requester_name.trim() || !formData.issue_title.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        assigned_technician_id: formData.assigned_technician_id ? parseInt(formData.assigned_technician_id) : null,
      };

      const created = await ticketService.createTicket(payload);
      alert(`Ticket ${created.ticket_id} created successfully!`);
      navigate(`/tickets/${created.ticket_id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
        <ArrowLeft style={{ width: '1rem', height: '1rem' }} /> Back to Tickets List
      </Link>

      <PageHeader
        title="Submit New Support Ticket"
        description="Report an IT hardware, software, lab PC, or Wi-Fi problem."
      />

      <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Requester Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                name="requester_name"
                required
                placeholder="e.g. Rahul Kumar or Dr. Alan"
                value={formData.requester_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requester Role <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="requester_type" value={formData.requester_type} onChange={handleChange} className="form-select">
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Problem Category <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                <option value="Network">Network / Wi-Fi</option>
                <option value="Computer/Lab">Computer / Lab PC</option>
                <option value="Printer">Printer / Scanner</option>
                <option value="Projector">Projector / AV</option>
                <option value="Software">Software Installation</option>
                <option value="Hardware">Hardware Failure</option>
                <option value="Other">Other IT Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="form-select">
                <option value="Low">Low (General Query)</option>
                <option value="Medium">Medium (Single user affected)</option>
                <option value="High">High (Classroom/Lab affected)</option>
                <option value="Critical">Critical (Outage / Exam disruption)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Campus Location / Room <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. CS Lab 3, 2nd Floor or Seminar Hall A"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Issue Summary / Title <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                name="issue_title"
                required
                placeholder="Brief summary of the issue (e.g. Wi-Fi disconnecting frequently)"
                value={formData.issue_title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Detailed Description <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea
                name="issue_description"
                rows="4"
                required
                placeholder="Provide detailed explanation, error messages, or steps to reproduce..."
                value={formData.issue_description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Assign Support Technician (Optional)</label>
              <select name="assigned_technician_id" value={formData.assigned_technician_id} onChange={handleChange} className="form-select">
                <option value="">-- Leave Unassigned (Assign Later) --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <Link to="/tickets" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={submitting} className="btn-primary">
              <Send style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {submitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}