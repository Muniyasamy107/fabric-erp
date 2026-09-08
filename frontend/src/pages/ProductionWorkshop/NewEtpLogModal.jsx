import React, { useState } from 'react';
import { createEtpLog } from '../../services/etpService';
import './NewEtpLogModal.css';

const NewEtpLogModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    auditDate: new Date().toISOString().slice(0, 10),
    shiftTiming: 'SHIFT_A_MORNING',
    rawEffluentInflowKld: 150.0,
    recycledPermeateWaterKld: 140.0,
    testedPhValue: 7.2,
    inletTdsPpm: 6800.0,
    treatedRoTdsPpm: 120.0,
    chemicalOxygenDemandCod: 38.0,
    biochemicalOxygenDemandBod: 11.0,
    totalSuspendedSolidsTss: 6.5,
    drySludgeGeneratedKg: 180.0,
    etpPowerConsumedKwh: 340.0,
    environmentalChemistName: 'Chemist Dr. Saravanan (M.Sc)',
    observations: 'RO Membrane flux steady. 100% permeate water routed back to Jet Dyeing machine tanks.'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createEtpLog({
        ...form,
        rawEffluentInflowKld: Number(form.rawEffluentInflowKld),
        recycledPermeateWaterKld: Number(form.recycledPermeateWaterKld),
        testedPhValue: Number(form.testedPhValue),
        inletTdsPpm: Number(form.inletTdsPpm),
        treatedRoTdsPpm: Number(form.treatedRoTdsPpm),
        chemicalOxygenDemandCod: Number(form.chemicalOxygenDemandCod),
        biochemicalOxygenDemandBod: Number(form.biochemicalOxygenDemandBod),
        totalSuspendedSolidsTss: Number(form.totalSuspendedSolidsTss),
        drySludgeGeneratedKg: Number(form.drySludgeGeneratedKg),
        etpPowerConsumedKwh: Number(form.etpPowerConsumedKwh)
      });
      alert(`ETP & Water Quality Audit Logged Successfully!\nStatus: ${res.data.zldComplianceStatus}\nRecovery: ${res.data.waterRecoveryPercentage}%`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to log ETP compliance data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="etp-modal-overlay">
      <div className="etp-modal-content">
        <h2>Log Daily ETP Effluent & Water Recycling Audit</h2>
        <p className="modal-sub">Record RO membrane permeate flow, water testing parameters and Zero Liquid Discharge (ZLD) metrics</p>

        <form onSubmit={handleSubmit}>
          <div className="etp-form-row">
            <div className="form-group flex-1">
              <label>Audit Date</label>
              <input
                type="date"
                value={form.auditDate}
                onChange={(e) => setForm({ ...form, auditDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Shift Timing</label>
              <select value={form.shiftTiming} onChange={(e) => setForm({ ...form, shiftTiming: e.target.value })}>
                <option value="SHIFT_A_MORNING">Shift A (Morning 06:00 - 14:00)</option>
                <option value="SHIFT_B_EVENING">Shift B (Evening 14:00 - 22:00)</option>
                <option value="SHIFT_C_NIGHT">Shift C (Night 22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div className="etp-section-card">
            <h4>1. Water Inflow & Permeate Recycling Volumes</h4>
            <div className="etp-form-grid-3">
              <div className="form-group">
                <label>Raw Dye Inflow (KLD)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.rawEffluentInflowKld}
                  onChange={(e) => setForm({ ...form, rawEffluentInflowKld: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Treated Recycled Water (KLD)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.recycledPermeateWaterKld}
                  onChange={(e) => setForm({ ...form, recycledPermeateWaterKld: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Filter Sludge (KG)</label>
                <input
                  type="number"
                  step="1"
                  value={form.drySludgeGeneratedKg}
                  onChange={(e) => setForm({ ...form, drySludgeGeneratedKg: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="etp-section-card">
            <h4>2. Environmental Laboratory Water Quality Metrics</h4>
            <div className="etp-form-grid-4">
              <div className="form-group">
                <label>Tested pH Level (6.5-8.0)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.testedPhValue}
                  onChange={(e) => setForm({ ...form, testedPhValue: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>RO Output TDS (ppm)</label>
                <input
                  type="number"
                  step="1"
                  value={form.treatedRoTdsPpm}
                  onChange={(e) => setForm({ ...form, treatedRoTdsPpm: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>COD (mg/L - Max 50)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.chemicalOxygenDemandCod}
                  onChange={(e) => setForm({ ...form, chemicalOxygenDemandCod: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>BOD (mg/L - Max 15)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.biochemicalOxygenDemandBod}
                  onChange={(e) => setForm({ ...form, biochemicalOxygenDemandBod: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="etp-form-row">
            <div className="form-group flex-1">
              <label>Environmental Chemist / Lab Officer</label>
              <input
                type="text"
                value={form.environmentalChemistName}
                onChange={(e) => setForm({ ...form, environmentalChemistName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>ETP Power Consumption (kWh)</label>
              <input
                type="number"
                value={form.etpPowerConsumedKwh}
                onChange={(e) => setForm({ ...form, etpPowerConsumedKwh: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Chemist Observations & ZLD Log Notes</label>
            <input
              type="text"
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Evaluating...' : 'Authorize ETP Compliance Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEtpLogModal;