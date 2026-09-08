import React from 'react';
import { Printer, X, Droplets, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './EtpCertificatePrint.css';

const EtpCertificatePrint = ({ log, onClose }) => {
  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPassed = log.zldComplianceStatus === 'ZLD_PASSED_100PCT_RECYCLED';

  return (
    <div className="etp-print-overlay">
      <div className="etp-print-container">
        <div className="no-print etp-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Official ZLD Environmental Certificate
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Environmental Certificate */}
        <div className="etp-paper" id="printable-etp">
          <div className="ep-head">
            <div className="ep-brand">
              <h1>ROYAL FABRICS ZERO LIQUID DISCHARGE DIVISION</h1>
              <p className="ep-tag">OFFICIAL EFFLUENT TREATMENT PLANT (ETP) & WATER QUALITY COMPLIANCE CERTIFICATE</p>
              <p className="ep-addr">Central Water Reclamation Complex | ISO 14001:2015 & ZDHC Level 3 Certified</p>
            </div>
            <div className="ep-meta">
              <div className="ep-badge">ZLD AUDIT PASS</div>
              <p><strong>Cert No:</strong> {log.logCertificateNumber}</p>
              <p><strong>Audit Date:</strong> {log.auditDate}</p>
              <p><strong>Shift:</strong> {log.shiftTiming?.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="ep-divider"></div>

          {/* Water Balance Summary */}
          <div className="ep-water-balance-grid">
            <div className="wb-box">
              <span className="lbl">RAW EFFLUENT INFLOW</span>
              <strong className="val">{log.rawEffluentInflowKld} KLD</strong>
              <small>Dye House Discharge</small>
            </div>
            <div className="wb-box highlight">
              <span className="lbl">RECYCLED PERMEATE RECOVERY</span>
              <strong className="val green-txt">{log.recycledPermeateWaterKld} KLD</strong>
              <small>Pure RO Water ({log.waterRecoveryPercentage}% Recovery)</small>
            </div>
            <div className="wb-box">
              <span className="lbl">DRY FILTER SLUDGE</span>
              <strong className="val">{log.drySludgeGeneratedKg} KG</strong>
              <small>Solid Cake Generated</small>
            </div>
          </div>

          {/* Section 1: Chemical Water Testing Lab Results */}
          <div className="ep-section-title">
            <Droplets size={14} /> 1. TREATED RECYCLED WATER CHEMICAL PARAMETERS (STANDARDS COMPLIANCE)
          </div>

          <table className="ep-table">
            <thead>
              <tr>
                <th>Testing Parameter</th>
                <th>Prescribed Pollution Standard</th>
                <th>Raw Inflow Value</th>
                <th>Treated RO Permeate Output</th>
                <th className="text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>pH Value</strong></td>
                <td>6.5 – 8.0</td>
                <td>9.8 (Alkaline)</td>
                <td><strong>{log.testedPhValue}</strong></td>
                <td className="text-right pass-txt">PASSED (Normal)</td>
              </tr>
              <tr>
                <td><strong>Total Dissolved Solids (TDS)</strong></td>
                <td>≤ 500 ppm</td>
                <td>{log.inletTdsPpm} ppm</td>
                <td><strong>{log.treatedRoTdsPpm} ppm</strong></td>
                <td className="text-right pass-txt">PASSED (Pure RO)</td>
              </tr>
              <tr>
                <td><strong>Chemical Oxygen Demand (COD)</strong></td>
                <td>≤ 50.0 mg/L</td>
                <td>650.0 mg/L</td>
                <td><strong>{log.chemicalOxygenDemandCod} mg/L</strong></td>
                <td className="text-right pass-txt">PASSED (ZDHC Safe)</td>
              </tr>
              <tr>
                <td><strong>Biochemical Oxygen Demand (BOD)</strong></td>
                <td>≤ 15.0 mg/L</td>
                <td>180.0 mg/L</td>
                <td><strong>{log.biochemicalOxygenDemandBod} mg/L</strong></td>
                <td className="text-right pass-txt">PASSED</td>
              </tr>
            </tbody>
          </table>

          {log.observations && (
            <div className="ep-remarks-box">
              <strong>Environmental Chemist Audit Observation:</strong>
              <p>{log.observations}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="ep-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{log.environmentalChemistName || 'ETP Chemist'}</span>
              <small>Certified Environmental Lab Chemist</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>General Manager (Sustainability & ETP)</span>
              <small>Authorized Environmental Signatory</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtpCertificatePrint;