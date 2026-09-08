import React, { useState } from 'react';
import { logShiftProduction } from '../../services/shiftOeeService';
import './NewShiftYieldModal.css';

const NewShiftYieldModal = ({ loomsCount = 24, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    shiftDate: new Date().toISOString().slice(0, 10),
    shiftName: 'SHIFT_A_MORNING',
    shiftSupervisorName: 'Shift Master Ganesan',
    totalActiveLooms: loomsCount,
    totalPicksWoven: 1450000,
    totalMetersWoven: 1250.0,
    totalWasteScrapMeters: 14.5,
    warpStoppageMinutes: 22.0,
    weftStoppageMinutes: 12.0,
    electricalDowntimeMinutes: 0.0,
    powerUnitsKwh: 480.0,
    shiftHandoverNotes: 'All 24 looms ran steady. Loom A04 warp knot gaiting done at 11:30 AM.'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await logShiftProduction({
        ...form,
        totalActiveLooms: Number(form.totalActiveLooms),
        totalPicksWoven: Number(form.totalPicksWoven),
        totalMetersWoven: Number(form.totalMetersWoven),
        totalWasteScrapMeters: Number(form.totalWasteScrapMeters),
        warpStoppageMinutes: Number(form.warpStoppageMinutes),
        weftStoppageMinutes: Number(form.weftStoppageMinutes),
        electricalDowntimeMinutes: Number(form.electricalDowntimeMinutes),
        powerUnitsKwh: Number(form.powerUnitsKwh)
      });
      alert(`Shift Yield & OEE Recorded Successfully!\nCalculated OEE: ${res.data.overallOeePercentage}%`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to log shift yield');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yield-modal-overlay">
      <div className="yield-modal-content">
        <h2>Log Weaving Shift Production & OEE Yield</h2>
        <p className="modal-sub">Record 8-hour shift yardage, picks, stoppage minutes, and power consumption</p>

        <form onSubmit={handleSubmit}>
          <div className="yield-form-row">
            <div className="form-group flex-1">
              <label>Shift Date</label>
              <input
                type="date"
                value={form.shiftDate}
                onChange={(e) => setForm({ ...form, shiftDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Shift Period</label>
              <select value={form.shiftName} onChange={(e) => setForm({ ...form, shiftName: e.target.value })}>
                <option value="SHIFT_A_MORNING">Shift A (06:00 AM - 02:00 PM)</option>
                <option value="SHIFT_B_EVENING">Shift B (02:00 PM - 10:00 PM)</option>
                <option value="SHIFT_C_NIGHT">Shift C (10:00 PM - 06:00 AM)</option>
              </select>
            </div>
          </div>

          <div className="yield-form-row">
            <div className="form-group flex-1">
              <label>Shift Supervisor In-Charge</label>
              <input
                type="text"
                value={form.shiftSupervisorName}
                onChange={(e) => setForm({ ...form, shiftSupervisorName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Total Active Operating Looms</label>
              <input
                type="number"
                value={form.totalActiveLooms}
                onChange={(e) => setForm({ ...form, totalActiveLooms: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="yield-section-card">
            <h4>1. Shift Production Yardage & Pick Counter</h4>
            <div className="yield-form-grid-3">
              <div className="form-group">
                <label>Total Meters Woven (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.totalMetersWoven}
                  onChange={(e) => setForm({ ...form, totalMetersWoven: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Loom Picks Counter</label>
                <input
                  type="number"
                  value={form.totalPicksWoven}
                  onChange={(e) => setForm({ ...form, totalPicksWoven: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Scrap / Fly Wastage (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.totalWasteScrapMeters}
                  onChange={(e) => setForm({ ...form, totalWasteScrapMeters: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="yield-section-card">
            <h4>2. Downtime & Stoppage Minutes (out of 480 mins)</h4>
            <div className="yield-form-grid-4">
              <div className="form-group">
                <label>Warp Breaks (mins)</label>
                <input
                  type="number"
                  step="1"
                  value={form.warpStoppageMinutes}
                  onChange={(e) => setForm({ ...form, warpStoppageMinutes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Weft Stoppage (mins)</label>
                <input
                  type="number"
                  step="1"
                  value={form.weftStoppageMinutes}
                  onChange={(e) => setForm({ ...form, weftStoppageMinutes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Power Breakdown</label>
                <input
                  type="number"
                  step="1"
                  value={form.electricalDowntimeMinutes}
                  onChange={(e) => setForm({ ...form, electricalDowntimeMinutes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Power (kWh units)</label>
                <input
                  type="number"
                  step="1"
                  value={form.powerUnitsKwh}
                  onChange={(e) => setForm({ ...form, powerUnitsKwh: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Supervisor Handover Observations & Loom Maintenance Notes</label>
            <textarea
              rows="2"
              value={form.shiftHandoverNotes}
              onChange={(e) => setForm({ ...form, shiftHandoverNotes: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Evaluating...' : 'Close Shift & Compute OEE %'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewShiftYieldModal;