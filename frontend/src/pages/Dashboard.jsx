import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Clock, CheckCircle2, AlertTriangle, Server, Wrench, XCircle, Plus, Wifi, Laptop, Video, Activity, Sparkles } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentAssets, setRecentAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, ticketsRes, assetsRes, categoriesRes] = await Promise.all([
        analyticsService.getDashboardSummary(),
        analyticsService.getRecentTickets(5),
        analyticsService.getRecentAssets(5),
        analyticsService.getTicketCategoryAnalytics().catch(() => ({ data: [] })),
      ]);

      setSummary(summaryRes);
      setRecentTickets(ticketsRes || []);
      setRecentAssets(assetsRes || []);
      setCategories(categoriesRes?.data || []);
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

  const workingPercentage = assets.total > 0 ? Math.round((assets.working / assets.total) * 100) : 100;
  const resolutionRate = tickets.total > 0 ? Math.round(((tickets.resolved + tickets.closed) / tickets.total) * 100) : 100;

  return (
    <div className="dashboard-page">
      {/* Welcome Hero Banner */}
      <div className="card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #0b1329 0%, #1e293b 100%)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '9999px', marginBottom: '0.5rem' }}>
              <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} /> Real-Time Operations
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Welcome back, {currentUser?.full_name || 'Administrator'}! 👋
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Campus infrastructure is running at <strong style={{ color: '#10b981' }}>{workingPercentage}% operational health</strong> today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/tickets/new" className="btn-primary">
              <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} /> Report IT Issue
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Incident Reporting Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Report:
        </span>
        <Link to="/tickets/new" className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
          <Wifi style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem', color: '#2563eb' }} /> Lab Wi-Fi Issue
        </Link>
        <Link to="/tickets/new" className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
          <Laptop style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem', color: '#7c3aed' }} /> Workstation Boot Error
        </Link>
        <Link to="/tickets/new" className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
          <Video style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem', color: '#db2777' }} /> Seminar Hall Projector
        </Link>
      </div>

      {/* Ticket Stats Section */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Support Tickets Overview
      </h2>
      <div className="stats-grid">
        <StatCard title="Total Tickets" value={tickets.total} icon={Ticket} color="blue" subtitle="All-time campus complaints" />
        <StatCard title="Open Tickets" value={tickets.open} icon={AlertTriangle} color="amber" subtitle="Awaiting diagnosis" />
        <StatCard title="In Progress" value={tickets.in_progress} icon={Clock} color="indigo" subtitle="Under technician repair" />
        <StatCard title="Resolved" value={tickets.resolved + tickets.closed} icon={CheckCircle2} color="emerald" subtitle={`Resolution Rate: ${resolutionRate}%`} />
      </div>

      {/* Asset Stats Section */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e293b', marginTop: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        IT Equipment & Hardware Inventory
      </h2>
      <div className="stats-grid">
        <StatCard title="Total Assets" value={assets.total} icon={Server} color="slate" subtitle="Hardware units registered" />
        <StatCard title="Working Units" value={assets.working} icon={CheckCircle2} color="emerald" subtitle={`${workingPercentage}% Operational`} />
        <StatCard title="Under Maintenance" value={assets.under_maintenance} icon={Wrench} color="amber" subtitle="In repair / lamp replacement" />
        <StatCard title="Out of Service" value={assets.out_of_service} icon={XCircle} color="rose" subtitle="Faulty / decommissioned" />
      </div>

      {/* Visual Analytics Ratio Card */}
      <div className="card" style={{ padding: '1.5rem', marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Campus Hardware Health Ratio</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Live operational status of all registered computer systems, projectors & network switches</p>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10b981' }}>{workingPercentage}% Operational</span>
        </div>

        {/* Multi-Segment Health Progress Bar */}
        <div className="progress-bar-container" style={{ height: '12px', display: 'flex' }}>
          <div style={{ width: `${workingPercentage}%`, backgroundColor: '#10b981' }} title={`Working: ${assets.working}`} />
          <div style={{ width: `${assets.total > 0 ? (assets.under_maintenance / assets.total) * 100 : 0}%`, backgroundColor: '#f59e0b' }} title={`Maintenance: ${assets.under_maintenance}`} />
          <div style={{ width: `${assets.total > 0 ? (assets.out_of_service / assets.total) * 100 : 0}%`, backgroundColor: '#ef4444' }} title={`Out of Service: ${assets.out_of_service}`} />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Working ({assets.working})
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Maintenance ({assets.under_maintenance})
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Out of Service ({assets.out_of_service})
          </span>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="recent-grid" style={{ marginTop: '2.5rem' }}>
        {/* Recent Tickets Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Support Tickets</h3>
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
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{t.ticket_id}</td>
                      <td style={{ fontWeight: 600 }}>{t.issue_title}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Assets Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Registered Assets</h3>
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
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>{a.asset_id}</td>
                      <td style={{ fontWeight: 600 }}>{a.asset_name}</td>
                      <td><span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>{a.asset_type}</span></td>
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