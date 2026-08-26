import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

import { ticketService } from '../services/ticketService';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
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
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        category: categoryFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await ticketService.getTickets(params);
      setTickets(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm(`Are you sure you want to delete ticket ${ticketId}?`)) {
      try {
        await ticketService.deleteTicket(ticketId);
        fetchTickets();
      } catch (err) {
        alert(`Failed to delete ticket: ${err.message}`);
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
            <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Create Ticket
          </Link>
        }
      />

      {/* Search & Filters Card */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="search-box">
            <Search style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Ticket ID, title, requester, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="select-group">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Categories</option>
              <option value="Network">Network / Wi-Fi</option>
              <option value="Computer/Lab">Computer / Lab</option>
              <option value="Printer">Printer</option>
              <option value="Projector">Projector</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Other">Other</option>
            </select>

            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
            }} className="filter-select">
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="priority-desc">Priority</option>
              <option value="status-asc">Status</option>
            </select>

            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.875rem' }}>
              Search
            </button>

            {(search || statusFilter || priorityFilter || categoryFilter || sortBy !== 'created_at') && (
              <button type="button" onClick={handleClearFilters} className="btn-secondary" style={{ padding: '0.5rem 0.875rem' }}>
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tickets Content Table */}
      {loading ? (
        <LoadingSpinner message="Loading tickets from database..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTickets} />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description="Try adjusting your search terms or clear active filters."
          action={
            <Link to="/tickets/new" className="btn-primary">
              <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Create New Ticket
            </Link>
          }
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Requester</th>
                  <th>Category</th>
                  <th>Issue Title</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/tickets/${t.ticket_id}`} style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                        {t.ticket_id}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{t.requester_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.requester_type}</div>
                    </td>
                    <td><span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{t.category}</span></td>
                    <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.issue_title}</td>
                    <td>{t.location}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link to={`/tickets/${t.ticket_id}`} className="action-btn" title="View Details">
                          <Eye style={{ width: '1rem', height: '1rem', color: '#2563eb' }} />
                        </Link>
                        <button onClick={() => handleDelete(t.ticket_id)} className="action-btn" title="Delete Ticket">
                          <Trash2 style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Showing <strong>{tickets.length}</strong> of <strong>{total}</strong> tickets
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="pagination-btn">
                <ChevronLeft style={{ width: '1rem', height: '1rem' }} /> Previous
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 0.5rem' }}>
                Page {page} of {totalPages}
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