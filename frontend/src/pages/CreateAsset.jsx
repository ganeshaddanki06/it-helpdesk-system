import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import { assetService } from '../services/assetService';

export default function CreateAsset() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: 'Desktop',
    serial_number: '',
    location: '',
    department: 'Computer Science',
    purchase_date: new Date().toISOString().split('T')[0],
    status: 'Working',
    assigned_person: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.asset_name.trim() || !formData.location.trim()) {
      setError('Please provide Asset Name and Location.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        serial_number: formData.serial_number.trim() || null,
        department: formData.department.trim() || null,
        purchase_date: formData.purchase_date.trim() || null,
        assigned_person: formData.assigned_person.trim() || null,
        notes: formData.notes.trim() || null,
      };

      const created = await assetService.createAsset(payload);
      alert(`Asset ${created.asset_id} added successfully!`);
      navigate(`/assets/${created.asset_id}`);
    } catch (err) {
      setError(err.message || 'Failed to add asset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-asset-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/assets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
        <ArrowLeft style={{ width: '1rem', height: '1rem' }} /> Back to Asset Inventory
      </Link>

      <PageHeader
        title="Add New IT Equipment"
        description="Register a computer, printer, projector, or networking hardware unit. Asset ID is generated automatically."
      />

      <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Asset Name / Model <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                name="asset_name"
                required
                placeholder="e.g. Dell OptiPlex 7090 Desktop or Epson EB-X49"
                value={formData.asset_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hardware Type <span style={{ color: '#ef4444' }}>*</span></label>
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
              <label className="form-label">Operational Status <span style={{ color: '#ef4444' }}>*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="Working">Working</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Manufacturer Serial Number</label>
              <input
                type="text"
                name="serial_number"
                placeholder="e.g. DL-7090-8821 (Must be unique)"
                value={formData.serial_number}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campus Location / Room <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Lab 2, Room 204 or Server Room"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Branch</label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Computer Science, Admin, Library"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Assigned Person / In-Charge</label>
              <input
                type="text"
                name="assigned_person"
                placeholder="e.g. Lab Assistant or HOD Office"
                value={formData.assigned_person}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Specifications / Technical Notes</label>
              <textarea
                name="notes"
                rows="3"
                placeholder="RAM, Processor, OS version, IP address, or service schedule..."
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <Link to="/assets" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={submitting} className="btn-primary">
              <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {submitting ? 'Registering...' : 'Register IT Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}