import React from 'react';
import { Printer, X, Flame, Gauge, ShieldCheck } from 'lucide-react';
import './BoilerLogPrint.css';

const BoilerLogPrint = ({ log, onClose }) => {
  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="boiler-print-overlay">
      <div className="boiler-print-container">
        <div className="no-print boiler-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Boiler & Thermal Energy Log
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Official Boiler Generation Certificate Sheet */}
        <div className="boiler-paper" id="printable-boiler">
          <div className="bp-head">
            <div className="bp-brand">
              <h1>ROYAL FABRICS THERMAL POWER & BOILER DIVISION</h1>
              <p className="bp-tag">OFFICIAL INDUSTRIAL STEAM GENERATION & BIOMASS ENERGY AUDIT REPORT</p>
              <p className="bp-addr">High-Pressure Steam Generation Plant | Unit: {log.boilerUnitCode}</p>
            </div>
            <div className="bp-meta">
              <div className="bp-badge">THERMAL AUDIT</div>
              <p><strong>Log No:</strong> {log.steamLogNumber}</p>
              <p><strong>Date:</strong> {log.logDate}</p>
              <p><strong>Shift:</strong> {log.shiftTiming?.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="bp-divider"></div>

          {/* Steam & Fuel Core Summary */}
          <div className="bp-summary-grid">
            <div className="bp-box highlight">
              <span className="lbl">TOTAL STEAM GENERATED</span>
              <strong className="val gold-val">{log.totalSteamGeneratedTons} TONS</strong>
              <small>Pressure: {log.averageSteamPressureBar} Bar ({log.averageSteamTempCelsius}°C)</small>
            </div>
            <div className="bp-box">
              <span className="lbl">BIOMASS FUEL CONSUMED</span>
              <strong className="val">{log.fuelConsumedTons} TONS</strong>
              <small>Type: {log.fuelTypeUsed?.replace(/_/g, ' ')}</small>
            </div>
            <div className="bp-box">
              <span className="lbl">SPECIFIC EVAPORATION RATIO</span>
              <strong className="val green-txt">{log.evaporationRatio} kg/kg</strong>
              <small>Steam per KG Fuel Efficiency</small>
            </div>
          </div>

          {/* Departmental Steam Allocation Breakdown Table */}
          <div className="bp-section-title">
            <Flame size={14} /> 1. DEPARTMENTAL STEAM FLOW METERING DISTRIBUTION
          </div>

          <table className="bp-table">
            <thead>
              <tr>
                <th>Plant Department</th>
                <th>Consumer Equipment</th>
                <th>Allocated Steam (Tons)</th>
                <th className="text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dye House Wet Processing</strong></td>
                <td>High Temperature Jet Dyeing Vessels</td>
                <td><strong>{log.dyeHouseSteamTons} Tons</strong></td>
                <td className="text-right">65.0%</td>
              </tr>
              <tr>
                <td><strong>Stenter Finishing Division</strong></td>
                <td>8-Chamber Heat Setting & Calendering</td>
                <td><strong>{log.stenterFinishingSteamTons} Tons</strong></td>
                <td className="text-right">20.2%</td>
              </tr>
              <tr>
                <td><strong>Warping & Sizing Section</strong></td>
                <td>Sizing Cylinder Pre-Drying Boxes</td>
                <td><strong>{log.sizingYarnSteamTons} Tons</strong></td>
                <td className="text-right">14.8%</td>
              </tr>
            </tbody>
          </table>

          {/* Water Softener & Chemistry Control */}
          <div className="bp-section-title" style={{ marginTop: '18px' }}>
            <Gauge size={14} /> 2. BOILER FEED WATER & SAFETY CONTROL CHEMISTRY
          </div>

          <div className="bp-chem-grid">
            <div className="ch-cell">Feed Water Hardness: <strong>{log.feedWaterHardnessPpm} ppm (Softened)</strong></div>
            <div className="ch-cell">Boiler Water Alkalinity: <strong>{log.boilerWaterPh} pH</strong></div>
            <div className="ch-cell">Blowdown Solids: <strong>{log.blowdownTdsPpm} ppm TDS</strong></div>
          </div>

          {log.logRemarks && (
            <div className="bp-remarks-box">
              <strong>Boiler Attendant Engineer Technical Observations:</strong>
              <p>{log.logRemarks}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="bp-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{log.boilerAttendantEngineer || 'Boiler Engineer'}</span>
              <small>Certified 1st Class Boiler Attendant</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Chief Thermal Power Engineer</span>
              <small>Plant Engineering Approval</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoilerLogPrint;