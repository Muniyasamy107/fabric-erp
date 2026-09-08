import React, { useState } from 'react';
import { createFinishingBatch } from '../../services/finishingService';
import './NewFinishingModal.css';

const NewFinishingModal = ({ jobs = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    productionJobId: '',
    rawBatchLotNumber: '',
    fabricProductName: '',
    machineLine: 'STENTER_LINE_01',
    finishTreatmentType: 'HIGH_LUSTER_CALENDER',
    inputGreigeMeters: 200.0,
    outputFinishedMeters: 198.0,
    stenterTemperatureCelsius: 180,
    machineSpeedMpm: 25.0,
    targetWidthInches: 58.0,
    chemicalRecipeApplied: 'Silicone Micro Emulsion (20g/L) + Luster Resin Bath',
    operatorMasterName: 'Finishing Master Selvam',
    processNotes: 'Apply silk luster calendering at 80 bar cylinder pressure.'
  });
  const [loading, setLoading] = useState(false);

  const handleJobSelect = (jobId) => {
    const matched = jobs.find((j) => String(j.id) === String(jobId));
    if (matched) {
      setForm({
        ...form,
        productionJobId: matched.id,
        rawBatchLotNumber: matched.batchNumber,
        fabricProductName: matched.fabricProductName,
        inputGreigeMeters: matched.producedMeters || 200.0,
        outputFinishedMeters: matched.producedMeters || 200.0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createFinishingBatch({
        ...form,
        inputGreigeMeters: Number(form.inputGreigeMeters),
        outputFinishedMeters: Number(form.outputFinishedMeters),
        stenterTemperatureCelsius: Number(form.stenterTemperatureCelsius),
        machineSpeedMpm: Number(form.machineSpeedMpm),
        targetWidthInches: Number(form.targetWidthInches)
      });
      alert(`Stenter Finishing Batch Queued! Batch Code: ${res.data.finishBatchNumber}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to queue finishing batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fin-modal-overlay">
      <div className="fin-modal-content">
        <h2>Queue Stenter & Calendering Finishing Batch</h2>
        <p className="fin-modal-sub">Set thermofixation temperature, chemical finish bath and target width</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Greige Woven Lot to Finish</label>
            <select
              value={form.productionJobId}
              onChange={(e) => handleJobSelect(e.target.value)}
              required
            >
              <option value="">-- Choose Loom Woven Lot --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.batchNumber} — {j.fabricProductName} ({j.producedMeters || j.targetMeters}m woven)
                </option>
              ))}
            </select>
          </div>

          <div className="fin-form-row">
            <div className="form-group flex-1">
              <label>Finishing Machine Line</label>
              <select value={form.machineLine} onChange={(e) => setForm({ ...form, machineLine: e.target.value })}>
                <option value="STENTER_LINE_01">8-Chamber Gas Stenter Line 01</option>
                <option value="ROTARY_CALENDER_02">3-Roll High Pressure Calender 02</option>
                <option value="SANFORIZER_01">Rubber Belt Zero-Shrinkage Sanforizer</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Applied Treatment Class</label>
              <select value={form.finishTreatmentType} onChange={(e) => setForm({ ...form, finishTreatmentType: e.target.value })}>
                <option value="HIGH_LUSTER_CALENDER">High-Luster Chintz / Calendering</option>
                <option value="SILICONE_SOFTENER">Super-Soft Silicone Hand Feel</option>
                <option value="HEAT_SETTING">Width Thermofixation Heat-Setting</option>
                <option value="TEFLON_WATER_REPELLENT">Teflon Water & Oil Repellent</option>
                <option value="SANFORIZING">Sanforized Pre-Shrunk Finish</option>
              </select>
            </div>
          </div>

          <div className="fin-form-grid-3">
            <div className="form-group">
              <label>Stenter Chamber Temp (°C)</label>
              <input
                type="number"
                value={form.stenterTemperatureCelsius}
                onChange={(e) => setForm({ ...form, stenterTemperatureCelsius: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Machine Speed (m/min)</label>
              <input
                type="number"
                step="1"
                value={form.machineSpeedMpm}
                onChange={(e) => setForm({ ...form, machineSpeedMpm: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Target Width (Inches)</label>
              <input
                type="number"
                step="0.5"
                value={form.targetWidthInches}
                onChange={(e) => setForm({ ...form, targetWidthInches: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Chemical Pad Liquor Formulation Applied</label>
            <input
              type="text"
              value={form.chemicalRecipeApplied}
              onChange={(e) => setForm({ ...form, chemicalRecipeApplied: e.target.value })}
              required
            />
          </div>

          <div className="fin-form-row">
            <div className="form-group flex-1">
              <label>Finishing Master in-Charge</label>
              <input
                type="text"
                value={form.operatorMasterName}
                onChange={(e) => setForm({ ...form, operatorMasterName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Input Greige Meterage (m)</label>
              <input
                type="number"
                step="0.1"
                value={form.inputGreigeMeters}
                onChange={(e) => setForm({ ...form, inputGreigeMeters: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Queueing...' : 'Start Finishing Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFinishingModal;