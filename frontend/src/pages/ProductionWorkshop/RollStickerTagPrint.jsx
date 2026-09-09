import React from 'react';
import { Printer, X, QrCode, Sparkles } from 'lucide-react';
import './RollStickerTagPrint.css';

const RollStickerTagPrint = ({ roll, onClose }) => {
  if (!roll) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sticker-overlay">
      <div className="sticker-container">
        <div className="no-print sticker-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print 4"x6" Thermal Roll Sticker
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable 4" x 6" Industrial Thermal Tag */}
        <div className="industrial-roll-tag" id="printable-tag">
          <div className="tag-header">
            <div className="tag-mill">KAK TEXTILE PROCESSING MILLS</div>
            <div className="tag-sub">PREMIUM EXPORT GRADE PACKED ROLL</div>
          </div>

          <div className="tag-grid-2">
            <div className="tag-qr-box">
              <div className="qr-visual">
                <QrCode size={75} color="#000" />
              </div>
              <span className="qr-serial">{roll.rollBarcodeNumber}</span>
            </div>

            <div className="tag-core-info">
              <span className="lbl">QUALITY SPECIFICATION:</span>
              <h2 className="tag-fabric-name">{roll.fabricProductName}</h2>
              <p className="tag-lot-line">Lot Batch: <strong>{roll.batchLotNumber}</strong> | Weave: {roll.weaveType || 'Woven'}</p>
              <div className="tag-grade-stamp">{roll.qualityGrade?.replace(/_/g, ' ')}</div>
            </div>
          </div>

          <div className="tag-measurements-box">
            <div className="meas-col">
              <span className="m-lbl">NET ROLL LENGTH</span>
              <strong className="m-val">{roll.netLengthMeters} METERS</strong>
            </div>
            <div className="meas-col">
              <span className="m-lbl">WIDTH (PANNA)</span>
              <strong className="m-val">{roll.fabricWidthInches}" INCH</strong>
            </div>
            <div className="meas-col">
              <span className="m-lbl">NET WEIGHT</span>
              <strong className="m-val">{roll.netWeightKg} KG</strong>
            </div>
          </div>

          <div className="tag-footer-row">
            <div>Bale Ref: <strong>{roll.balePackageNumber || 'BALE-01'}</strong></div>
            <div>Storage Bay: <strong>{roll.warehouseBin}</strong></div>
            <div>Packed: <strong>{roll.packingDate}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollStickerTagPrint;