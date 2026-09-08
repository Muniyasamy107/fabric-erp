import React, { useState } from 'react';
import { submitQualityInspection } from '../../services/qualityService';
import './NewInspectionModal.css';

const NewInspectionModal = ({ jobs = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    productionJobId: '',
    batchLotNumber: '',
    fabricProductName: '',
    weaveType: 'Twill Weave',
    standardWidthInches: 58.0,
    totalInspectedMeters: 100.0,
    minorDefectsCount: 2,
    majorDefectsCount: 0,
    testedGsm: 240,
    shrinkagePercentage: 1.2,
    colorFastnessRating: '4-5 (Excellent)',
    tensileStrengthNewton: 480.0,
    qcInspectorName: 'Chief QC Engineer',
    remarks: 'Surface finish lustrous, zero warp tension breaks.'
  });
  const [loading, setLoading] = useState(false);

  const handleJobSelect = (jobId) => {
    const matched = jobs.find((j) => String(j.id) === String(jobId));
    if (matched) {
      setForm({
        ...form,
        productionJobId: matched.id,
        batchLotNumber: matched.batchNumber,
        fabricProductName: matched.fabricProductName,
        totalInspectedMeters: matched.producedMeters || 100.0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitQualityInspection({
        ...form,
        standardWidthInches: Number(form.standardWidthInches),
        totalInspectedMeters: Number(form.totalInspectedMeters),
        minorDefectsCount: Number(form.minorDefectsCount),
        majorDefectsCount: Number(form.majorDefectsCount),
        testedGsm: Number(form.testedGsm),
        shrinkagePercentage: Number(form.shrinkagePercentage),
        tensileStrengthNewton: Number(form.tensileStrengthNewton)
      });
      alert(`QC Inspection Completed!\nVerdict: ${res.data.finalVerdict}\n4-Point Score: ${res.data.fourPointScore}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to submit inspection report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qc-modal-overlay">
      <div className="qc-modal-content">
        <h2>Fabric Inspection Table (ASTM 4-Point System)</h2>
        <p className="qc-modal-sub">Log defect points, physical lab test measurements, and certify fabric batch</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Production Batch Lot to Inspect</label>
            <select
              value={form.productionJobId}
              onChange={(e) => handleJobSelect(e.target.value)}
              required
            >
              <option value="">-- Choose Loom Production Batch --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.batchNumber} — {j.fabricProductName} ({j.producedMeters || j.targetMeters}m woven)
                </option>
              ))}
            </select>
          </div>

          <div className="qc-form-row">
            <div className="form-group flex-1">
              <label>Inspected Meterage (m)</label>
              <input
                type="number"
                step="0.1"
                value={form.totalInspectedMeters}
                onChange={(e) => setForm({ ...form, totalInspectedMeters: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Fabric Width (Panna in Inches)</label>
              <input
                type="number"
                step="0.5"
                value={form.standardWidthInches}
                onChange={(e) => setForm({ ...form, standardWidthInches: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="qc-defects-box">
            <h4>1. Visual Defect Point Counter (4-Point Standard)</h4>
            <div className="qc-form-row">
              <div className="form-group flex-1">
                <label>Minor Flaws (1-2 Pts: Weft Slubs, Minor Knots)</label>
                <input
                  type="number"
                  min="0"
                  value={form.minorDefectsCount}
                  onChange={(e) => setForm({ ...form, minorDefectsCount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label>Major Flaws (3-4 Pts: Holes, Warp Streaks, Oil Stains)</label>
                <input
                  type="number"
                  min="0"
                  value={form.majorDefectsCount}
                  onChange={(e) => setForm({ ...form, majorDefectsCount: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="qc-lab-box">
            <h4>2. Mill Physical Testing Lab Metrics</h4>
            <div className="qc-form-grid-4">
              <div className="form-group">
                <label>Actual GSM</label>
                <input
                  type="number"
                  value={form.testedGsm}
                  onChange={(e) => setForm({ ...form, testedGsm: e.target.value })}
                  placeholder="e.g. 240"
                  required
                />
              </div>
              <div className="form-group">
                <label>Shrinkage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.shrinkagePercentage}
                  onChange={(e) => setForm({ ...form, shrinkagePercentage: e.target.value })}
                  placeholder="e.g. 1.2"
                />
              </div>
              <div className="form-group">
                <label>Tensile (N)</label>
                <input
                  type="number"
                  step="1"
                  value={form.tensileStrengthNewton}
                  onChange={(e) => setForm({ ...form, tensileStrengthNewton: e.target.value })}
                  placeholder="e.g. 450"
                />
              </div>
              <div className="form-group">
                <label>Color Fastness</label>
                <select
                  value={form.colorFastnessRating}
                  onChange={(e) => setForm({ ...form, colorFastnessRating: e.target.value })}
                >
                  <option value="4-5 (Excellent)">4-5 (Excellent)</option>
                  <option value="3-4 (Good)">3-4 (Good)</option>
                  <option value="2-3 (Fair)">2-3 (Fair)</option>
                  <option value="1 (Poor)">1 (Poor)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="qc-form-row">
            <div className="form-group flex-1">
              <label>QC Inspector / Testing Engineer Name</label>
              <input
                type="text"
                value={form.qcInspectorName}
                onChange={(e) => setForm({ ...form, qcInspectorName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Quality Auditor Observations & Remarks</label>
              <input
                type="text"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Evaluating...' : 'Certify & Generate Quality Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInspectionModal;