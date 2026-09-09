import React from 'react';
import { Printer, X, Zap, Gauge, CheckCircle } from 'lucide-react';
import './ShiftOeePrint.css';

const ShiftOeePrint = ({ log, onClose }) => {
  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  const isWorldClass = Number(log.overallOeePercentage || 0) >= 85.0;

  return (
    <div className="oee-print-overlay">
      <div className="oee-print-container">
        <div className="no-print oee-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Shift Handover & OEE Report
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Shift Certificate */}
        <div className="oee-paper" id="printable-oee">
          <div className="oe-head">
            <div className="oe-brand">
              <h1>KAK TEXTILE PROCESSING MILLS</h1>
              <p className="tag">OFFICIAL MILL SHIFT PRODUCTION YIELD & WEAVING OEE AUDIT</p>
              <p className="addr">Loom Hall Management Wing | 24x7 Continuous Weaving Plant</p>
            </div>
            <div className="oe-meta">
              <div className="oe-badge">SHIFT REPORT</div>
              <p><strong>Log No:</strong> {log.shiftLogNumber}</p>
              <p><strong>Shift Date:</strong> {log.shiftDate}</p>
              <p><strong>Shift:</strong> {log.shiftName?.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="oe-divider"></div>

          {/* OEE Benchmark Hero Box */}
          <div className="oe-hero-grid">
            <div className="oe-score-card">
              <span className="lbl">OVERALL EQUIPMENT EFFECTIVENESS (OEE):</span>
              <div className="big-oee-val">{log.overallOeePercentage}%</div>
              <span className={`oee-benchmark-tag ${isWorldClass ? 'pass' : 'fair'}`}>
                {isWorldClass ? '★ WORLD CLASS WEAVING EFFICIENCY (≥85%)' : 'ACCEPTABLE PRODUCTION BENCHMARK'}
              </span>
            </div>

            <div className="oe-factors-grid">
              <div className="factor-box">
                <span className="f-lbl">AVAILABILITY (A)</span>
                <strong className="f-val">{log.availabilityRatePct}%</strong>
                <small>Running vs Stoppage</small>
              </div>
              <div className="factor-box">
                <span className="f-lbl">PERFORMANCE (P)</span>
                <strong className="f-val">{log.performanceRatePct}%</strong>
                <small>Loom Rated Speed</small>
              </div>
              <div className="factor-box">
                <span className="f-lbl">QUALITY (Q)</span>
                <strong className="f-val">{log.qualityRatePct}%</strong>
                <small>Zero-Defect Ratio</small>
              </div>
            </div>
          </div>

          {/* Section 1: Production Output Metrics */}
          <div className="oe-section-title">1. SHIFT PRODUCTION & WEAVING DISCHARGE</div>
          <table className="oe-table">
            <thead>
              <tr>
                <th>Active Looms</th>
                <th>Total Woven Length</th>
                <th>Total Loom Picks Counter</th>
                <th>Weaver Scrap Wastage</th>
                <th className="text-right">Shift Power Consumption</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{log.totalActiveLooms} Looms</strong></td>
                <td className="bold-m">{log.totalMetersWoven} meters</td>
                <td>{Number(log.totalPicksWoven || 0).toLocaleString('en-IN')} picks</td>
                <td>{log.totalWasteScrapMeters} m</td>
                <td className="text-right bold-kwh">{log.powerUnitsKwh} kWh</td>
              </tr>
            </tbody>
          </table>

          {/* Section 2: Stoppage & Machine Downtime Log */}
          <div className="oe-section-title" style={{ marginTop: '18px' }}>2. DOWNTIME & STOPPAGE BREAKDOWN (8-HOUR DURATION)</div>
          <div className="oe-downtime-grid">
            <div className="dt-cell">Warp Breaks: <strong>{log.warpStoppageMinutes} mins</strong></div>
            <div className="dt-cell">Weft Stoppage: <strong>{log.weftStoppageMinutes} mins</strong></div>
            <div className="dt-cell">Power Breakdown: <strong>{log.electricalDowntimeMinutes} mins</strong></div>
          </div>

          {log.shiftHandoverNotes && (
            <div className="oe-notes-box">
              <strong>Supervisor Shift Handover Observations:</strong>
              <p>{log.shiftHandoverNotes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="oe-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{log.shiftSupervisorName || 'Relieving Supervisor'}</span>
              <small>Outgoing Shift Master Sign</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Plant General Manager</span>
              <small>Production Approval Sign</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftOeePrint;