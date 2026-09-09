import React from 'react';
import { Printer, X, PackageCheck } from 'lucide-react';
import './BaleManifestPrint.css';

const BaleManifestPrint = ({ baleNumber, rolls = [], onClose }) => {
  if (!rolls || rolls.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalMeters = rolls.reduce((sum, r) => sum + Number(r.netLengthMeters || 0), 0);
  const totalNetWeight = rolls.reduce((sum, r) => sum + Number(r.netWeightKg || 0), 0);
  const totalGrossWeight = rolls.reduce((sum, r) => sum + Number(r.grossWeightKg || 0), 0);
  const first = rolls[0];

  return (
    <div className="manifest-overlay">
      <div className="manifest-container">
        <div className="no-print manifest-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Consignment Packing List
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Official Export Packing Manifest Sheet */}
        <div className="manifest-paper" id="printable-manifest">
          <div className="mf-head">
            <div className="mf-brand">
              <h1>KAK TEXTILE PROCESSING MILLS</h1>
              <p className="tag">OFFICIAL BALE PACKING LIST & SHIPPING CONTAINER MANIFEST</p>
              <p className="addr">Weaving & Export Terminal | GSTIN: 33AAAAA0000A1Z5</p>
            </div>
            <div className="mf-meta">
              <div className="mf-badge">PACKING MANIFEST</div>
              <p><strong>Bale / Pallet Ref:</strong> {baleNumber}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="mf-divider"></div>

          {/* Consignment Specs */}
          <div className="mf-summary-grid">
            <div>Fabric Quality: <strong>{first.fabricProductName}</strong></div>
            <div>Lot Batch: <strong>{first.batchLotNumber}</strong></div>
            <div>Total Rolls in Bale: <strong>{rolls.length} Rolls</strong></div>
            <div>Total Net Length: <strong className="gold-txt">{totalMeters.toFixed(1)} meters</strong></div>
          </div>

          {/* Itemized Rolls Breakdown Table */}
          <table className="mf-table">
            <thead>
              <tr>
                <th>Piece #</th>
                <th>Roll Barcode Serial</th>
                <th>Width (Panna)</th>
                <th>Net Piece Length (m)</th>
                <th>Net Weight (kg)</th>
                <th>Gross Weight (kg)</th>
                <th>Quality Grade</th>
              </tr>
            </thead>
            <tbody>
              {rolls.map((r, idx) => (
                <tr key={r.id}>
                  <td>{idx + 1}</td>
                  <td><strong>{r.rollBarcodeNumber}</strong></td>
                  <td>{r.fabricWidthInches}"</td>
                  <td className="bold-m">{r.netLengthMeters} m</td>
                  <td>{r.netWeightKg} kg</td>
                  <td>{r.grossWeightKg} kg</td>
                  <td>{r.qualityGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="mf-totals-box">
            <div>Total Woven Yardage: <strong>{totalMeters.toFixed(1)} METERS</strong></div>
            <div>Total Net Weight: <strong>{totalNetWeight.toFixed(1)} KG</strong></div>
            <div>Total Gross Weight: <strong>{totalGrossWeight.toFixed(1)} KG</strong></div>
          </div>

          {/* Signatures */}
          <div className="mf-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>Warehouse Packing Supervisor</span>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Freight Cargo Inspector</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaleManifestPrint;