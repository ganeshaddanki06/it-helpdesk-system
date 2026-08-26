import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, History, Save, Trash2 } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

import { ticketService } from '../services/ticketService';
import api from '../services/api';

export default function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('');
  const [assignedTechId, setAssignedTechId] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.getTicket(ticketId);
      setTicket(res);
      setStatus(res.status);
      setAssignedTechId(res.assigned_technician_id || '');
      setResolutionNotes(res.resolution_notes || '');

      const techs = await api.get('/technicians');
      setTechnicians(techs || []);
    } catch (err) {
      setError(err.message || 'Ticket not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg(null);
    try {
      setUpdating(true);
      const payload = {
        status: status || undefined,
        assigned_technician_id: assignedTechId ? parseInt(assignedTechId) : null,
        resolution_notes: resolutionNotes || undefined,
      };

      const updated = await ticketService.updateTicket(ticketId, payload);
      setTicket(updated);
      setUpdateMsg('Ticket updated successfully!');
      setTimeout(() => setUpdateMsg(null), 4000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete ticket ${ticketId}?`)) {
      try {
        await ticketService.deleteTicket(ticketId);
        alert(`Ticket ${ticketId} deleted successfully.`);
        navigate('/tickets');
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching ticket details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTicket} />;
  if (!ticket) return null;

  return (
    <div className="ticket-detail-page">
      <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
        <ArrowLeft style={{ width: '1rem', height: '1rem' }} /> Back to Tickets List
      </Link>

      <PageHeader
        title={`Ticket ${ticket.ticket_id}`}
        description={`Reported by ${ticket.requester_name} (${ticket.requester_type}) • Created on ${new Date(ticket.created_at).toLocaleString()}`}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <button onClick={handleDelete} className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fecaca', marginLeft: '0.5rem' }}>
              <Trash2 style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Delete
            </button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>{ticket.issue_title}</h3>
            <p style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              {ticket.issue_description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Location</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem', color: '#0f172a', fontWeight: 500 }}>
                  <MapPin style={{ width: '1rem', height: '1rem', color: '#2563eb' }} /> {ticket.location}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Category</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem', color: '#0f172a', fontWeight: 500 }}>
                  <Tag style={{ width: '1rem', height: '1rem', color: '#4f46e5' }} /> {ticket.category}
                </div>
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} /> Status History & Audit Timeline
            </h3>

            {ticket.history?.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No history records logged.</p>
            ) : (
              <div className="timeline">
                {ticket.history.map((h, idx) => (
                  <div key={h.id || idx} className="timeline-item">
                    <div className="timeline-dot" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                          {h.old_status ? `${h.old_status} → ${h.new_status}` : `Status: ${h.new_status}`}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {new Date(h.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>{h.notes || 'Status updated.'}</p>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Changed by: {h.changed_by}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Update Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Update Status & Assignment</h3>

            {updateMsg && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {updateMsg}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Ticket Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Assigned Support Staff</label>
                <select value={assignedTechId} onChange={(e) => setAssignedTechId(e.target.value)} className="form-select">
                  <option value="">-- Unassigned --</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Resolution / Troubleshooting Notes</label>
                <textarea
                  rows="4"
                  placeholder="Notes on replacement parts, configuration changes, or root cause..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" disabled={updating} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {updating ? 'Saving Changes...' : 'Save & Update Ticket'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}