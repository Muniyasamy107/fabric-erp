import React from 'react';
import { Printer, X } from 'lucide-react';
import './MusterRollPrint.css';

const MusterRollPrint = ({ logs = [], date, onClose }) => {
  if (!logs || logs.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalDailyWages = logs.reduce((sum, l) => sum + Number(l.totalGrossEarned || 0), 0);
  const totalOtHours = logs.reduce((sum, l) => sum + Number(l.overtimeHours || 0), 0);
  const presentCount = logs.filter((l) => l.attendanceStatus !== 'ABSENT').length;

  return (
    <div className="muster-print-overlay">
      <div className="muster-print-container">
        <div className="no-print muster-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Form 25 Statutory Muster Roll
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="muster-paper" id="printable-muster">
          <div className="mp-head">
            <div className="mp-brand">
              <h1>KAK TEXTILE PROCESSING MILLS</h1>
              <p className="tag">STATUTORY MUSTER ROLL & DAILY OVERTIME WAGE REGISTER (FORM NO. 25)</p>
              <p className="addr">Factories Act 1948 Compliance | Weaving, Sizing & Processing Plant</p>
            </div>
            <div className="mp-meta">
              <div className="mp-badge">FORM 25 REGISTER</div>
              <p><strong>Muster Date:</strong> {date || new Date().toLocaleDateString('en-IN')}</p>
              <p><strong>Total Strength:</strong> {logs.length} Workers</p>
            </div>
          </div>

          <div className="mp-divider"></div>

          <div className="mp-summary-grid">
            <div>Workers Present: <strong className="green-txt">{presentCount} / {logs.length}</strong></div>
            <div>Cumulative OT Hours: <strong>{totalOtHours.toFixed(1)} Hours</strong></div>
            <div>Total Daily Payroll Disbursed: <strong className="gold-amt">₹{totalDailyWages.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
          </div>

          <table className="mp-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Worker Name</th>
                <th>Department & Machine</th>
                <th>Shift</th>
                <th>In / Out Time</th>
                <th>Status</th>
                <th>OT Hrs</th>
                <th className="text-right">Total Gross Wage (₹)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.workerBadgeNumber}</strong></td>
                  <td>{l.workerFullName}</td>
                  <td>{l.plantDepartment?.replace(/_/g, ' ')} <small>({l.assignedMachineCode || '-'})</small></td>
                  <td>{l.designatedShift?.replace(/_/g, ' ')}</td>
                  <td>{l.punchInTime} – {l.punchOutTime}</td>
                  <td>
                    <span className={`mp-status ${(l.attendanceStatus || '').toLowerCase()}`}>
                      {l.attendanceStatus}
                    </span>
                  </td>
                  <td>{l.overtimeHours > 0 ? `${l.overtimeHours} hrs` : '-'}</td>
                  <td className="text-right bold-wage">₹{Number(l.totalGrossEarned || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MusterRollPrint;