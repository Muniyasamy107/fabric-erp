import React, { useState } from 'react';
import { logBreakdownTicket } from '../../services/maintenanceService';
import './NewBreakdownModal.css';

const NewBreakdownModal = ({ looms = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    machineCode: looms[0]?.loomNumber || 'LOOM-A01',
    machineType: 'RAPIER_LOOM',
    maintenanceType: 'BREAKDOWN_REPAIR',
    priority: 'CRITICAL_STOP',
    issueDescription: 'Warp yarn tension sensor failure / Rapier wheel jam',
    technicianName: 'Chief Fitter Murugan',
    partsReplacedSummary: 'Requires 1x Rapier Guide + Sensor Cable'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await logBreakdownTicket(form);
      alert(`Breakdown Ticket Logged!\nTicket: ${res.data.ticketNumber}\nMachine set to MAINTENANCE.`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to log maintenance ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maint-modal-overlay">
      <div className="maint-modal-content">
        <h2>Log Machine Breakdown / PM Ticket</h2>
        <p className="modal-sub">Report loom stoppage, schedule mechanical greasing or order spare replacement</p>

        <form onSubmit={handleSubmit}>
          <div className="maint-form-row">
            <div className="form-group flex-1">
              <label>Select Affected Machine Code</label>
              <select
                value={form.machineCode}
                onChange={(e) => setForm({ ...form, machineCode: e.target.value })}
                required
              >
                {looms.map((l) => (
                  <option key={l.id} value={l.loomNumber}>{l.loomNumber} ({l.machineType})</option>
                ))}
                <option value="STENTER_LINE_01">Stenter Finishing Line 01</option>
                <option value="ROTARY_CALENDER_02">Rotary Calender Line 02</option>
                <option value="WARPING_CREEL_01">High-Speed Warping Creel 01</option>
                <option value="SIZING_BOX_01">Sizing Chemical Machine Box</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Maintenance Classification</label>
              <select value={form.maintenanceType} onChange={(e) => setForm({ ...form, maintenanceType: e.target.value })}>
                <option value="BREAKDOWN_REPAIR">Breakdown Emergency Stoppage</option>
                <option value="PREVENTIVE_PM">Preventive Routine PM (Oiling/Greasing)</option>
                <option value="OVERHAUL">Quarterly Machine Overhaul</option>
              </select>
            </div>
          </div>

          <div className="maint-form-row">
            <div className="form-group flex-1">
              <label>Severity & Priority Level</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="CRITICAL_STOP">Critical (Loom Production Stopped)</option>
                <option value="MEDIUM">Medium (Running with minor vibration)</option>
                <option value="LOW">Low (Scheduled maintenance window)</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Assigned Fitter / Electrical Technician</label>
              <input
                type="text"
                value={form.technicianName}
                onChange={(e) => setForm({ ...form, technicianName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Observed Machine Defect / Breakdown Symptom</label>
            <textarea
              rows="3"
              value={form.issueDescription}
              onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Estimated Spare Parts Required for Repair</label>
            <input
              type="text"
              value={form.partsReplacedSummary}
              onChange={(e) => setForm({ ...form, partsReplacedSummary: e.target.value })}
              placeholder="e.g. 1x Rapier Guide + 1x Carbon Tape"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-danger-save" disabled={loading}>
              {loading ? 'Logging...' : 'Issue Breakdown Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBreakdownModal;