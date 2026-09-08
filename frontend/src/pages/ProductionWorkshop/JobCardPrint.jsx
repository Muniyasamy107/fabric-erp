import React from 'react';
import { Printer, X, Scissors, Bookmark } from 'lucide-react';
import './JobCardPrint.css';

const JobCardPrint = ({ order, measurements, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const m = measurements && measurements.length > 0 ? measurements[0] : null;

  return (
    <div className="jobcard-overlay">
      <div className="jobcard-container">
        {/* Actions bar */}
        <div className="no-print jobcard-actions-bar">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Workshop Job Card
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Physical Job Card Paper */}
        <div className="jobcard-paper" id="printable-jobcard">
          <div className="jc-header">
            <div className="jc-brand">
              <h2>ROYAL FABRICS</h2>
              <span>HAUTE COUTURE BESPOKE ATELIER</span>
              <p>WORKSHOP JOB CARD & MASTER CUTTING TICKET</p>
            </div>
            <div className="jc-order-badge">
              <div className="jc-ref-title">JOB TICKET NO</div>
              <div className="jc-ref-num">{order.orderNumber}</div>
              <div className="jc-status">Status: {order.status}</div>
            </div>
          </div>

          <div className="jc-divider"></div>

          {/* Client & Deadline Summary */}
          <div className="jc-grid-3">
            <div className="jc-box">
              <span className="jc-label">VIP CLIENT</span>
              <div className="jc-val bold">{order.customerName}</div>
              <div className="jc-sub">{order.customerPhone}</div>
            </div>

            <div className="jc-box highlight">
              <span className="jc-label">FITTING / TRIAL DATE</span>
              <div className="jc-val gold-val">{order.trialDate || 'NOT SCHEDULED'}</div>
              <div className="jc-sub">Slot: {order.trialTimeSlot || '04:00 PM'}</div>
            </div>

            <div className="jc-box highlight">
              <span className="jc-label">FINAL DELIVERY DATE</span>
              <div className="jc-val gold-val">{order.deliveryDate || 'N/A'}</div>
              <div className="jc-sub">Master: <strong>{order.masterTailorName || 'Unassigned'}</strong></div>
            </div>
          </div>

          {/* Garment & Fabric Info */}
          <div className="jc-grid-2">
            <div className="jc-box">
              <span className="jc-label">COMMISSIONED GARMENT</span>
              <div className="jc-val bold">{order.garmentType}</div>
              <div className="jc-sub">Stitching Value: ₹{Number(order.stitchingCost || 0).toFixed(2)}</div>
            </div>
            <div className="jc-box">
              <span className="jc-label">FABRIC SPECIFICATION & ROLL DETAILS</span>
              <div className="jc-val">{order.fabricDetails}</div>
            </div>
          </div>

          {/* 🌟 Bespoke Style Specifications & Monogram Architecture */}
          <div className="jc-style-spec-box">
            <div className="spec-head"><Bookmark size={14} /> BESPOKE ATELIER STYLE BLUEPRINT</div>
            <div className="style-specs-table-grid">
              <div><span>Lapel Style:</span> <strong>{order.lapelStyle || 'PEAK_LAPEL'}</strong></div>
              <div><span>Inner Lining:</span> <strong>{order.liningFabric || 'BEMBERG_SILK_CRIMSON'}</strong></div>
              <div><span>Button Choice:</span> <strong>{order.buttonType || 'REAL_HORN'}</strong></div>
              <div><span>Back Vents:</span> <strong>{order.ventStyle || 'DOUBLE_BRITISH_VENT'}</strong></div>
              <div><span>Pocket Cut:</span> <strong>{order.pocketStyle || 'SLANTED_TICKET_POCKET'}</strong></div>
              <div>
                <span>Silk Monogram:</span>
                <strong>{order.monogramText ? `"${order.monogramText}" (${order.monogramThreadColor} - ${order.monogramPlacement})` : 'NO MONOGRAM'}</strong>
              </div>
            </div>
          </div>

          {/* Master Body Measurements */}
          <div className="jc-measurements-section">
            <div className="section-title">
              <Scissors size={16} /> MASTER BODY MEASUREMENT SPECIFICATIONS (INCHES)
            </div>

            {m ? (
              <>
                <div className="meas-grid">
                  <div className="meas-cell"><span className="m-lbl">Neck:</span><span className="m-val">{m.neck ? `${m.neck}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Chest:</span><span className="m-val">{m.chest ? `${m.chest}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Waist:</span><span className="m-val">{m.waist ? `${m.waist}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Hip:</span><span className="m-val">{m.hip ? `${m.hip}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Shoulder:</span><span className="m-val">{m.shoulder ? `${m.shoulder}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Sleeve:</span><span className="m-val">{m.sleeveLength ? `${m.sleeveLength}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Jacket L:</span><span className="m-val">{m.jacketLength ? `${m.jacketLength}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Inseam:</span><span className="m-val">{m.inseam ? `${m.inseam}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Pant Waist:</span><span className="m-val">{m.trouserWaist ? `${m.trouserWaist}"` : '-'}</span></div>
                  <div className="meas-cell"><span className="m-lbl">Fit Style:</span><span className="m-val bold">{m.fitPreference || 'Italian Slim'}</span></div>
                </div>

                {m.specialInstructions && (
                  <div className="meas-notes">
                    <strong>Master Cutting Notes:</strong> {m.specialInstructions}
                  </div>
                )}
              </>
            ) : (
              <div className="no-meas-alert">
                No body measurements recorded yet for this client. Please update Body Specs before cutting fabric.
              </div>
            )}
          </div>

          {/* Quality Checklist & Fabric Swatch Area */}
          <div className="jc-workshop-grid">
            <div className="swatch-box">
              <div className="swatch-title">ATTACH FABRIC SWATCH HERE (STAPLE)</div>
              <div className="swatch-area"></div>
            </div>

            <div className="checklist-box">
              <div className="cl-title">WORKSHOP STAGE CHECKLIST</div>
              <div className="cl-item"><input type="checkbox" readOnly /> <span>1. Pattern Drafted & Style Verified</span></div>
              <div className="cl-item"><input type="checkbox" readOnly /> <span>2. Precision Fabric Cutting Done</span></div>
              <div className="cl-item"><input type="checkbox" readOnly /> <span>3. Silk Lining & Horsehair Canvas Fused</span></div>
              <div className="cl-item"><input type="checkbox" readOnly /> <span>4. Monogram Embroidered & Buttons Set</span></div>
              <div className="cl-item"><input type="checkbox" readOnly /> <span>5. Final Steam Pressing & QC Passed</span></div>
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="jc-sign-footer">
            <div className="sign-col">
              <div className="line"></div>
              <span>Cutting Master Signature</span>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Stitching Master Signature</span>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>QC & Delivery Approval</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardPrint;