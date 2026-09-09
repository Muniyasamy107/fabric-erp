import React, { useState } from 'react';
import { calculateCostSheet } from '../../services/costingService';
import './NewCostSheetModal.css';

const NewCostSheetModal = ({ fabrics = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    qualityCode: 'SATIN-SILK-900',
    fabricName: fabrics[0]?.name || 'Cotton Poplin 60s x 60s',
    weaveType: 'Satin Weave',
    reedWidthInches: 62.0,
    finishedWidthInches: 58.0,
    totalWarpEnds: 4800,
    warpCountNe: '80/1 Ne Combed Giza',
    warpCrimpPercentage: 6.5,
    picksPerInch: 72,
    weftCountNe: '60/1 Ne Compact',
    weftCrimpPercentage: 4.5,
    calculatedWarpWeightGrams: 85.0,
    calculatedWeftWeightGrams: 65.0,
    calculatedTotalGsm: 150.0,
    warpYarnCostPerMeter: 120.0,
    weftYarnCostPerMeter: 95.0,
    sizingChemicalCostPerMeter: 12.0,
    weavingLoomCostPerMeter: 45.0,
    dyeingAndFinishingCostPerMeter: 65.0,
    millOverheadsPerMeter: 20.0,
    targetProfitMarginPct: 20.0,
    preparedByMerchandiser: 'Chief Costing Merchandiser',
    remarks: 'Quotation calculated for 10,000m bulk export contract.'
  });
  const [loading, setLoading] = useState(false);

  const handleFabricSelect = (fabId) => {
    const matched = fabrics.find((f) => String(f.id) === String(fabId));
    if (matched) {
      setForm({
        ...form,
        qualityCode: matched.itemCode || matched.qualityCode,
        fabricName: matched.name || matched.fabricName,
        finishedWidthInches: matched.standardWidthInches || 58.0
      });
    }
  };

  const totalCostEstimate =
    Number(form.warpYarnCostPerMeter || 0) +
    Number(form.weftYarnCostPerMeter || 0) +
    Number(form.sizingChemicalCostPerMeter || 0) +
    Number(form.weavingLoomCostPerMeter || 0) +
    Number(form.dyeingAndFinishingCostPerMeter || 0) +
    Number(form.millOverheadsPerMeter || 0);

  const exMillPriceEstimate = totalCostEstimate * (1 + Number(form.targetProfitMarginPct || 20) / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await calculateCostSheet({
        ...form,
        reedWidthInches: Number(form.reedWidthInches),
        finishedWidthInches: Number(form.finishedWidthInches),
        totalWarpEnds: Number(form.totalWarpEnds),
        warpCrimpPercentage: Number(form.warpCrimpPercentage),
        picksPerInch: Number(form.picksPerInch),
        weftCrimpPercentage: Number(form.weftCrimpPercentage),
        calculatedWarpWeightGrams: Number(form.calculatedWarpWeightGrams),
        calculatedWeftWeightGrams: Number(form.calculatedWeftWeightGrams),
        calculatedTotalGsm: Number(form.calculatedTotalGsm),
        warpYarnCostPerMeter: Number(form.warpYarnCostPerMeter),
        weftYarnCostPerMeter: Number(form.weftYarnCostPerMeter),
        sizingChemicalCostPerMeter: Number(form.sizingChemicalCostPerMeter),
        weavingLoomCostPerMeter: Number(form.weavingLoomCostPerMeter),
        dyeingAndFinishingCostPerMeter: Number(form.dyeingAndFinishingCostPerMeter),
        millOverheadsPerMeter: Number(form.millOverheadsPerMeter),
        targetProfitMarginPct: Number(form.targetProfitMarginPct)
      });
      alert(`Costing Sheet Calculated!\nNet COP: ₹${res.data.netProductionCostPerMeter}/m\nEx-Mill Price: ₹${res.data.recommendedExMillPrice}/m`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to calculate costing sheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cost-modal-overlay">
      <div className="cost-modal-content">
        <h2>Fabric Cost of Production (COP) & BOM Calculator</h2>
        <p className="modal-sub">Calculate exact yarn consumption, loom conversion cost per pick and ex-mill price</p>

        <form onSubmit={handleSubmit}>
          <div className="cost-form-row">
            <div className="form-group flex-1">
              <label>Select Fabric Quality from Catalog</label>
              <select onChange={(e) => handleFabricSelect(e.target.value)} required>
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>{f.itemCode || f.qualityCode} — {f.name || f.fabricName}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Weave Structure</label>
              <input value={form.weaveType} onChange={(e) => setForm({ ...form, weaveType: e.target.value })} required />
            </div>
          </div>

          <div className="cost-section-card">
            <h4>1. Weave Construction & Yarn Technical Parameters</h4>
            <div className="cost-form-grid-4">
              <div className="form-group">
                <label>Total Warp Ends</label>
                <input type="number" value={form.totalWarpEnds} onChange={(e) => setForm({ ...form, totalWarpEnds: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Warp Count Specification</label>
                <input value={form.warpCountNe} onChange={(e) => setForm({ ...form, warpCountNe: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Weft Density (Picks/Inch)</label>
                <input type="number" value={form.picksPerInch} onChange={(e) => setForm({ ...form, picksPerInch: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Weft Count Specification</label>
                <input value={form.weftCountNe} onChange={(e) => setForm({ ...form, weftCountNe: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="cost-section-card">
            <h4>2. Cost Component Breakdown per Meter (INR)</h4>
            <div className="cost-form-grid-3">
              <div className="form-group">
                <label>Warp Yarn Cost (₹/m)</label>
                <input type="number" step="0.1" value={form.warpYarnCostPerMeter} onChange={(e) => setForm({ ...form, warpYarnCostPerMeter: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Weft Yarn Cost (₹/m)</label>
                <input type="number" step="0.1" value={form.weftYarnCostPerMeter} onChange={(e) => setForm({ ...form, weftYarnCostPerMeter: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Sizing Chemical Cost (₹/m)</label>
                <input type="number" step="0.1" value={form.sizingChemicalCostPerMeter} onChange={(e) => setForm({ ...form, sizingChemicalCostPerMeter: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Loom Weaving Labour/m (₹)</label>
                <input type="number" step="0.1" value={form.weavingLoomCostPerMeter} onChange={(e) => setForm({ ...form, weavingLoomCostPerMeter: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Dyeing & Stenter Finish (₹/m)</label>
                <input type="number" step="0.1" value={form.dyeingAndFinishingCostPerMeter} onChange={(e) => setForm({ ...form, dyeingAndFinishingCostPerMeter: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Mill Overheads / Power (₹/m)</label>
                <input type="number" step="0.1" value={form.millOverheadsPerMeter} onChange={(e) => setForm({ ...form, millOverheadsPerMeter: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="cost-pricing-summary-card">
            <div className="summary-col">
              <span>Estimated Factory COP:</span>
              <strong className="cop-val">₹{totalCostEstimate.toFixed(2)} / meter</strong>
            </div>

            <div className="margin-input-col">
              <label>Target Profit Margin (%):</label>
              <input
                type="number"
                step="0.5"
                value={form.targetProfitMarginPct}
                onChange={(e) => setForm({ ...form, targetProfitMarginPct: e.target.value })}
                required
              />
            </div>

            <div className="summary-col">
              <span>Recommended Ex-Mill Price:</span>
              <strong className="ex-price-val">₹{exMillPriceEstimate.toFixed(2)} / meter</strong>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Evaluating...' : 'Save Costing Tech Sheet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCostSheetModal;