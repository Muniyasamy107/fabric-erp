import React, { useState } from 'react';
import API from '../../services/api';
import './ScheduleJobModal.css';

const ScheduleJobModal = ({ fabrics = [], looms = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    fabricProductId: fabrics[0]?.id || '',
    fabricProductName: fabrics[0]?.fabricName || fabrics[0]?.name || '',
    assignedLoomNumber: looms[0]?.loomNumber || 'LOOM-A01',
    masterWeaverName: 'Weaver Palani',
    targetMeters: 500.0,
    startDate: new Date().toISOString().slice(0, 10),
    targetCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });
  const [loading, setLoading] = useState(false);

  const handleFabricChange = (productId) => {
    const matched = fabrics.find((f) => String(f.id) === String(productId));
    if (matched) {
      setForm({
        ...form,
        fabricProductId: matched.id,
        fabricProductName: matched.fabricName || matched.name
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/production/jobs', {
        ...form,
        fabricProductId: Number(form.fabricProductId),
        targetMeters: Number(form.targetMeters)
      });
      alert('Production Lot successfully scheduled on Loom!');
      onSuccess();
    } catch (err) {
      alert('Failed to schedule production job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sched-modal-overlay">
      <div className="sched-modal-content">
        <h2>Schedule Loom Production Lot</h2>
        <p className="modal-sub">Assign fabric quality, target yardage and master weaver operator to an active loom</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Fabric Quality to Weave *</label>
            <select
              value={form.fabricProductId}
              onChange={(e) => handleFabricChange(e.target.value)}
              required
            >
              <option value="">-- Choose Fabric Quality --</option>
              {fabrics.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.qualityCode || f.itemCode} — {f.fabricName || f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Allocate Loom Machine *</label>
              <select
                value={form.assignedLoomNumber}
                onChange={(e) => setForm({ ...form, assignedLoomNumber: e.target.value })}
                required
              >
                {looms.map((l) => (
                  <option key={l.id} value={l.loomNumber}>
                    {l.loomNumber} ({l.machineType})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Weaver Operator Name</label>
              <input
                type="text"
                value={form.masterWeaverName}
                onChange={(e) => setForm({ ...form, masterWeaverName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Target Production (Meters) *</label>
              <input
                type="number"
                step="10"
                value={form.targetMeters}
                onChange={(e) => setForm({ ...form, targetMeters: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Target Completion Date</label>
            <input
              type="date"
              value={form.targetCompletionDate}
              onChange={(e) => setForm({ ...form, targetCompletionDate: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Scheduling...' : 'Start Loom Production'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleJobModal;