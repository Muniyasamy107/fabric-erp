import React from 'react';
import { Printer, X, Sparkles, Thermometer } from 'lucide-react';
import './FinishingBatchPrint.css';

const FinishingBatchPrint = ({ batch, onClose }) => {
  if (!batch) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fb-print-overlay">
      <div className="fb-print-container">
        <div className="no-print fb-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Stenter Process Card
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Stenter Batch Sheet */}
        <div className="fb-paper" id="printable-finishing">
          <div className="fb-head">
            <div className="fb-brand">
              <h1>KAK TEXTILE PROCESSING FINISHING DIVISION</h1>
              <p className="tag">STENTER THERMOFIXATION & CALENDERING BATCH TICKET</p>
              <p className="addr">Textile Wet & Dry Finishing Complex | Machine Line: {batch.machineLine}</p>
            </div>
            <div className="fb-meta">
              <div className="fb-badge">FINISHING TICKET</div>
              <p><strong>Batch No:</strong> {batch.finishBatchNumber}</p>
              <p><strong>Date:</strong> {batch.processingDate}</p>
            </div>
          </div>

          <div className="fb-divider"></div>

          {/* Lot Details */}
          <div className="fb-lot-box">
            <div>
              <span className="lbl">COMMISSIONED GREIGE LOT:</span>
              <h3>{batch.rawBatchLotNumber}</h3>
              <p>Fabric: <strong>{batch.fabricProductName}</strong></p>
            </div>
            <div className="finish-type-box">
              <span className="lbl">TREATMENT SPECIFICATION:</span>
              <div className="finish-type-val">{batch.finishTreatmentType?.replace(/_/g, ' ')}</div>
            </div>
          </div>

          {/* Machine Controls Matrix */}
          <div className="fb-section-title">
            <Thermometer size={14} /> STENTER MACHINE SETTING PARAMETERS
          </div>

          <div className="fb-params-grid">
            <div className="p-cell">
              <span className="p-lbl">Chamber Temperature:</span>
              <strong>{batch.stenterTemperatureCelsius}°C</strong>
            </div>
            <div className="p-cell">
              <span className="p-lbl">Machine Speed:</span>
              <strong>{batch.machineSpeedMpm} m/min</strong>
            </div>
            <div className="p-cell">
              <span className="p-lbl">Delivered Target Width:</span>
              <strong>{batch.targetWidthInches} inches</strong>
            </div>
            <div className="p-cell">
              <span className="p-lbl">Input Greige Length:</span>
              <strong>{batch.inputGreigeMeters} meters</strong>
            </div>
          </div>

          <div className="fb-chemical-box">
            <strong>Chemical Liquor Recipe Applied:</strong>
            <p>{batch.chemicalRecipeApplied}</p>
          </div>

          {batch.processNotes && (
            <div className="fb-notes">
              <strong>Finishing Master Instructions:</strong> {batch.processNotes}
            </div>
          )}

          {/* Signoff */}
          <div className="fb-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{batch.operatorMasterName || 'Finishing Master'}</span>
              <small>Stenter Line In-Charge</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Plant Operations Head</span>
              <small>Calendering Approval</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishingBatchPrint;