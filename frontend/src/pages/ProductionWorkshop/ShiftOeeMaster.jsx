import React, { useEffect, useState } from 'react';
import { getShiftOeeLogs } from '../../services/shiftOeeService';
import NewShiftYieldModal from './NewShiftYieldModal';
import ShiftOeePrint from './ShiftOeePrint';
import { Gauge, PlusCircle, Printer, Zap, Activity, Clock } from 'lucide-react';
import './ShiftOeeMaster.css';

const ShiftOeeMaster = () => {
  const [shiftLogs, setShiftLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printLog, setPrintLog] = useState(null);

  const load = async () => {
    try {
      const res = await getShiftOeeLogs();
      setShiftLogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    // Live refresh — data updates in real time
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  const totalMeters = shiftLogs.reduce((sum, s) => sum + Number(s.totalMetersWoven || 0), 0);
  const totalPower = shiftLogs.reduce((sum, s) => sum + Number(s.powerUnitsKwh || 0), 0);
  const avgOee = shiftLogs.length > 0 ? (shiftLogs.reduce((sum, s) => sum + Number(s.overallOeePercentage || 0), 0) / shiftLogs.length).toFixed(1) : 0;

  return (
    <div className="oee-page">
      <div className="oee-header">
        <div>
          <span className="oee-kicker">MILL PRODUCTION YIELD & TPM ANALYTICS</span>
          <h1 className="oee-title">Loom Shift Production Yield & OEE Master</h1>
          <p className="oee-sub">Audit 8-hour shift weaving yardage, loom availability, stop metrics and overall equipment effectiveness (OEE %)</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Log Shift Yield & OEE
        </button>
      </div>

      {/* KPI Cards */}
      <div className="oee-kpi-grid">
        <div className="oee-card gold-border">
          <div className="kpi-icon"><Gauge size={24} /></div>
          <div>
            <span className="kpi-lbl">AVERAGE WEAVING OEE</span>
            <div className="kpi-val gold-val">{avgOee}%</div>
            <small>World Class Benchmark: ≥85%</small>
          </div>
        </div>

        <div className="oee-card">
          <div className="kpi-icon"><Activity size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL WOVEN YARDAGE</span>
            <div className="kpi-val">{totalMeters.toFixed(1)} m</div>
            <small>Audited Across All Shifts</small>
          </div>
        </div>

        <div className="oee-card">
          <div className="kpi-icon"><Zap size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL POWER CONSUMED</span>
            <div className="kpi-val">{totalPower.toFixed(0)} kWh</div>
            <small>Mill Energy Efficiency</small>
          </div>
        </div>
      </div>

      {/* Shift Logs Table */}
      <div className="oee-table-card">
        <table className="oee-table">
          <thead>
            <tr>
              <th>Shift Log No</th>
              <th>Shift & Date</th>
              <th>Supervisor</th>
              <th>Active Looms</th>
              <th>Meters Woven</th>
              <th>Downtime</th>
              <th>OEE %</th>
              <th>Handover Report</th>
            </tr>
          </thead>
          <tbody>
            {shiftLogs.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No shift production yields logged yet.</td></tr>
            ) : (
              shiftLogs.map((s) => (
                <tr key={s.id}>
                  <td className="gold-code">{s.shiftLogNumber}</td>
                  <td>
                    <strong>{s.shiftName?.replace(/_/g, ' ')}</strong>
                    <div className="muted-text">{s.shiftDate}</div>
                  </td>
                  <td>{s.shiftSupervisorName}</td>
                  <td>{s.totalActiveLooms} Looms</td>
                  <td className="meters-bold">{s.totalMetersWoven} m</td>
                  <td>{Number(s.warpStoppageMinutes || 0) + Number(s.weftStoppageMinutes || 0)} mins</td>
                  <td>
                    <span className={`oee-pill ${Number(s.overallOeePercentage || 0) >= 85 ? 'world-class' : 'standard'}`}>
                      {s.overallOeePercentage}% OEE
                    </span>
                  </td>
                  <td>
                    <button className="btn-print-oee" onClick={() => setPrintLog(s)}>
                      <Printer size={13} /> Shift Card
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewShiftYieldModal
          onClose={() => setShowModal(false)}
          onSuccess={(newLog) => {
            setShowModal(false);
            setPrintLog(newLog);
            load();
          }}
        />
      )}

      {printLog && (
        <ShiftOeePrint
          log={printLog}
          onClose={() => setPrintLog(null)}
        />
      )}
    </div>
  );
};

export default ShiftOeeMaster;