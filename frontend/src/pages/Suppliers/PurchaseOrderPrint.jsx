import React from 'react';
import { Printer, X } from 'lucide-react';
import './PurchaseOrderPrint.css';

const PurchaseOrderPrint = ({ po, onClose }) => {
  if (!po) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="po-print-overlay">
      <div className="po-print-container">
        {/* Actions bar */}
        <div className="no-print po-print-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Purchase Order (PO)
          </button>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Printable PO Paper */}
        <div className="po-paper" id="printable-po">
          <div className="po-header">
            <div className="po-brand">
              <h1>KAK TEXTILE PROCESSING</h1>
              <p className="tag">PREMIUM WOVEN FABRICS & TEXTILES</p>
              <p className="addr">
                No. 42, Luxury Avenue, High Street, Chennai - 600006<br />
                GSTIN: 33AAAAA0000A1Z5 | kaktextiles@gmail.com
              </p>
            </div>
            <div className="po-meta">
              <div className="po-badge">PURCHASE ORDER</div>
              <p><strong>PO Number:</strong> {po.poNumber}</p>
              <p><strong>Date Issued:</strong> {po.createdAt ? new Date(po.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</p>
              <p><strong>Expected Delivery:</strong> {po.expectedDeliveryDate || 'IMMEDIATE FREIGHT'}</p>
            </div>
          </div>

          <div className="po-divider"></div>

          {/* Supplier Info */}
          <div className="po-supplier-block">
            <span className="sec-lbl">PURCHASE ORDER ISSUED TO (WEAVER / MILL):</span>
            <h3>{po.supplierMillName}</h3>
            <p>Attn: {po.millContactPerson || 'Mill Dispatch Manager'} | Phone: {po.millPhone || 'N/A'}</p>
            <p>Mill Location: {po.millCity || 'Domestic/Import Mill'}</p>
          </div>

          {/* Items Table */}
          <table className="po-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fabric SKU & Specifications</th>
                <th>Material Type</th>
                <th className="text-right">Ordered Length</th>
                <th className="text-right">Mill Rate/m</th>
                <th className="text-right">Estimated Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {po.items?.map((it, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{it.fabricName}</strong>
                    <div className="sku-tag">SKU: {it.itemCode}</div>
                  </td>
                  <td>{it.fabricType}</td>
                  <td className="text-right bold-txt">{it.orderedMeters} meters</td>
                  <td className="text-right">₹{Number(it.estimatedCostPerMeter || 0).toFixed(2)}</td>
                  <td className="text-right bold-txt">₹{Number(it.subTotal || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Terms & Estimated Total */}
          <div className="po-bottom-grid">
            <div className="po-terms">
              <h4>Mill Procurement & Quality Terms:</h4>
              <ul>
                <li>Fabric rolls must be delivered in pristine moisture-sealed packaging.</li>
                <li>Any weave flaw / color streak exceeding 0.5m must be flagged on consignment.</li>
                <li>Invoice payment released upon mill warehouse meter audit approval.</li>
              </ul>
              {po.notes && <p className="custom-notes"><strong>Special Indent Instructions:</strong> {po.notes}</p>}
            </div>

            <div className="po-total-box">
              <div className="total-line">
                <span>Total Estimated Value:</span>
                <span className="gold-amt">₹{Number(po.totalEstimatedCost || 0).toFixed(2)}</span>
              </div>
              <small>Taxes and freight extra as per mill invoice.</small>
            </div>
          </div>

          {/* Signatures */}
          <div className="po-footer-sign">
            <div className="sign-col">
              <div className="line"></div>
              <span>Mill Procurement Head</span>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Mill Representative Acceptance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPrint;