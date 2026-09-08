import React from 'react';
import { Printer, X, Grid, Activity } from 'lucide-react';
import './LoomFloorPrint.css';

const LoomFloorPrint = ({ looms = [], onClose }) => {
  if (!looms || looms.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const runningCount = looms.filter((l) => l.liveStatus === 'ACTIVE_RUNNING').length;
  const warpStopCount = looms.filter((l) => l.liveStatus === 'WARP_BREAK_STOP').length;
  const weftStopCount = looms.filter((l) => l.liveStatus === 'WEFT_FEEDER_STOP').length;
  const avgEff = (looms.reduce((sum, l) => sum + Number(l.currentShiftEfficiencyPct || 0), 0) / looms.length).toFixed(1);

  return (
    <div className="floor-print-overlay">
      <div className="floor-print-container">
        <div className="no-print floor-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Loom Hall Floor Status Sheet
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Physical Floor Audit Sheet */}
        <div className="floor-paper" id="printable-floor">
          <div className="fp-head">
            <div className="fp-brand">
              <h1>ROYAL FABRICS WEAVING DIVISION</h1>
              <p className="tag">LOOM SHED 2D TELEMETRY FLOOR STATUS & MACHINE EFFICIENCY AUDIT</p>
              <p className="addr">High-Speed Weaving Hall A & B | 24x7 Real-Time Telemetry Log</p>
            </div>
            <div className="fp-meta">
              <div className="fp-badge">FLOOR AUDIT</div>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString('en-IN')}</p>
              <p><strong>Average Hall Efficiency:</strong> <strong className="green-txt">{avgEff}%</strong></p>
            </div>
          </div>

          <div className="fp-divider"></div>

          {/* KPI Summary */}
          <div className="fp-kpi-grid">
            <div>Total Looms Installed: <strong>{looms.length} Looms</strong></div>
            <div>Active Running (550+ RPM): <strong className="green-txt">{runningCount} Looms</strong></div>
            <div>Warp Break Stops: <strong className="red-txt">{warpStopCount} Machines</strong></div>
            <div>Weft Stoppages: <strong className="amber-txt">{weftStopCount} Machines</strong></div>
          </div>

          {/* Complete 2D Matrix Table */}
          <table className="fp-table">
            <thead>
              <tr>
                <th>Loom #</th>
                <th>Type</th>
                <th>Active Lot & Fabric Quality</th>
                <th>RPM</th>
                <th>Woven Meters</th>
                <th>Weaver In-Charge</th>
                <th>Live Status</th>
                <th>Sensor Fault Notes</th>
              </tr>
            </thead>
            <tbody>
              {looms.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.loomNumber}</strong></td>
                  <td>{l.machineType?.replace(/_/g, ' ')}</td>
                  <td>
                    <strong>{l.fabricQualityName}</strong>
                    <div className="lot-sub">{l.currentLotBatchNumber}</div>
                  </td>
                  <td><strong>{l.currentRpmSpeed}</strong></td>
                  <td>{l.currentWovenMeters} m</td>
                  <td>{l.allocatedWeaverName}</td>
                  <td>
                    <span className={`fp-status ${l.liveStatus?.toLowerCase()}`}>
                      {l.liveStatus?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="fault-sub">{l.telemetrySensorAlert}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="fp-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>Loom Shed Supervisor</span>
              <small>Floor Telemetry Verification</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Weaving Plant Manager</span>
              <small>Operations Signoff</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoomFloorPrint;