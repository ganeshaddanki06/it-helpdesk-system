import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, MapPin, Building, Calendar, User, Server } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

import { assetService } from '../services/assetService';

export default function AssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: '',
    serial_number: '',
    location: '',
    department: '',
    purchase_date: '',
    status: '',
    assigned_person: '',
    notes: '',
  });

  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await assetService.getAsset(assetId);
      setAsset(res);
      setFormData({
        asset_name: res.asset_name || '',
        asset_type: res.asset_type || 'Desktop',
        serial_number: res.serial_number || '',
        location: res.location || '',
        department: res.department || '',
        purchase_date: res.purchase_date || '',
        status: res.status || 'Working',
        assigned_person: res.assigned_person || '',
        notes: res.notes || '',
      });
    } catch (err) {
      setError(err.message || 'Asset not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [assetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg(null);
    try {
      setUpdating(true);
      const payload = {
        ...formData,
        serial_number: formData.serial_number.trim() || null,
        department: formData.department.trim() || null,
        purchase_date: formData.purchase_date.trim() || null,
        assigned_person: formData.assigned_person.trim() || null,
        notes: formData.notes.trim() || null,
      };

      const updated = await assetService.updateAsset(assetId, payload);
      setAsset(updated);
      setUpdateMsg('Asset details saved successfully!');
      setTimeout(() => setUpdateMsg(null), 4000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete asset ${assetId}?`)) {
      try {
        await assetService.deleteAsset(assetId);
        alert(`Asset ${assetId} deleted successfully.`);
        navigate('/assets');
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching asset specifications..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAsset} />;
  if (!asset) return null;

  return (
    <div className="asset-detail-page">
      <Link to="/assets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
        <ArrowLeft style={{ width: '1rem', height: '1rem' }} /> Back to Asset Inventory
      </Link>

      <PageHeader
        title={`Asset ${asset.asset_id}`}
        description={`${asset.asset_name} • Registered on ${new Date(asset.created_at).toLocaleDateString()}`}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <StatusBadge status={asset.status} />
            <button onClick={handleDelete} className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fecaca', marginLeft: '0.5rem' }}>
              <Trash2 style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Delete
            </button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Left Column: Quick Spec Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Hardware Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Server style={{ width: '1.25rem', height: '1.25rem', color: '#4f46e5' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Equipment Category</span>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.asset_type}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Location</span>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.location}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Department</span>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.department || 'General'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#d97706' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Purchase Date</span>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.purchase_date || 'Not recorded'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User style={{ width: '1.25rem', height: '1.25rem', color: '#64748b' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Person</span>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.assigned_person || 'Unassigned'}</div>
                </div>
              </div>
            </div>

            {asset.notes && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Technical Specifications</span>
                <p style={{ color: '#334155', fontSize: '0.875rem', marginTop: '0.5rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
                  {asset.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Asset Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Edit Asset Details</h3>

            {updateMsg && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {updateMsg}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Asset Name / Model</label>
                <input type="text" name="asset_name" value={formData.asset_name} onChange={handleChange} required className="form-input" />
              </div>

              <div className="form-grid" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Equipment Type</label>
                  <select name="asset_type" value={formData.asset_type} onChange={handleChange} className="form-select">
                    <option value="Desktop">Desktop</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Printer">Printer</option>
                    <option value="Projector">Projector</option>
                    <option value="Router">Router</option>
                    <option value="Switch">Switch</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                    <option value="Working">Working</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>

              <div className="form-grid" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Serial Number</label>
                  <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required className="form-input" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Assigned Person</label>
                <input type="text" name="assigned_person" value={formData.assigned_person} onChange={handleChange} className="form-input" />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Technical Notes</label>
                <textarea rows="3" name="notes" value={formData.notes} onChange={handleChange} className="form-textarea" />
              </div>

              <button type="submit" disabled={updating} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {updating ? 'Saving Changes...' : 'Save & Update Asset'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}