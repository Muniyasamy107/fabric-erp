import React from 'react';
import { Printer, X, Disc, Sliders } from 'lucide-react';
import './BeamTicketPrint.css';

const BeamTicketPrint = ({ beam, onClose }) => {
  if (!beam) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="beam-print-overlay">
      <div className="beam-print-container">
        <div className="no-print beam-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Weaver's Beam Card
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Physical Flange Tag */}
        <div className="beam-paper" id="printable-beam">
          <div className="bm-head">
            <div className="bm-brand">
              <h1>KAK TEXTILE PROCESSING WEAVING DIVISION</h1>
              <p className="bm-tag">WARPING, SIZING & WEAVER'S BEAM IDENTIFICATION TICKET</p>
              <p className="bm-addr">Loom Beam Preparation Section | High-Speed Creel Floor</p>
            </div>
            <div className="bm-meta">
              <div className="bm-badge">WEAVER'S BEAM</div>
              <p><strong>Beam No:</strong> {beam.beamNumber}</p>
              <p><strong>Date:</strong> {beam.beamWarpingDate}</p>
              <p><strong>Target Loom:</strong> <strong className="gold-txt">{beam.assignedLoomNumber || 'Loom Bank'}</strong></p>
            </div>
          </div>

          <div className="bm-divider"></div>

          {/* Core Beam Physical Metrics */}
          <div className="bm-spec-grid">
            <div className="spec-cell">
              <span className="lbl">FABRIC QUALITY:</span>
              <h3>{beam.fabricProductName}</h3>
              <p>Quality SKU: <strong>{beam.qualityCode}</strong></p>
            </div>
            <div className="spec-cell">
              <span className="lbl">WARP YARN SUPPLY:</span>
              <h3>{beam.yarnCountSpecification}</h3>
              <p>Yarn Lot: <strong>{beam.yarnLotNumber}</strong></p>
            </div>
          </div>

          {/* Warp Counts & Length Matrix */}
          <div className="bm-metrics-row">
            <div className="m-box">
              <span className="m-lbl">TOTAL WARP ENDS</span>
              <strong className="m-val">{beam.totalWarpEnds} ENDS</strong>
            </div>
            <div className="m-box">
              <span className="m-lbl">WOUND BEAM LENGTH</span>
              <strong className="m-val gold-m">{beam.beamLengthMeters} METERS</strong>
            </div>
            <div className="m-box">
              <span className="m-lbl">FLANGE REED WIDTH</span>
              <strong className="m-val">{beam.flangeWidthInches}" INCHES</strong>
            </div>
          </div>

          {/* Sizing Parameters */}
          <div className="bm-section-title">
            <Sliders size={14} /> SIZING RECIPE & PROCESS CONTROLS APPLIED
          </div>

          <div className="bm-sizing-table">
            <div className="sz-row">
              <span>Sizing Chemical Formulation:</span>
              <strong>{beam.sizingChemicalMix}</strong>
            </div>
            <div className="sz-grid-3">
              <div>Size Pick-up: <strong>{beam.sizePickUpPercentage}%</strong></div>
              <div>Moisture Content: <strong>{beam.moisturePercentage}%</strong></div>
              <div>Drying Temp: <strong>{beam.dryingCylinderTempCelsius}°C</strong></div>
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="bm-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{beam.supervisorName || 'Warping Master'}</span>
              <small>Warping & Sizing Master</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Gaiting / Loom Technician</span>
              <small>Loom Mounting Sign</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeamTicketPrint;