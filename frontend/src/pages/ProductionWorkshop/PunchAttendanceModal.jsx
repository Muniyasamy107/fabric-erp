import React, { useState } from 'react';
import { punchWorkerAttendance } from '../../services/attendanceService';
import './PunchAttendanceModal.css';

const PunchAttendanceModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    workerBadgeNumber: 'EMP-WEAVER-042',
    workerFullName: 'Murugesan K',
    plantDepartment: 'LOOM_HALL_WEAVING',
    designatedShift: 'SHIFT_A_MORNING',
    attendanceDate: new Date().toISOString().slice(0, 10),
    punchInTime: '05:52 AM',
    punchOutTime: '02:08 PM',
    attendanceStatus: 'PRESENT',
    overtimeHours: 0.0,
    regularDailyWage: 650.0,
    assignedMachineCode: 'LOOM-A01 to A06',
    supervisorNotes: 'Punctual in-shift. Zero loom stoppage under his bay.'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await punchWorkerAttendance({
        ...form,
        overtimeHours: Number(form.overtimeHours),
        regularDailyWage: Number(form.regularDailyWage)
      });
      alert(`Attendance & Wages Recorded Successfully!\nGross Earned: ₹${res.data.totalGrossEarned}`);
      onSuccess(res.data);
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : 'Failed to record attendance';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="punch-modal-overlay">
      <div className="punch-modal-content">
        <h2>Punch Shift Worker Attendance & OT</h2>
        <p className="modal-sub">Record biometric shift in-time, department bay allocation, and overtime calculation</p>

        <form onSubmit={handleSubmit}>
          <div className="punch-form-row">
            <div className="form-group flex-1">
              <label>Worker Badge / Employee ID</label>
              <input
                value={form.workerBadgeNumber}
                onChange={(e) => setForm({ ...form, workerBadgeNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Worker Full Name</label>
              <input
                value={form.workerFullName}
                onChange={(e) => setForm({ ...form, workerFullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="punch-form-row">
            <div className="form-group flex-1">
              <label>Mill Department</label>
              <select value={form.plantDepartment} onChange={(e) => setForm({ ...form, plantDepartment: e.target.value })}>
                <option value="LOOM_HALL_WEAVING">Loom Hall Weaving Section</option>
                <option value="WARPING_SIZING">Warping & Sizing Creel</option>
                <option value="DYE_HOUSE">Dye House & Color Kitchen</option>
                <option value="FINISHING_STENTER">Stenter & Calendering Division</option>
                <option value="QUALITY_INSPECT">Inspection & 4-Point Lab</option>
                <option value="MAINTENANCE_FITTER">Plant Maintenance & Fitter Desk</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Shift Timing</label>
              <select value={form.designatedShift} onChange={(e) => setForm({ ...form, designatedShift: e.target.value })}>
                <option value="SHIFT_A_MORNING">Shift A (06:00 - 14:00)</option>
                <option value="SHIFT_B_EVENING">Shift B (14:00 - 22:00)</option>
                <option value="SHIFT_C_NIGHT">Shift C (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div className="punch-form-grid-3">
            <div className="form-group">
              <label>Punch In Time</label>
              <input
                type="text"
                value={form.punchInTime}
                onChange={(e) => setForm({ ...form, punchInTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Punch Out Time</label>
              <input
                type="text"
                value={form.punchOutTime}
                onChange={(e) => setForm({ ...form, punchOutTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Attendance Status</label>
              <select value={form.attendanceStatus} onChange={(e) => setForm({ ...form, attendanceStatus: e.target.value })}>
                <option value="PRESENT">Present (Full 8h Shift)</option>
                <option value="OVERTIME_DOUBLE_SHIFT">Overtime Double Shift</option>
                <option value="LATE_ENTRY">Late Entry</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>

          <div className="punch-wages-card">
            <h4>Daily Base Rate & Overtime (OT) Hours</h4>
            <div className="punch-form-row">
              <div className="form-group flex-1">
                <label>Daily Base Wage (₹)</label>
                <input
                  type="number"
                  value={form.regularDailyWage}
                  onChange={(e) => setForm({ ...form, regularDailyWage: e.target.value })}
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label>Overtime (OT Hours @ 2x Rate)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.overtimeHours}
                  onChange={(e) => setForm({ ...form, overtimeHours: e.target.value })}
                  placeholder="e.g. 4.0"
                  required
                />
              </div>
            </div>
          </div>

          {error && <div className="punch-duplicate-error">⛔ {error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Recording...' : 'Punch & Compute Daily Wages'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PunchAttendanceModal;