import React from 'react';
import { Printer, X } from 'lucide-react';
import './ZReportPrint.css';

const ZReportPrint = ({ shift, onClose }) => {
  if (!shift) return null;

  const handlePrint = () => {
    window.print();
  };

  const diff = Number(shift.cashDifference || 0);
  const isShortage = diff < 0;
  const isExcess = diff > 0;

  return (
    <div className="zreport-overlay">
      <div className="zreport-container">
        <div className="no-print zreport-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Daily Z-Report
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Thermal/A4 Z-Report Slip */}
        <div className="zreport-paper" id="printable-zreport">
          <div className="z-head">
            <h2>ROYAL FABRICS</h2>
            <p className="z-sub">PREMIUM FABRIC MILL & WHOLESALE</p>
            <p className="z-addr">Luxury Avenue, Chennai - 600006</p>
            <div className="z-badge">OFFICIAL END-OF-DAY Z-REPORT</div>
          </div>

          <div className="z-line"></div>

          <div className="z-meta-grid">
            <div><span>Settlement Date:</span> <strong>{shift.shiftDate}</strong></div>
            <div><span>Closing Time:</span> <strong>{shift.closedAt ? new Date(shift.closedAt).toLocaleTimeString('en-IN') : new Date().toLocaleTimeString('en-IN')}</strong></div>
            <div><span>Cashier / Mgr:</span> <strong>{shift.cashierFullName || 'Mill Cashier'}</strong></div>
            <div><span>Register Status:</span> <strong className="green">RECONCILED & CLOSED</strong></div>
          </div>

          <div className="z-line"></div>

          <div className="z-section-title">DAILY SALES TURNOVER SUMMARY</div>
          <div className="z-row">
            <span>Completed Invoices:</span>
            <strong>{shift.totalBillsCount || 0} Bills</strong>
          </div>
          <div className="z-row">
            <span>Total Fabric Cut & Sold:</span>
            <strong>{Number(shift.totalMetersSold || 0).toFixed(1)} meters</strong>
          </div>

          <div className="z-row bold">
            <span>Gross Revenue:</span>
            <span className="gold-amt">₹{Number(shift.totalGrossSales || 0).toFixed(2)}</span>
          </div>

          <div className="z-line"></div>

          <div className="z-section-title">PAYMENT CHANNEL BREAKDOWN</div>
          <div className="z-row">
            <span>Card Settlements (POS EDC):</span>
            <strong>₹{Number(shift.cardSales || 0).toFixed(2)}</strong>
          </div>
          <div className="z-row">
            <span>UPI / NetBanking Transfers:</span>
            <strong>₹{Number(shift.upiSales || 0).toFixed(2)}</strong>
          </div>
          <div className="z-row">
            <span>Counter Cash Sales:</span>
            <strong>₹{Number(shift.cashSales || 0).toFixed(2)}</strong>
          </div>

          <div className="z-line"></div>

          <div className="z-section-title">DRAWER CASH RECONCILIATION</div>
          <div className="z-row">
            <span>Opening Float (Morning Cash):</span>
            <span>₹{Number(shift.openingFloat || 0).toFixed(2)}</span>
          </div>
          <div className="z-row">
            <span>+ Counter Cash Inflow:</span>
            <span>₹{Number(shift.cashSales || 0).toFixed(2)}</span>
          </div>
          <div className="z-row bold highlight">
            <span>Expected Total in Drawer:</span>
            <span>₹{Number(shift.expectedCashInDrawer || 0).toFixed(2)}</span>
          </div>
          <div className="z-row bold">
            <span>Physical Cash Counted:</span>
            <span>₹{Number(shift.actualCashCounted || 0).toFixed(2)}</span>
          </div>

          <div className="z-line"></div>

          {/* Variance Box */}
          <div className={`z-variance-box ${isShortage ? 'shortage' : isExcess ? 'excess' : 'matched'}`}>
            <span className="v-lbl">DRAWER VARIANCE:</span>
            <span className="v-amt">
              {isShortage && `-₹${Math.abs(diff).toFixed(2)} (CASH SHORTAGE)`}
              {isExcess && `+₹${diff.toFixed(2)} (CASH EXCESS)`}
              {!isShortage && !isExcess && '₹0.00 (PERFECTLY BALANCED)'}
            </span>
          </div>

          {shift.closingNotes && (
            <div className="z-notes">
              <strong>Manager Closing Notes:</strong>
              <p>{shift.closingNotes}</p>
            </div>
          )}

          <div className="z-sign-row">
            <div className="z-sign">
              <div className="s-line"></div>
              <span>Cashier Signature</span>
            </div>
            <div className="z-sign">
              <div className="s-line"></div>
              <span>Store Manager Audit Sign</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZReportPrint;