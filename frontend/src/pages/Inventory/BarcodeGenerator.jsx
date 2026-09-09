import React from 'react';
import Barcode from 'react-barcode';
import { Printer, X } from 'lucide-react';
import './BarcodeGenerator.css';

const BarcodeGenerator = ({ fabric, onClose }) => {
  if (!fabric) return null;

  const handlePrintTag = () => {
    window.print();
  };

  return (
    <div className="tag-modal-overlay">
      <div className="tag-modal-content">
        {/* Actions Bar */}
        <div className="no-print tag-actions">
          <button className="tag-print-btn" onClick={handlePrintTag}>
            <Printer size={18} /> Print Roll Tag
          </button>
          <button className="tag-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Physical Roll Tag (Printable) */}
        <div className="luxury-fabric-tag" id="printable-tag">
          <div className="tag-header">
            <span className="tag-brand">KAK TEXTILE PROCESSING</span>
            <span className="tag-edition">PREMIUM FABRIC</span>
          </div>

          <div className="tag-divider"></div>

          <div className="tag-body">
            <h3 className="tag-fabric-name">{fabric.name}</h3>
            
            <div className="tag-specs-grid">
              <div className="spec-item">
                <span className="spec-label">TYPE</span>
                <span className="spec-value">{fabric.fabricType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">GSM</span>
                <span className="spec-value">{fabric.gsm || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ROLL LENGTH</span>
                <span className="spec-value">{fabric.totalAvailableMeters} m</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">PRICE / M</span>
                <span className="spec-value gold-spec">₹{parseFloat(fabric.pricePerMeter).toFixed(2)}</span>
              </div>
            </div>

            {/* Barcode Display */}
            <div className="tag-barcode-box">
              <Barcode 
                value={fabric.itemCode || 'FAB-001'} 
                width={1.4}
                height={45}
                fontSize={12}
                background="#ffffff"
                lineColor="#000000"
              />
            </div>

            <div className="tag-footer">
              <span>Origin: KAK Textile Processing, Tirupur</span>
              <span>100% Genuine Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;