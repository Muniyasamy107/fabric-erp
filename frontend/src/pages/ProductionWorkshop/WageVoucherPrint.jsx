import React from 'react';
import { Printer, X } from 'lucide-react';
import './WageVoucherPrint.css';

const WageVoucherPrint = ({ voucher, onClose }) => {
  if (!voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="voucher-overlay">
      <div className="voucher-container">
        <div className="no-print voucher-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Tailor Payment Voucher
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Voucher Paper */}
        <div className="voucher-paper" id="printable-voucher">
          <div className="v-header">
            <div className="v-brand">
              <h2>ROYAL FABRICS</h2>
              <p className="v-sub">HAUTE COUTURE BESPOKE ATELIER</p>
              <p className="v-addr">Tailor Labour Wage & Commission Voucher</p>
            </div>
            <div className="v-meta">
              <div className="v-badge">DISBURSEMENT VOUCHER</div>
              <p><strong>Voucher No:</strong> {voucher.voucherNumber || 'VOUCHER-PENDING'}</p>
              <p><strong>Payment Date:</strong> {voucher.paymentDate || new Date().toLocaleDateString('en-IN')}</p>
              <p><strong>Mode:</strong> {voucher.paymentMethod || 'CASH'}</p>
            </div>
          </div>

          <div className="v-divider"></div>

          {/* Master Tailor Beneficiary Details */}
          <div className="v-recipient-box">
            <span className="v-lbl">BENEFICIARY (MASTER TAILOR / CRAFTSMAN):</span>
            <h3>{voucher.tailorName}</h3>
            <p>Atelier Commissioned Job: <strong>{voucher.garmentType}</strong> (Order Ref: {voucher.orderNumber || 'BESPOKE'})</p>
            <p>VIP Client Garment: <strong>{voucher.customerName}</strong></p>
          </div>

          {/* Wage Calculation Table */}
          <table className="v-table">
            <thead>
              <tr>
                <th>Labour Description</th>
                <th className="text-right">Rate / Piece</th>
                <th className="text-right">Bonus / Allowance</th>
                <th className="text-right">Net Amount Paid (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Master Stitching & Tailoring Labour</strong>
                  <div className="v-spec-sub">{voucher.garmentType} Custom Fitting & Finish</div>
                </td>
                <td className="text-right">₹{Number(voucher.pieceRateWage || 0).toFixed(2)}</td>
                <td className="text-right">₹{Number(voucher.bonusCommission || 0).toFixed(2)}</td>
                <td className="text-right bold-amt">₹{Number(voucher.totalPayable || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {voucher.notes && (
            <div className="v-notes">
              <strong>Labour Voucher Notes:</strong> {voucher.notes}
            </div>
          )}

          <div className="v-total-row">
            <span>Total Labour Disbursed:</span>
            <span className="gold-amt">₹{Number(voucher.totalPayable || 0).toFixed(2)}</span>
          </div>

          {/* Signatures */}
          <div className="v-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>Master Tailor Signature</span>
              <small>(Received with thanks)</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Atelier Manager Approval</span>
              <small>(QC & Settlement Passed)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WageVoucherPrint;