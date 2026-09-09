import React from 'react';
import { Printer, X, Shield, Truck } from 'lucide-react';
import './GatePassPrint.css';

const GatePassPrint = ({ pass, onClose }) => {
  if (!pass) return null;

  const handlePrint = () => {
    window.print();
  };

  const netWeight = Number(pass.grossWeightKg || 0) - Number(pass.tareWeightKg || 0);

  return (
    <div className="gp-print-overlay">
      <div className="gp-print-container">
        <div className="no-print gp-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Official Security Gate Pass
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Physical Security Gate Pass Slip */}
        <div className="gp-paper" id="printable-gatepass">
          <div className="gp-head">
            <div className="gp-brand">
              <h1>KAK TEXTILE PROCESSING PLANT SECURITY</h1>
              <p className="tag">OFFICIAL FACTORY VEHICLE OUTWARD / INWARD SECURITY PASS</p>
              <p className="addr">Mill Main Security Gate 01 | CCTV Monitored Weighbridge Terminal</p>
            </div>
            <div className="gp-meta">
              <div className="gp-badge">SECURITY PASS</div>
              <p><strong>Pass No:</strong> {pass.gatePassNumber}</p>
              <p><strong>Timestamp:</strong> {pass.issuedAt ? new Date(pass.issuedAt).toLocaleString('en-IN') : 'Now'}</p>
              <p><strong>Status:</strong> <span className="gp-green">{pass.gateStatus}</span></p>
            </div>
          </div>

          <div className="gp-divider"></div>

          {/* Vehicle & Consignment Info Grid */}
          <div className="gp-grid-2">
            <div className="gp-box">
              <span className="lbl">TRANSPORT & VEHICLE DETAILS:</span>
              <h3>Lorry No: {pass.vehicleNumber}</h3>
              <p>Transporter: <strong>{pass.transporterName}</strong></p>
              <p>Driver: {pass.driverName} ({pass.driverPhone || 'N/A'})</p>
            </div>

            <div className="gp-box highlight">
              <span className="lbl">CONSIGNMENT & E-WAY BILL:</span>
              <p>Pass Category: <strong>{pass.passType?.replace(/_/g, ' ')}</strong></p>
              <p>Consignee: <strong>{pass.destinationOrSourceParty}</strong></p>
              <p>Invoice / Ref: <strong>{pass.referenceInvoiceOrPoNumber}</strong></p>
              <p>E-Way Bill: <strong>{pass.eWayBillNumber || 'N/A'}</strong></p>
            </div>
          </div>

          {/* Weighbridge Slip Table */}
          <div className="gp-section-title">WEIGHBRIDGE & CARGO PACKING SPECIFICATION</div>
          <table className="gp-table">
            <thead>
              <tr>
                <th>Total Bales / Rolls</th>
                <th>Total Woven Yardage</th>
                <th>Gross Lorry Wt (kg)</th>
                <th>Tare Empty Wt (kg)</th>
                <th className="text-right">Net Material Wt (kg)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{pass.totalPackagesCount} Bales / Packages</strong></td>
                <td>{pass.totalMeterageQuantity} meters</td>
                <td>{pass.grossWeightKg} KG</td>
                <td>{pass.tareWeightKg} KG</td>
                <td className="text-right bold-net">{netWeight > 0 ? netWeight : pass.netMaterialWeightKg} KG</td>
              </tr>
            </tbody>
          </table>

          {pass.securityRemarks && (
            <div className="gp-remarks">
              <strong>Security Guard Inspection Notes:</strong> {pass.securityRemarks}
            </div>
          )}

          {/* Signoff Row */}
          <div className="gp-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>Driver Signature</span>
              <small>(Goods acknowledged on truck)</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>Warehouse Officer</span>
              <small>Dispatched from Bay</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>{pass.securityOfficerName || 'Main Gate Security'}</span>
              <small>Gate Security Authorized Out</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatePassPrint;