import React, { useState } from 'react';
import { createExportContract } from '../../services/exportService';
import './NewExportContractModal.css';

const NewExportContractModal = ({ fabrics = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    buyerCompanyName: 'Armani Group S.p.A',
    buyerCountry: 'Italy',
    buyerContactEmail: 'procurement@armani.it',
    fabricProductName: fabrics[0]?.name || 'Royal Silk Crepe 900',
    contractedMeters: 10000.0,
    tradeCurrency: 'USD',
    pricePerMeterForeignCurrency: 4.80,
    incoterms: 'CIF_HAMBURG',
    portOfLoading: 'Chennai Port (INMAA)',
    portOfDischarge: 'Port of Hamburg (DEHAM)',
    shippingContainerMode: '20FT_FCL',
    lcNumber: 'LC-HSBC-88921',
    lcIssuingBank: 'HSBC Bank London Plc',
    lcExpiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    expectedShipmentDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    bankSwiftCode: 'KAKTINBB001',
    customDeclarationRemarks: '100% Mulberry Silk Woven Piece Goods. Export under Duty Drawback.'
  });
  const [loading, setLoading] = useState(false);

  const totalForeignValue = Number(form.contractedMeters || 0) * Number(form.pricePerMeterForeignCurrency || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createExportContract({
        ...form,
        contractedMeters: Number(form.contractedMeters),
        pricePerMeterForeignCurrency: Number(form.pricePerMeterForeignCurrency)
      });
      alert(`Global Export Contract Generated!\nContract Code: ${res.data.exportContractNumber}\nTotal: ${form.tradeCurrency} ${res.data.totalContractValueForeign}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to create export contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exp-modal-overlay">
      <div className="exp-modal-content">
        <h2>Draft Global B2B Export Contract & LC Indent</h2>
        <p className="modal-sub">Generate international trade order, Letter of Credit (LC) specification and shipping proforma</p>

        <form onSubmit={handleSubmit}>
          <div className="exp-form-row">
            <div className="form-group flex-1">
              <label>International Buyer Brand</label>
              <input
                type="text"
                value={form.buyerCompanyName}
                onChange={(e) => setForm({ ...form, buyerCompanyName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Destination Country</label>
              <input
                type="text"
                value={form.buyerCountry}
                onChange={(e) => setForm({ ...form, buyerCountry: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="exp-form-row">
            <div className="form-group flex-1">
              <label>Commissioned Export Fabric Quality</label>
              <select
                value={form.fabricProductName}
                onChange={(e) => setForm({ ...form, fabricProductName: e.target.value })}
                required
              >
                {fabrics.map((f) => (
                  <option key={f.id} value={f.name || f.fabricName}>{f.itemCode || f.qualityCode} — {f.name || f.fabricName}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Contracted Volume (Meters)</label>
              <input
                type="number"
                step="100"
                value={form.contractedMeters}
                onChange={(e) => setForm({ ...form, contractedMeters: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="exp-pricing-box">
            <h4>Commercial Pricing & Currency Realization</h4>
            <div className="exp-form-grid-3">
              <div className="form-group">
                <label>Billing Currency</label>
                <select value={form.tradeCurrency} onChange={(e) => setForm({ ...form, tradeCurrency: e.target.value })}>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Export Rate / Meter</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.pricePerMeterForeignCurrency}
                  onChange={(e) => setForm({ ...form, pricePerMeterForeignCurrency: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Value ({form.tradeCurrency})</label>
                <input type="text" value={`${form.tradeCurrency} ${totalForeignValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} readOnly />
              </div>
            </div>
          </div>

          <div className="exp-shipping-box">
            <h4>International Shipping & Incoterms</h4>
            <div className="exp-form-grid-4">
              <div className="form-group">
                <label>Incoterms</label>
                <select value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })}>
                  <option value="FOB_CHENNAI">FOB (Free On Board Chennai)</option>
                  <option value="CIF_HAMBURG">CIF (Cost, Insurance, Freight)</option>
                  <option value="CIF_NEW_YORK">CIF (Port of New York)</option>
                  <option value="EX_MILL">EXW (Ex-Factory Mill Gate)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Port of Loading</label>
                <input value={form.portOfLoading} onChange={(e) => setForm({ ...form, portOfLoading: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Port of Discharge</label>
                <input value={form.portOfDischarge} onChange={(e) => setForm({ ...form, portOfDischarge: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Container Mode</label>
                <select value={form.shippingContainerMode} onChange={(e) => setForm({ ...form, shippingContainerMode: e.target.value })}>
                  <option value="20FT_FCL">20 Ft Full Container (FCL)</option>
                  <option value="40FT_HQ">40 Ft High Cube (HQ)</option>
                  <option value="LCL_AIR_CARGO">Air Freight Express (LCL)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="exp-form-row">
            <div className="form-group flex-1">
              <label>Letter of Credit (LC) Number</label>
              <input value={form.lcNumber} onChange={(e) => setForm({ ...form, lcNumber: e.target.value })} placeholder="e.g. LC-HSBC-8890" required />
            </div>
            <div className="form-group flex-1">
              <label>Issuing Overseas Bank</label>
              <input value={form.lcIssuingBank} onChange={(e) => setForm({ ...form, lcIssuingBank: e.target.value })} required />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Issuing...' : 'Authorize Global Export Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewExportContractModal;