import React, { useEffect, useState } from 'react';
import { Users, ShieldAlert, UserCheck, Wrench } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import { authService } from '../services/authService';
import api from '../services/api';

export default function AdminDashboard() {
  const [usersData, setUsersData] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, workloadRes] = await Promise.all([
        authService.getAllUsers(),
        api.get('/analytics/technicians/workload'),
      ]);
      setUsersData(usersRes);
      setWorkload(workloadRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin management console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="admin-page">
      <PageHeader
        title="IT Staff & User Administration"
        description="Role-based user management, technician allocation, and access control."
      />

      {loading ? (
        <LoadingSpinner message="Loading user directory and workload metrics..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAdminData} />
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <StatCard title="Total Users" value={usersData?.total || 0} icon={Users} color="blue" subtitle="Registered campus accounts" />
            <StatCard title="Administrators" value={usersData?.admin_count || 0} icon={ShieldAlert} color="rose" subtitle="Full system access" />
            <StatCard title="Technicians" value={usersData?.technician_count || 0} icon={Wrench} color="amber" subtitle="IT resolution staff" />
            <StatCard title="Standard Users" value={usersData?.user_count || 0} icon={UserCheck} color="emerald" subtitle="Students & faculty" />
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3 className="card-title">Registered User Directory</h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>USR-{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          backgroundColor: u.role === 'admin' ? '#fee2e2' : u.role === 'technician' ? '#fef3c7' : '#f1f5f9',
                          color: u.role === 'admin' ? '#991b1b' : u.role === 'technician' ? '#92400e' : '#475569'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}