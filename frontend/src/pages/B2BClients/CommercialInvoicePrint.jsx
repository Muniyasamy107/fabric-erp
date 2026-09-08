import React from 'react';
import { Printer, X, Globe, Anchor } from 'lucide-react';
import './CommercialInvoicePrint.css';

const CommercialInvoicePrint = ({ contract, onClose }) => {
  if (!contract) return null;

  const handlePrint = () => {
    window.print();
  };

  const curr = contract.tradeCurrency || 'USD';
  const sym = curr === 'USD' ? '$' : curr === 'EUR' ? '€' : '£';

  return (
    <div className="cinv-print-overlay">
      <div className="cinv-print-container">
        <div className="no-print cinv-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print International Commercial Invoice
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable International Shipping Invoice */}
        <div className="cinv-paper" id="printable-cinv">
          <div className="ci-head">
            <div className="ci-brand">
              <h1>ROYAL FABRICS EXPORT HOUSE</h1>
              <p className="ci-tag">GOVERNMENT OF INDIA RECOGNIZED STAR EXPORT TEXTILE MILL</p>
              <p className="ci-addr">
                Export Processing Zone, Chennai - 600006, India<br />
                IEC Code: 0400099882 | GSTIN: 33AAAAA0000A1Z5 | Swift: {contract.bankSwiftCode}
              </p>
            </div>
            <div className="ci-meta">
              <div className="ci-badge">COMMERCIAL INVOICE</div>
              <p><strong>Invoice No:</strong> {contract.exportContractNumber}</p>
              <p><strong>Date of Issue:</strong> {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US')}</p>
              <p><strong>Payment Terms:</strong> Letter of Credit (LC at Sight)</p>
            </div>
          </div>

          <div className="ci-divider"></div>

          {/* Consignee & Shipping Grid */}
          <div className="ci-grid-2">
            <div className="ci-box">
              <span className="lbl">CONSIGNEE & OVERSEAS BUYER:</span>
              <h3>{contract.buyerCompanyName}</h3>
              <p>Country: <strong>{contract.buyerCountry}</strong></p>
              <p>Contact: {contract.buyerContactEmail}</p>
            </div>

            <div className="ci-box highlight">
              <span className="lbl">LETTER OF CREDIT & SHIPPING ROUTE:</span>
              <p>LC Reference: <strong>{contract.lcNumber}</strong></p>
              <p>Issuing Bank: <strong>{contract.lcIssuingBank}</strong></p>
              <p>Port: <strong>{contract.portOfLoading} ➔ {contract.portOfDischarge}</strong></p>
              <p>Incoterms: <strong>{contract.incoterms?.replace(/_/g, ' ')}</strong></p>
            </div>
          </div>

          {/* Itemized Export Goods Table */}
          <table className="ci-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description of Export Merchandise (Piece Goods)</th>
                <th>HS Code</th>
                <th className="text-right">Quantity (Meters)</th>
                <th className="text-right">Unit Price ({curr})</th>
                <th className="text-right">Total Amount ({curr})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <strong>100% Woven Fabric Merchandise — {contract.fabricProductName}</strong>
                  <div className="ci-sub-desc">Packed in 20ft Full Container Load ({contract.shippingContainerMode})</div>
                </td>
                <td>5007.20.00</td>
                <td className="text-right bold-txt">{Number(contract.contractedMeters || 0).toLocaleString('en-US')} m</td>
                <td className="text-right">{sym}{Number(contract.pricePerMeterForeignCurrency || 0).toFixed(2)}</td>
                <td className="text-right gold-amt">{sym}{Number(contract.totalContractValueForeign || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          {/* Custom Declaration & Total Realization Box */}
          <div className="ci-bottom-grid">
            <div className="ci-declaration">
              <h4>Customs & Legal Declaration:</h4>
              <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Country of Origin of Goods: INDIA.</p>
              <p>Bank Realization Value: <strong>INR ₹{Number(contract.totalInrRealizationValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></p>
            </div>

            <div className="ci-total-card">
              <div className="total-line">
                <span>Total Invoice Value:</span>
                <span className="big-amt">{sym}{Number(contract.totalContractValueForeign || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <small>Currency: {curr} ({contract.incoterms?.replace(/_/g, ' ')})</small>
            </div>
          </div>

          {/* Signoff */}
          <div className="ci-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>For ROYAL FABRICS EXPORT DIVISION</span>
              <small>Authorized Signatory & Seal</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialInvoicePrint;