import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';

export default function TicketsList() {
  const { isAdmin } = useAuth(); // Only Admin can delete
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        category: category || undefined,
        sort_by: 'created_at',
        sort_order: sortOrder,
      };

      const res = await ticketService.listTickets(params);
      setTickets(res.tickets || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, status, priority, category, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const handleDelete = async (ticketId) => {
    if (!isAdmin) {
      alert('Access Denied: Only Admin can delete tickets.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ticket ${ticketId}?`)) {
      try {
        await ticketService.deleteTicket(ticketId);
        fetchTickets();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="tickets-page">
      <PageHeader
        title="Support Tickets"
        description="Search, filter, track status, and manage campus IT complaints."
        actions={
          <Link to="/tickets/new" className="btn-primary">
            <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} /> Create Ticket
          </Link>
        }
      />

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="search-box">
            <Search style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Ticket ID, title, requester, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="select-group">
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Categories</option>
              <option value="Computer/Lab">Computer/Lab</option>
              <option value="Network">Network</option>
              <option value="Projector">Projector</option>
              <option value="Printer">Printer</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>

            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }} className="filter-select">
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            <button type="submit" className="btn-primary" style={{ padding: '0.625rem 1rem' }}>
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching campus tickets..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTickets} />
      ) : tickets.length === 0 ? (
        <EmptyState title="No tickets found" description="Try adjusting your search criteria or create a new ticket." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title & Description</th>
                  <th>Requester</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>{t.ticket_id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{t.issue_title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                        {t.issue_description}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#f1f5f9' }}>{t.requester_name}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{t.requester_type}</div>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{t.location}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link to={`/tickets/${t.ticket_id}`} className="action-btn" title="View Details" style={{ color: '#38bdf8' }}>
                          <Eye style={{ width: '1.125rem', height: '1.125rem' }} />
                        </Link>
                        {/* ONLY ADMIN SEES THE TRASH / DELETE ICON */}
                        {isAdmin && (
                          <button onClick={() => handleDelete(t.ticket_id)} className="action-btn" title="Delete Ticket" style={{ color: '#ef4444' }}>
                            <Trash2 style={{ width: '1.125rem', height: '1.125rem' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              Showing {tickets.length} of {total} tickets
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="pagination-btn">
                <ChevronLeft style={{ width: '1rem', height: '1rem' }} /> Prev
              </button>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc', margin: '0 0.5rem' }}>
                {page} / {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="pagination-btn">
                Next <ChevronRight style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}