import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import './ScheduleJobModal.css';

const DEFAULT_FACTORY_LOOMS = [
  { id: 1, loomNumber: 'LOOM-A01', machineType: 'Rapier High Speed' },
  { id: 2, loomNumber: 'LOOM-A02', machineType: 'Rapier High Speed' },
  { id: 3, loomNumber: 'LOOM-A03', machineType: 'Air Jet 550' },
  { id: 4, loomNumber: 'LOOM-A04', machineType: 'Rapier High Speed' },
  { id: 5, loomNumber: 'LOOM-A05', machineType: 'Rapier High Speed' },
  { id: 6, loomNumber: 'LOOM-A06', machineType: 'Air Jet 550' },
  { id: 7, loomNumber: 'LOOM-A07', machineType: 'Electronic Jacquard' },
  { id: 8, loomNumber: 'LOOM-A08', machineType: 'Electronic Jacquard' },
  { id: 9, loomNumber: 'LOOM-A09', machineType: 'Rapier High Speed' },
  { id: 10, loomNumber: 'LOOM-A10', machineType: 'Rapier High Speed' },
  { id: 11, loomNumber: 'LOOM-A11', machineType: 'Air Jet 550' },
  { id: 12, loomNumber: 'LOOM-A12', machineType: 'Rapier High Speed' },
  { id: 13, loomNumber: 'LOOM-A13', machineType: 'Rapier High Speed' },
  { id: 14, loomNumber: 'LOOM-A14', machineType: 'Air Jet 550' },
  { id: 15, loomNumber: 'LOOM-A15', machineType: 'Electronic Jacquard' },
  { id: 16, loomNumber: 'LOOM-A16', machineType: 'Rapier High Speed' }
];

const ScheduleJobModal = ({ fabrics = [], looms = [], onClose, onSuccess }) => {
  const loomList = looms && looms.length > 0 ? looms : DEFAULT_FACTORY_LOOMS;

  const [form, setForm] = useState({
    fabricProductId: fabrics[0]?.id || '',
    fabricProductName: fabrics[0]?.fabricName || fabrics[0]?.name || '',
    assignedLoomNumber: loomList[0]?.loomNumber || 'LOOM-A01',
    masterWeaverName: 'Weaver Palani',
    targetMeters: 500.0,
    startDate: new Date().toISOString().slice(0, 10),
    targetCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fabrics.length > 0 && !form.fabricProductId) {
      setForm((prev) => ({
        ...prev,
        fabricProductId: fabrics[0].id,
        fabricProductName: fabrics[0].fabricName || fabrics[0].name
      }));
    }
  }, [fabrics]);

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
    if (!form.fabricProductId) {
      alert('Please select a fabric quality to weave!');
      return;
    }
    setLoading(true);
    try {
      await API.post('/production/jobs', {
        ...form,
        fabricProductId: Number(form.fabricProductId),
        targetMeters: Number(form.targetMeters)
      });
      alert(`Production Batch successfully scheduled on ${form.assignedLoomNumber}!`);
      onSuccess();
    } catch (err) {
      alert(err.response?.data || 'Failed to schedule production job');
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
                {loomList.map((l) => (
                  <option key={l.id || l.loomNumber} value={l.loomNumber}>
                    {l.loomNumber} — ({l.machineType})
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