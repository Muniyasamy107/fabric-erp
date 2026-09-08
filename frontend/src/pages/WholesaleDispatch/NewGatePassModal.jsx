import React, { useState } from 'react';
import { issueGatePass } from '../../services/gatePassService';
import './NewGatePassModal.css';

const NewGatePassModal = ({ invoices = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    passType: 'OUTWARD_FINISHED_GOODS',
    vehicleNumber: 'TN-38-AA-9988',
    transporterName: 'VRL Logistics Express',
    driverName: 'Driver Palanisamy',
    driverPhone: '+91 98421 88921',
    destinationOrSourceParty: 'Armani Garments / Raymond Mills',
    referenceInvoiceOrPoNumber: invoices[0]?.invoiceNumber || 'ROYAL-DISPATCH-9901',
    eWayBillNumber: 'EWB-331908821094',
    totalPackagesCount: 24,
    totalMeterageQuantity: 1200.0,
    grossWeightKg: 14250.0,
    tareWeightKg: 8500.0,
    securityOfficerName: 'Head Guard Subbaiah',
    securityRemarks: 'Material seal checked & verified with dispatch invoice.'
  });
  const [loading, setLoading] = useState(false);

  const handleInvoiceSelect = (invNo) => {
    const matched = invoices.find((i) => i.invoiceNumber === invNo);
    if (matched) {
      setForm({
        ...form,
        referenceInvoiceOrPoNumber: matched.invoiceNumber,
        destinationOrSourceParty: matched.clientCompanyName,
        totalMeterageQuantity: matched.items?.reduce((sum, it) => sum + Number(it.shippedMeters || 0), 0) || 1200.0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await issueGatePass({
        ...form,
        totalPackagesCount: Number(form.totalPackagesCount),
        totalMeterageQuantity: Number(form.totalMeterageQuantity),
        grossWeightKg: Number(form.grossWeightKg),
        tareWeightKg: Number(form.tareWeightKg)
      });
      alert(`Security Gate Pass Issued Successfully!\nPass Number: ${res.data.gatePassNumber}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to issue gate pass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gp-modal-overlay">
      <div className="gp-modal-content">
        <h2>Issue Factory Gate Pass & Lorry Manifest</h2>
        <p className="modal-sub">Authorize security check, weighbridge gross/tare recording and vehicle dispatch</p>

        <form onSubmit={handleSubmit}>
          <div className="gp-form-row">
            <div className="form-group flex-1">
              <label>Gate Pass Type</label>
              <select value={form.passType} onChange={(e) => setForm({ ...form, passType: e.target.value })}>
                <option value="OUTWARD_FINISHED_GOODS">Outward - Finished Fabric Bales</option>
                <option value="INWARD_RAW_MATERIAL">Inward - Raw Yarn / Dye Chemicals</option>
                <option value="RETURNABLE_JOB_WORK">Returnable - Loom Motor / Spares Job Work</option>
                <option value="NON_RETURNABLE">Non-Returnable Factory Scrap</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Lorry / Vehicle Registration No</label>
              <input
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                placeholder="e.g. TN-38-AA-9988"
                required
              />
            </div>
          </div>

          <div className="gp-form-row">
            <div className="form-group flex-1">
              <label>Transporter Name & Logistics</label>
              <input
                value={form.transporterName}
                onChange={(e) => setForm({ ...form, transporterName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Driver Name & Mobile</label>
              <input
                value={form.driverName}
                onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                placeholder="Driver Name"
                required
              />
            </div>
          </div>

          <div className="gp-section-box">
            <h4>Consignment Reference & Commercial E-Way Bill</h4>
            <div className="gp-form-grid-3">
              <div className="form-group">
                <label>Linked Dispatch Invoice</label>
                <select
                  value={form.referenceInvoiceOrPoNumber}
                  onChange={(e) => handleInvoiceSelect(e.target.value)}
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.invoiceNumber}>
                      {inv.invoiceNumber} — {inv.clientCompanyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Consignee / Destination Party</label>
                <input
                  value={form.destinationOrSourceParty}
                  onChange={(e) => setForm({ ...form, destinationOrSourceParty: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>GST E-Way Bill Number</label>
                <input
                  value={form.eWayBillNumber}
                  onChange={(e) => setForm({ ...form, eWayBillNumber: e.target.value })}
                  placeholder="e.g. EWB-331908821094"
                  required
                />
              </div>
            </div>
          </div>

          <div className="gp-section-box">
            <h4>Weighbridge Slip Parameters (Gross / Tare in KG)</h4>
            <div className="gp-form-grid-4">
              <div className="form-group">
                <label>Gross Lorry Wt (KG)</label>
                <input
                  type="number"
                  value={form.grossWeightKg}
                  onChange={(e) => setForm({ ...form, grossWeightKg: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tare Empty Wt (KG)</label>
                <input
                  type="number"
                  value={form.tareWeightKg}
                  onChange={(e) => setForm({ ...form, tareWeightKg: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Rolls / Bales</label>
                <input
                  type="number"
                  value={form.totalPackagesCount}
                  onChange={(e) => setForm({ ...form, totalPackagesCount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Meterage (m)</label>
                <input
                  type="number"
                  value={form.totalMeterageQuantity}
                  onChange={(e) => setForm({ ...form, totalMeterageQuantity: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="gp-form-row">
            <div className="form-group flex-1">
              <label>Duty Security Officer Name</label>
              <input
                value={form.securityOfficerName}
                onChange={(e) => setForm({ ...form, securityOfficerName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Security Gate Inspection Remarks</label>
              <input
                value={form.securityRemarks}
                onChange={(e) => setForm({ ...form, securityRemarks: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Authorizing...' : 'Authorize & Print Security Pass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGatePassModal;