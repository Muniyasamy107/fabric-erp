import React from 'react';
import { Printer, X, Sparkles, Scissors } from 'lucide-react';
import './SampleTechSheetPrint.css';

const SampleTechSheetPrint = ({ design, onClose }) => {
  if (!design) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sample-print-overlay">
      <div className="sample-print-container">
        <div className="no-print sample-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Buyer Sample Tech Card & Swatch Sheet
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Physical Sample Tech Sheet */}
        <div className="sample-paper" id="printable-sample">
          <div className="sp-head">
            <div className="sp-brand">
              <h1>ROYAL FABRICS ATELIER R&D STUDIO</h1>
              <p className="sp-tag">OFFICIAL CAD WEAVE SPECIFICATION & BUYER SAMPLE STRIKE-OFF CARD</p>
              <p className="sp-addr">Central Design & Product Development Studio | Milan & Paris Export Desk</p>
            </div>
            <div className="sp-meta">
              <div className="sp-badge">SAMPLE TECH CARD</div>
              <p><strong>Design No:</strong> {design.designCode || 'CAD-SAMPLE-01'}</p>
              <p><strong>Date:</strong> {design.creationDate || new Date().toLocaleDateString('en-IN')}</p>
              <p><strong>Buyer:</strong> <strong className="gold-txt">{design.targetBuyerBrand || 'International Buyer'}</strong></p>
            </div>
          </div>

          <div className="sp-divider"></div>

          {/* Design Concept & Buyer Block */}
          <div className="sp-summary-grid">
            <div className="sp-box">
              <span className="lbl">CONCEPT DESIGN:</span>
              <h3>{design.designName}</h3>
              <p>Collection: <strong>{design.seasonCollection || 'Spring/Summer Collection'}</strong></p>
            </div>
            <div className="sp-box highlight">
              <span className="lbl">SAMPLE DEVELOPMENT STATUS:</span>
              <div className="status-val">{design.sampleDevelopmentStatus ? design.sampleDevelopmentStatus.replace(/_/g, ' ') : 'SAMPLE DRAFT'}</div>
              <small>Sample Yardage: {design.sampleYardageRequiredMeters || 10.0}m Strike-off</small>
            </div>
          </div>

          {/* Weave Construction Matrix */}
          <div className="sp-section-title">
            <Scissors size={14} /> 1. TECHNICAL DOBBY WEAVE ARCHITECTURE
          </div>

          <table className="sp-table">
            <thead>
              <tr>
                <th>Weave Structure</th>
                <th>Heald Shafts</th>
                <th>Warp Density (EPI)</th>
                <th>Weft Density (PPI)</th>
                <th className="text-right">Total Construction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{design.weaveType ? design.weaveType.replace(/_/g, ' ') : 'Dobby Twill'}</strong></td>
                <td>{design.numberOfHealdShafts || 16} Shafts Dobby</td>
                <td>{design.endsPerInchEpi || 110} EPI</td>
                <td>{design.picksPerInchPpi || 84} PPI</td>
                <td className="text-right bold-txt">{(design.endsPerInchEpi || 110)} × {(design.picksPerInchPpi || 84)} (High Density)</td>
              </tr>
            </tbody>
          </table>

          {/* Yarn & Color Repeat Sequence */}
          <div className="sp-section-title" style={{ marginTop: '18px' }}>
            <Sparkles size={14} /> 2. YARN COUNT & COLOR PATTERN REPEAT SEQUENCE
          </div>

          <div className="sp-yarn-grid">
            <div className="y-cell">Warp Yarn: <strong>{design.warpYarnSpec || 'Cotton 80s Compact / Mulberry Silk'}</strong></div>
            <div className="y-cell">Weft Insertion: <strong>{design.weftYarnSpec || 'Cashmere Wool 2/80s'}</strong></div>
          </div>

          <div className="sp-repeat-box">
            <span className="lbl">COLOR REPEAT SEQUENCE:</span>
            <strong>{design.colorRepeatSequence || 'Standard Solid Dye Match'}</strong>
          </div>

          {/* Swatch Staple Area & Feedback */}
          <div className="sp-swatch-box-grid">
            <div className="swatch-mount-area">
              <div className="mount-title">STAPLE / MOUNT ACTUAL WOVEN SAMPLE SWATCH HERE (3" × 3")</div>
              <div className="blank-swatch-frame"></div>
            </div>
            <div className="feedback-area">
              <span className="lbl">BUYER COMMENTS / DISPATCH TRACKING:</span>
              <p>{design.buyerFeedbackComments || 'Sample submitted for buyer aesthetic approval.'}</p>
              <div className="courier-tag">Courier AWB: <strong>{design.courierAwbTrackingNumber || 'Pending Dispatch'}</strong></div>
            </div>
          </div>

          {/* Signoff */}
          <div className="sp-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{design.cadTextileDesignerName || 'CAD Designer'}</span>
              <small>Lead Textile Designer</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Head of Product Development (R&D)</span>
              <small>Sample Approval Sign</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleTechSheetPrint;