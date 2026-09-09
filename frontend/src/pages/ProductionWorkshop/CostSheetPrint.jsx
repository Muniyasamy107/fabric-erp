import React from 'react';
import { Printer, X, Calculator, ShieldCheck } from 'lucide-react';
import './CostSheetPrint.css';

const CostSheetPrint = ({ sheet, onClose }) => {
  if (!sheet) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cost-print-overlay">
      <div className="cost-print-container">
        <div className="no-print cost-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Costing Sheet & BOM Tech Pack
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Costing Tech Pack Sheet */}
        <div className="cost-paper" id="printable-costing">
          <div className="cs-head">
            <div className="cs-brand">
              <h1>KAK TEXTILE PROCESSING MILLS</h1>
              <p className="tag">OFFICIAL FABRIC COST OF PRODUCTION (COP) & BOM TECHNICAL SHEET</p>
              <p className="addr">Mill Costing & Commercial Merchandising Division | Chennai Complex</p>
            </div>
            <div className="cs-meta">
              <div className="cs-badge">COST SHEET</div>
              <p><strong>Sheet No:</strong> {sheet.costingSheetNumber}</p>
              <p><strong>Date:</strong> {sheet.costingDate}</p>
            </div>
          </div>

          <div className="cs-divider"></div>

          {/* Quality Summary Header */}
          <div className="cs-quality-box">
            <div>
              <span className="lbl">COMMISSIONED FABRIC QUALITY:</span>
              <h3>{sheet.fabricName}</h3>
              <p>Quality Code: <strong>{sheet.qualityCode}</strong> | Weave: {sheet.weaveType}</p>
            </div>
            <div className="cs-ex-mill-badge">
              <span className="lbl">RECOMMENDED EX-MILL QUOTATION:</span>
              <div className="ex-price">₹{Number(sheet.recommendedExMillPrice || 0).toFixed(2)} / meter</div>
              <small>Including {sheet.targetProfitMarginPct}% Ex-Mill Margin</small>
            </div>
          </div>

          {/* Section 1: Weave Construction Specifications */}
          <div className="cs-section-title">1. TECHNICAL WEAVE SPECIFICATIONS (REED & PICK MATRIX)</div>
          <table className="cs-table">
            <thead>
              <tr>
                <th>Warp Ends</th>
                <th>Warp Count</th>
                <th>Warp Crimp %</th>
                <th>Weft Density (PPI)</th>
                <th>Weft Count</th>
                <th>Weft Crimp %</th>
                <th>Width</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{sheet.totalWarpEnds} ends</strong></td>
                <td>{sheet.warpCountNe}</td>
                <td>{sheet.warpCrimpPercentage}%</td>
                <td><strong>{sheet.picksPerInch} PPI</strong></td>
                <td>{sheet.weftCountNe}</td>
                <td>{sheet.weftCrimpPercentage}%</td>
                <td>{sheet.finishedWidthInches}"</td>
              </tr>
            </tbody>
          </table>

          {/* Section 2: Detailed BOM Cost Breakdown per Meter */}
          <div className="cs-section-title" style={{ marginTop: '20px' }}>2. ITEMIZED PRODUCTION COST BREAKDOWN (INR / METER)</div>
          <table className="cs-table cost-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cost Component Description</th>
                <th className="text-right">Component Cost (INR / Meter)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Warp Raw Yarn Cost (Including Crimp & Waste)</td><td className="text-right">₹{Number(sheet.warpYarnCostPerMeter || 0).toFixed(2)}</td></tr>
              <tr><td>2</td><td>Weft Raw Yarn Cost (Including Crimp & Loom Fly)</td><td className="text-right">₹{Number(sheet.weftYarnCostPerMeter || 0).toFixed(2)}</td></tr>
              <tr><td>3</td><td>Warping & Sizing Chemical Mix / Starch Cost</td><td className="text-right">₹{Number(sheet.sizingChemicalCostPerMeter || 0).toFixed(2)}</td></tr>
              <tr><td>4</td><td>Weaving Loom Conversion Cost (Operator + Pick Labour)</td><td className="text-right">₹{Number(sheet.weavingLoomCostPerMeter || 0).toFixed(2)}</td></tr>
              <tr><td>5</td><td>Dye House Liquor & Stenter Calendering Processing</td><td className="text-right">₹{Number(sheet.dyeingAndFinishingCostPerMeter || 0).toFixed(2)}</td></tr>
              <tr><td>6</td><td>Mill Power, Steam Boiler & Administrative Overheads</td><td className="text-right">₹{Number(sheet.millOverheadsPerMeter || 0).toFixed(2)}</td></tr>
              <tr className="subtotal-row">
                <td colSpan="2"><strong>TOTAL FACTORY COST OF PRODUCTION (NET COP):</strong></td>
                <td className="text-right bold-cop">₹{Number(sheet.netProductionCostPerMeter || 0).toFixed(2)} / meter</td>
              </tr>
            </tbody>
          </table>

          {sheet.remarks && (
            <div className="cs-remarks">
              <strong>Commercial Merchandiser Remarks:</strong> {sheet.remarks}
            </div>
          )}

          {/* Signoff */}
          <div className="cs-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{sheet.preparedByMerchandiser || 'Costing Merchandiser'}</span>
              <small>Cost Engineer Sign</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>General Manager (Commercial)</span>
              <small>Price Approval Sign</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSheetPrint;