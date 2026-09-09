import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAttendanceByDate,
  getWorkers,
  getWorkersByDept,
  registerWorker,
  deleteWorker,
  saveBulkAttendance
} from '../../services/attendanceService';
import MusterRollPrint from './MusterRollPrint';
import {
  Users,
  Printer,
  Clock,
  DollarSign,
  PlusCircle,
  Trash2,
  CheckCircle2,
  ClipboardList,
  Database,
  Check,
  AlertCircle,
  X,
  Fingerprint
} from 'lucide-react';
import './MillAttendanceMaster.css';

const DEFAULT_DEMO_WORKERS = [
  { id: 101, badgeNumber: 'EMP-WEAVER-01', fullName: 'Murugesan K', plantDepartment: 'LOOM_HALL_WEAVING', baseDailyWage: 650, assignedMachineCode: 'LOOM-A01' },
  { id: 102, badgeNumber: 'EMP-WEAVER-02', fullName: 'Palanisamy M', plantDepartment: 'LOOM_HALL_WEAVING', baseDailyWage: 650, assignedMachineCode: 'LOOM-A02' },
  { id: 103, badgeNumber: 'EMP-WEAVER-03', fullName: 'Velmurugan R', plantDepartment: 'LOOM_HALL_WEAVING', baseDailyWage: 650, assignedMachineCode: 'LOOM-A03' },
  { id: 104, badgeNumber: 'EMP-WARP-01', fullName: 'Arumugam S', plantDepartment: 'WARPING_SIZING', baseDailyWage: 700, assignedMachineCode: 'WARPING-01' },
  { id: 105, badgeNumber: 'EMP-DYE-01', fullName: 'Rangasamy P', plantDepartment: 'DYE_HOUSE', baseDailyWage: 750, assignedMachineCode: 'JET-DYE-02' }
];

const MillAttendanceMaster = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('BULK_SHEET');

  const DEPT_BADGE_CODES = {
    LOOM_HALL_WEAVING: 'WEAVER',
    WARPING_SIZING: 'WARP',
    DYE_HOUSE: 'DYER',
    FINISHING_STENTER: 'FIN',
    QUALITY_INSPECT: 'QC',
    MAINTENANCE_FITTER: 'FIT',
    PACKING_BAY: 'PACK',
    OFFICE_ADMINISTRATION: 'OFF',
    PRODUCTION_OFFICE: 'PRD'
  };
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedShift, setSelectedShift] = useState('SHIFT_A_MORNING');
  const [selectedDept, setSelectedDept] = useState('LOOM_HALL_WEAVING');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (rawMessage, type = 'success') => {
    const cleanMsg = typeof rawMessage === 'string' ? rawMessage : 'Operation completed';
    setToast({ show: true, message: cleanMsg, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({
    badgeNumber: '',
    fullName: '',
    plantDepartment: 'LOOM_HALL_WEAVING',
    baseDailyWage: 650,
    assignedMachineCode: 'LOOM-A01'
  });

  const [attendanceList, setAttendanceList] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [showPrint, setShowPrint] = useState(false);

  const loadData = async () => {
    try {
      const [wRes, hRes] = await Promise.all([
        getWorkers(),
        getAttendanceByDate(selectedDate)
      ]);
      const wData = wRes.data && Array.isArray(wRes.data) && wRes.data.length > 0 ? wRes.data : DEFAULT_DEMO_WORKERS;
      setWorkers(wData);
      setHistoryLogs(Array.isArray(hRes.data) ? hRes.data : []);
    } catch (err) {
      setWorkers(DEFAULT_DEMO_WORKERS);
    }
  };

  useEffect(() => {
    loadData();
    // Live refresh
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const loadBulkSheet = async () => {
    try {
      let workersList = [];
      const res = await getWorkersByDept(selectedDept);
      workersList = res.data && Array.isArray(res.data) ? res.data : [];

      if (workersList.length === 0) {
        workersList = (workers.length > 0 ? workers : DEFAULT_DEMO_WORKERS).filter(
          (w) => w.plantDepartment === selectedDept
        );
      }

      const initialAttendance = workersList.map((w) => ({
        workerBadgeNumber: w.badgeNumber || 'EMP-01',
        workerFullName: w.fullName || 'Operator',
        plantDepartment: w.plantDepartment || selectedDept,
        designatedShift: selectedShift,
        attendanceDate: selectedDate,
        punchInTime:
          selectedShift === 'SHIFT_A_MORNING'
            ? '05:55 AM'
            : selectedShift === 'SHIFT_B_EVENING'
            ? '01:55 PM'
            : '09:55 PM',
        punchOutTime:
          selectedShift === 'SHIFT_A_MORNING'
            ? '02:05 PM'
            : selectedShift === 'SHIFT_B_EVENING'
            ? '10:05 PM'
            : '06:05 AM',
        attendanceStatus: 'PRESENT',
        overtimeHours: 0,
        regularDailyWage: w.baseDailyWage || 650,
        assignedMachineCode: w.assignedMachineCode || '-'
      }));
      setAttendanceList(initialAttendance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'BULK_SHEET') {
      loadBulkSheet();
    }
  }, [selectedDept, selectedShift, activeTab, selectedDate, workers]);

  const generateBadge = () => {
    const code = DEPT_BADGE_CODES[newWorker.plantDepartment] || 'GEN';
    let candidate;
    do {
      candidate = `EMP-${code}-${Math.floor(100 + Math.random() * 900)}`;
    } while (workers.some((w) => (w.badgeNumber || '').toUpperCase() === candidate));
    setNewWorker({ ...newWorker, badgeNumber: candidate });
  };

  const handleRegisterWorker = async (e) => {
    e.preventDefault();
    const badge = (newWorker.badgeNumber || '').trim().toUpperCase();
    if (workers.some((w) => (w.badgeNumber || '').toUpperCase() === badge)) {
      triggerToast('This badge number is already registered. Use ⚡ Auto or a different badge.', 'error');
      return;
    }
    try {
      await registerWorker({ ...newWorker, badgeNumber: badge });
      triggerToast(`Operator "${newWorker.fullName}" registered — badge ${badge} is now active at the Biometric Kiosk!`, 'success');
      setNewWorker({
        badgeNumber: '',
        fullName: '',
        plantDepartment: 'LOOM_HALL_WEAVING',
        baseDailyWage: 650,
        assignedMachineCode: 'LOOM-A01'
      });
      loadData();
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to register employee', 'error');
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Delete worker from directory?')) return;
    try {
      await deleteWorker(id);
      triggerToast('Worker removed from active directory.', 'info');
      loadData();
    } catch (err) {
      triggerToast('Failed to delete worker record.', 'error');
    }
  };

  const handleBulkAttendanceChange = (index, field, value) => {
    const updated = [...attendanceList];
    updated[index][field] = value;
    setAttendanceList(updated);
  };

  const handleSaveBulkAttendance = async () => {
    if (attendanceList.length === 0) {
      triggerToast('No active operators loaded for this department.', 'error');
      return;
    }
    try {
      await saveBulkAttendance(attendanceList);
      triggerToast(`Bulk Shift Attendance saved successfully (${attendanceList.length} Operators)!`, 'success');
      loadData();
      setActiveTab('HISTORY');
    } catch (err) {
      const msg = typeof err.response?.data === 'string' && err.response.data
        ? err.response.data
        : err.response?.data?.message || 'Failed to save bulk attendance.';
      triggerToast(msg, 'error');
    }
  };

  const safeLogs = Array.isArray(historyLogs) ? historyLogs : [];
  const totalPayroll = safeLogs.reduce((sum, l) => sum + Number(l.totalGrossEarned || 0), 0);
  const presentCount = safeLogs.filter((l) => l.attendanceStatus !== 'ABSENT').length;
  const otHoursTotal = safeLogs.reduce((sum, l) => sum + Number(l.overtimeHours || 0), 0);

  return (
    <div className="att-page">
      {toast.show && (
        <div className={`factory-toast-banner toast-${toast.type}`}>
          {toast.type === 'success' && <Check size={18} className="toast-icon" />}
          {toast.type === 'error' && <AlertCircle size={18} className="toast-icon" />}
          {toast.type === 'info' && <CheckCircle2 size={18} className="toast-icon" />}
          <span className="toast-text">{String(toast.message)}</span>
          <button type="button" className="toast-close-btn" onClick={() => setToast({ show: false, message: '', type: 'success' })}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="att-header">
        <div>
          <span className="att-kicker">MILL TIME OFFICE & BIOMETRIC WORKFORCE</span>
          <h1 className="att-title">Worker Muster Roll & Bulk Attendance</h1>
          <p className="att-sub">Manage factory workforce, log bulk shift attendance, and generate statutory Form 25 registers</p>
        </div>
        <button type="button" className="att-kiosk-btn" onClick={() => navigate('/biometric')}>
          <Fingerprint size={16} /> Open Biometric Punch Kiosk
        </button>
      </div>

      <div className="att-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'BULK_SHEET' ? 'active' : ''}`}
          onClick={() => setActiveTab('BULK_SHEET')}
        >
          <ClipboardList size={16} /> Bulk Attendance Sheet
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'DIRECTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('DIRECTORY')}
        >
          <Database size={16} /> Master Worker Directory ({workers.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'HISTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('HISTORY')}
        >
          <Users size={16} /> Daily Muster Logs ({safeLogs.length})
        </button>
      </div>

      {activeTab === 'BULK_SHEET' && (
        <div className="bulk-sheet-container">
          <div className="sheet-filters-card">
            <div className="filter-row">
              <div className="grp">
                <label>Attendance Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="grp">
                <label>Select Shift Period:</label>
                <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
                  <option value="SHIFT_A_MORNING">Shift A (06:00 AM - 02:00 PM)</option>
                  <option value="SHIFT_B_EVENING">Shift B (02:00 PM - 10:00 PM)</option>
                  <option value="SHIFT_C_NIGHT">Shift C (10:00 PM - 06:00 AM)</option>
                </select>
              </div>
              <div className="grp">
                <label>Mill Department Floor:</label>
                <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                  <option value="LOOM_HALL_WEAVING">Loom Hall Weaving Section</option>
                  <option value="WARPING_SIZING">Warping & Sizing Creel</option>
                  <option value="DYE_HOUSE">Dye House & Color Kitchen</option>
                  <option value="FINISHING_STENTER">Stenter & Calendering Division</option>
                  <option value="QUALITY_INSPECT">Inspection & 4-Point Lab</option>
                  <option value="MAINTENANCE_FITTER">Maintenance & Fitter Bay</option>
                  <option value="PACKING_BAY">Packing & Dispatch Bay</option>
                  <option value="OFFICE_ADMINISTRATION">Office Administration</option>
                  <option value="PRODUCTION_OFFICE">Production Office</option>
                </select>
              </div>
            </div>
          </div>

          <div className="att-table-card">
            <div className="table-header-row">
              <h3>Bulk Attendance Entry Grid</h3>
              <button type="button" className="gold-btn" onClick={handleSaveBulkAttendance}>
                <CheckCircle2 size={16} /> Submit Bulk Attendance (1-Click)
              </button>
            </div>

            <table className="att-table">
              <thead>
                <tr>
                  <th>Badge ID</th>
                  <th>Operator Name</th>
                  <th>Machine Code</th>
                  <th>In-Time</th>
                  <th>Out-Time</th>
                  <th>Status</th>
                  <th>Overtime (OT Hrs)</th>
                  <th>Base Wage (₹)</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-text">
                      No active operators loaded for this department. Go to "Master Worker Directory" tab to register operators.
                    </td>
                  </tr>
                ) : (
                  attendanceList.map((row, idx) => (
                    <tr key={idx}>
                      <td className="gold-code">{row.workerBadgeNumber}</td>
                      <td><strong>{row.workerFullName}</strong></td>
                      <td>{row.assignedMachineCode}</td>
                      <td>
                        <input
                          type="text"
                          value={row.punchInTime}
                          onChange={(e) => handleBulkAttendanceChange(idx, 'punchInTime', e.target.value)}
                          className="table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.punchOutTime}
                          onChange={(e) => handleBulkAttendanceChange(idx, 'punchOutTime', e.target.value)}
                          className="table-input"
                        />
                      </td>
                      <td>
                        <select
                          value={row.attendanceStatus}
                          onChange={(e) => handleBulkAttendanceChange(idx, 'attendanceStatus', e.target.value)}
                          className="table-select"
                        >
                          <option value="PRESENT">Present (Full Shift)</option>
                          <option value="OVERTIME_DOUBLE_SHIFT">Overtime Double Shift</option>
                          <option value="HALF_DAY">Half Day</option>
                          <option value="ABSENT">Absent</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={row.overtimeHours}
                          onChange={(e) => handleBulkAttendanceChange(idx, 'overtimeHours', e.target.value)}
                          className="table-input-number"
                        />
                      </td>
                      <td><strong>₹{row.regularDailyWage}</strong></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'DIRECTORY' && (
        <div className="directory-layout">
          <form className="dir-form-card" onSubmit={handleRegisterWorker}>
            <h3>Register Factory Operator</h3>
            <label>Full Employee Name</label>
            <input
              value={newWorker.fullName}
              onChange={(e) => setNewWorker({ ...newWorker, fullName: e.target.value })}
              required
              placeholder="e.g. Ramesh Kumar"
            />

            <label>Employee Badge Number</label>
            <div className="badge-input-row">
              <input
                value={newWorker.badgeNumber}
                onChange={(e) => setNewWorker({ ...newWorker, badgeNumber: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. EMP-WEAVER-102"
              />
              <button type="button" className="badge-gen-btn" onClick={generateBadge} title="Generate a badge ID from the selected department">
                ⚡ Auto
              </button>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Assigned Machine Code</label>
                <input
                  value={newWorker.assignedMachineCode}
                  onChange={(e) => setNewWorker({ ...newWorker, assignedMachineCode: e.target.value })}
                  placeholder="e.g. LOOM-A01"
                />
              </div>
              <div className="form-group flex-1">
                <label>Daily Base Wage Rate (₹)</label>
                <input
                  type="number"
                  value={newWorker.baseDailyWage}
                  onChange={(e) => setNewWorker({ ...newWorker, baseDailyWage: e.target.value })}
                  required
                />
              </div>
            </div>

            <label>Plant Department</label>
            <select
              value={newWorker.plantDepartment}
              onChange={(e) => setNewWorker({ ...newWorker, plantDepartment: e.target.value })}
            >
              <option value="LOOM_HALL_WEAVING">Loom Hall Weaving Section</option>
              <option value="WARPING_SIZING">Warping & Sizing Creel</option>
              <option value="DYE_HOUSE">Dye House & Color Kitchen</option>
              <option value="FINISHING_STENTER">Stenter & Calendering Division</option>
              <option value="QUALITY_INSPECT">Inspection & 4-Point Lab</option>
              <option value="MAINTENANCE_FITTER">Maintenance & Fitter Bay</option>
              <option value="PACKING_BAY">Packing & Dispatch Bay</option>
              <option value="OFFICE_ADMINISTRATION">Office Administration</option>
              <option value="PRODUCTION_OFFICE">Production Office</option>
            </select>

            <button type="submit">+ Register Employee</button>
          </form>

          <div className="dir-table-card">
            <h3>Registered Factory Operators ({workers.length} Employees)</h3>
            <table className="dir-table">
              <thead>
                <tr>
                  <th>Badge No</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Machine</th>
                  <th>Base Wage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id}>
                    <td className="gold-code">{w.badgeNumber}</td>
                    <td><strong>{w.fullName}</strong></td>
                    <td>{w.plantDepartment ? w.plantDepartment.replace(/_/g, ' ') : 'General'}</td>
                    <td><span className="m-tag">{w.assignedMachineCode || '-'}</span></td>
                    <td>₹{w.baseDailyWage}/day</td>
                    <td>
                      <button
                        type="button"
                        className="btn-delete-worker"
                        onClick={() => handleDeleteWorker(w.id)}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="history-tab-layout">
          <div className="att-kpi-grid">
            <div className="att-card green-border">
              <div className="kpi-icon"><Users size={24} /></div>
              <div>
                <span className="kpi-lbl">TOTAL OPERATORS PRESENT</span>
                <div className="kpi-val green-val">{presentCount} / {safeLogs.length || 0}</div>
                <small>Biometrically Verified</small>
              </div>
            </div>

            <div className="att-card">
              <div className="kpi-icon"><Clock size={24} /></div>
              <div>
                <span className="kpi-lbl">OVERTIME (OT) HOURS FOR DATE</span>
                <div className="kpi-val">{otHoursTotal.toFixed(1)} Hours</div>
                <small>Compensated at 2x rate</small>
              </div>
            </div>

            <div className="att-card">
              <div className="kpi-icon"><DollarSign size={24} /></div>
              <div>
                <span className="kpi-lbl">DAILY LABOUR PAYROLL DISBURSED</span>
                <div className="kpi-val gold-val">
                  ₹{totalPayroll.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <small>Wages + OT Compensation</small>
              </div>
            </div>
          </div>

          <div className="att-toolbar">
            <label>Muster Audit Date Selector:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              type="button"
              className="btn-print-muster"
              onClick={() => setShowPrint(true)}
            >
              <Printer size={14} /> Print Form 25 Muster Roll
            </button>
          </div>

          <div className="att-table-card">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Badge ID</th>
                  <th>Worker Name</th>
                  <th>Department & Machine</th>
                  <th>Shift</th>
                  <th>Punch In / Out</th>
                  <th>OT Hours</th>
                  <th>Status</th>
                  <th className="text-right">Total Gross Wage</th>
                </tr>
              </thead>
              <tbody>
                {safeLogs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-text">No attendance records punched for this date.</td>
                  </tr>
                ) : (
                  safeLogs.map((l) => (
                    <tr key={l.id}>
                      <td className="gold-code">{l.workerBadgeNumber}</td>
                      <td><strong>{l.workerFullName}</strong></td>
                      <td>
                        <div>{l.plantDepartment ? l.plantDepartment.replace(/_/g, ' ') : 'Plant Floor'}</div>
                        <small className="muted-text">{l.assignedMachineCode}</small>
                      </td>
                      <td>{l.designatedShift ? l.designatedShift.replace(/_/g, ' ') : 'Shift A'}</td>
                      <td>{l.punchInTime} – {l.punchOutTime}</td>
                      <td>{l.overtimeHours > 0 ? `${l.overtimeHours} hrs` : '-'}</td>
                      <td>
                        <span className={`status-pill ${(l.attendanceStatus || '').toLowerCase()}`}>
                          {l.attendanceStatus}
                        </span>
                      </td>
                      <td className="text-right bold-amt">₹{Number(l.totalGrossEarned || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPrint && (
        <MusterRollPrint
          logs={safeLogs}
          date={selectedDate}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
};

export default MillAttendanceMaster;