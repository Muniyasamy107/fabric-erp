import React from 'react';
import { Printer, X, Award, ShieldCheck } from 'lucide-react';
import './LabCertificatePrint.css';

const LabCertificatePrint = ({ report, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const isGradeA = report.finalVerdict === 'GRADE_A_PASS';

  return (
    <div className="cert-overlay">
      <div className="cert-container">
        {/* Actions bar */}
        <div className="no-print cert-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Mill Quality Certificate
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Physical Mill Test Certificate */}
        <div className="cert-paper" id="printable-cert">
          <div className="cert-head">
            <div className="cert-brand">
              <h1>KAK TEXTILE PROCESSING MILLS</h1>
              <p className="cert-tagline">CENTRAL TEXTILE TESTING LABORATORY & QUALITY ASSURANCE DIVISION</p>
              <p className="cert-addr">Weaving Complex, Phase II, Textile City, Chennai - 600006 | ISO 9001:2015 Certified</p>
            </div>
            <div className="cert-meta">
              <div className="cert-badge">TEST CERTIFICATE</div>
              <p><strong>Cert No:</strong> {report.certificateNumber}</p>
              <p><strong>Date of Audit:</strong> {report.inspectionDate}</p>
            </div>
          </div>

          <div className="cert-divider"></div>

          {/* Consignment Identification */}
          <div className="cert-lot-box">
            <div>
              <span className="lbl">FABRIC LOT IDENTIFICATION:</span>
              <h3>{report.batchLotNumber}</h3>
              <p>Fabric Quality: <strong>{report.fabricProductName}</strong></p>
            </div>
            <div className="verdict-tag-box">
              <span className="lbl">FINAL QUALITY AUDIT VERDICT:</span>
              <div className={`verdict-stamp ${isGradeA ? 'pass' : 'alert'}`}>
                <ShieldCheck size={18} /> {report.finalVerdict?.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Section 1: ASTM 4-Point Defect Analysis */}
          <div className="cert-section-title">1. VISUAL INSPECTION (ASTM D5430 4-POINT SYSTEM AUDIT)</div>
          <table className="cert-table">
            <thead>
              <tr>
                <th>Inspected Length</th>
                <th>Standard Width</th>
                <th>Minor Flaws (1-2 Pts)</th>
                <th>Major Flaws (3-4 Pts)</th>
                <th className="text-right">ASTM 4-Point Defect Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{report.totalInspectedMeters} meters</strong></td>
                <td>{report.standardWidthInches}" width</td>
                <td>{report.minorDefectsCount} points</td>
                <td>{report.majorDefectsCount} points</td>
                <td className="text-right gold-score">
                  <strong>{report.fourPointScore} pts / 100 sq yds</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <small className="standard-note">*Acceptance Standard: Grade A ≤ 20.0 pts/100 sq.yds | Grade B ≤ 35.0 pts/100 sq.yds</small>

          {/* Section 2: Physical Laboratory Test Metrics */}
          <div className="cert-section-title" style={{ marginTop: '20px' }}>2. PHYSICAL & MECHANICAL LAB TEST PARAMETERS</div>
          <div className="cert-lab-grid">
            <div className="lab-cell">
              <span className="lab-lbl">Actual Fabric GSM:</span>
              <strong>{report.testedGsm} g/m²</strong>
            </div>
            <div className="lab-cell">
              <span className="lab-lbl">Dimensional Stability (Shrinkage):</span>
              <strong>{report.shrinkagePercentage}%</strong>
            </div>
            <div className="lab-cell">
              <span className="lab-lbl">Tensile Strength (Warp/Weft):</span>
              <strong>{report.tensileStrengthNewton} N</strong>
            </div>
            <div className="lab-cell">
              <span className="lab-lbl">Color Fastness to Washing/Light:</span>
              <strong>Grade {report.colorFastnessRating}</strong>
            </div>
          </div>

          {report.remarks && (
            <div className="cert-remarks">
              <strong>Quality Auditor Technical Remarks:</strong> {report.remarks}
            </div>
          )}

          {/* Authorized Signatures & Mill Seal */}
          <div className="cert-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{report.qcInspectorName || 'Inspecting Officer'}</span>
              <small>Certified QC Inspector</small>
            </div>
            <div className="sign-col center-seal">
              <div className="seal-circle">
                <Award size={20} color="#aa820a" />
                <span>OFFICIAL MILL QA SEAL</span>
              </div>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Head of Quality & Lab Operations</span>
              <small>Authorized Signatory</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabCertificatePrint;