import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Clock, CheckCircle2, AlertTriangle, Server, Wrench, XCircle, Plus } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

import { analyticsService } from '../services/analyticsService';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, ticketsRes, assetsRes] = await Promise.all([
        analyticsService.getDashboardSummary(),
        analyticsService.getRecentTickets(5),
        analyticsService.getRecentAssets(5),
      ]);

      setSummary(summaryRes);
      setRecentTickets(ticketsRes || []);
      setRecentAssets(assetsRes || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to the IT Helpdesk backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching real-time IT metrics from FastAPI..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  const tickets = summary?.tickets || { total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 };
  const assets = summary?.assets || { total: 0, working: 0, under_maintenance: 0, out_of_service: 0 };

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard Overview"
        description="Real-time performance metrics, ticket status counters, and IT asset health."
        actions={
          <Link to="/tickets/new" className="btn-primary">
            <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> New Ticket
          </Link>
        }
      />

      <h2 className="section-title">Support Tickets Overview</h2>
      <div className="stats-grid">
        <StatCard title="Total Tickets" value={tickets.total} icon={Ticket} color="blue" subtitle="All-time logged issues" />
        <StatCard title="Open Tickets" value={tickets.open} icon={AlertTriangle} color="amber" subtitle="Awaiting diagnosis" />
        <StatCard title="In Progress" value={tickets.in_progress} icon={Clock} color="indigo" subtitle="Under technician repair" />
        <StatCard title="Resolved" value={tickets.resolved + tickets.closed} icon={CheckCircle2} color="emerald" subtitle="Completed & verified" />
      </div>

      <h2 className="section-title mt-8">IT Assets & Equipment</h2>
      <div className="stats-grid">
        <StatCard title="Total Assets" value={assets.total} icon={Server} color="slate" subtitle="Hardware in inventory" />
        <StatCard title="Working Assets" value={assets.working} icon={CheckCircle2} color="emerald" subtitle="Fully operational" />
        <StatCard title="Under Maintenance" value={assets.under_maintenance} icon={Wrench} color="amber" subtitle="In repair / servicing" />
        <StatCard title="Out of Service" value={assets.out_of_service} icon={XCircle} color="rose" subtitle="Decommissioned / faulty" />
      </div>

      <div className="recent-grid mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tickets</h3>
            <Link to="/tickets" className="card-link">View All Tickets &rarr;</Link>
          </div>
          {recentTickets.length === 0 ? (
            <EmptyState title="No recent tickets" description="No tickets have been submitted yet." />
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Issue Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>{t.ticket_id}</td>
                      <td>{t.issue_title}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Assets</h3>
            <Link to="/assets" className="card-link">View All Assets &rarr;</Link>
          </div>
          {recentAssets.length === 0 ? (
            <EmptyState title="No assets logged" description="No equipment found in the database." />
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Asset Name</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>{a.asset_id}</td>
                      <td>{a.asset_name}</td>
                      <td><span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{a.asset_type}</span></td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}