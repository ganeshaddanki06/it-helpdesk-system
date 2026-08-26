import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight, Server } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

import { assetService } from '../services/assetService';

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        search: search || undefined,
        asset_type: typeFilter || undefined,
        status: statusFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await assetService.getAssets(params);
      setAssets(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch IT assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page, typeFilter, statusFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAssets();
  };

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setStatusFilter('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  const handleDelete = async (assetId) => {
    if (window.confirm(`Are you sure you want to delete asset ${assetId}?`)) {
      try {
        await assetService.deleteAsset(assetId);
        fetchAssets();
      } catch (err) {
        alert(`Failed to delete asset: ${err.message}`);
      }
    }
  };

  return (
    <div className="assets-page">
      <PageHeader
        title="IT Asset Inventory"
        description="Track and manage campus hardware, workstations, network switches, and lab equipment."
        actions={
          <Link to="/assets/new" className="btn-primary">
            <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add IT Asset
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
              placeholder="Search by Asset ID, name, serial number, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="select-group">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Equipment Types</option>
              <option value="Desktop">Desktop</option>
              <option value="Laptop">Laptop</option>
              <option value="Printer">Printer</option>
              <option value="Projector">Projector</option>
              <option value="Router">Router</option>
              <option value="Switch">Switch</option>
              <option value="Other">Other</option>
            </select>

            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Statuses</option>
              <option value="Working">Working</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>

            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
            }} className="filter-select">
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="asset_name-asc">Name (A-Z)</option>
              <option value="status-asc">Status</option>
            </select>

            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.875rem' }}>
              Search
            </button>

            {(search || typeFilter || statusFilter || sortBy !== 'created_at') && (
              <button type="button" onClick={handleClearFilters} className="btn-secondary" style={{ padding: '0.5rem 0.875rem' }}>
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Assets Content Table */}
      {loading ? (
        <LoadingSpinner message="Loading asset inventory from database..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAssets} />
      ) : assets.length === 0 ? (
        <EmptyState
          title="No IT assets found"
          description="No equipment matches your search or active filter criteria."
          action={
            <Link to="/assets/new" className="btn-primary">
              <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Add First IT Asset
            </Link>
          }
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Asset Name</th>
                  <th>Type</th>
                  <th>Serial Number</th>
                  <th>Location</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link to={`/assets/${a.asset_id}`} style={{ fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>
                        {a.asset_id}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{a.asset_name}</td>
                    <td><span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{a.asset_type}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#64748b' }}>{a.serial_number || 'N/A'}</td>
                    <td>{a.location}</td>
                    <td>{a.department || 'General'}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link to={`/assets/${a.asset_id}`} className="action-btn" title="View Details">
                          <Eye style={{ width: '1rem', height: '1rem', color: '#2563eb' }} />
                        </Link>
                        <button onClick={() => handleDelete(a.asset_id)} className="action-btn" title="Delete Asset">
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
              Showing <strong>{assets.length}</strong> of <strong>{total}</strong> equipment units
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