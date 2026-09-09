import React, { useState } from 'react';
import { createBeamJob } from '../../services/warpingSizingService';
import './NewBeamModal.css';

const NewBeamModal = ({ fabrics = [], yarns = [], looms = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    beamNumber: '',
    qualityCode: 'SATIN-SILK-900',
    fabricProductName: fabrics[0]?.name || 'Cotton Poplin 60s x 60s',
    yarnLotNumber: yarns[0]?.yarnLotNumber || 'YARN-LOT-8821',
    yarnCountSpecification: 'Cotton 80/1 Ne Combed Giza',
    totalWarpEnds: 4800,
    beamLengthMeters: 1500.0,
    flangeWidthInches: 68.0,
    sizingChemicalMix: 'Maize Starch (8%) + PVA Binder + Wax Emulsion',
    sizePickUpPercentage: 8.5,
    moisturePercentage: 6.5,
    dryingCylinderTempCelsius: 115,
    assignedLoomNumber: looms[0]?.loomNumber || 'LOOM-A01',
    supervisorName: 'Warping Master Arumugam'
  });
  const [loading, setLoading] = useState(false);

  const handleFabricSelect = (fabId) => {
    const matched = fabrics.find((f) => String(f.id) === String(fabId));
    if (matched) {
      setForm({
        ...form,
        qualityCode: matched.itemCode || matched.qualityCode,
        fabricProductName: matched.name || matched.fabricName
      });
    }
  };

  const handleYarnSelect = (yarnId) => {
    const matched = yarns.find((y) => String(y.id) === String(yarnId));
    if (matched) {
      setForm({
        ...form,
        yarnLotNumber: matched.yarnLotNumber,
        yarnCountSpecification: matched.yarnCountSpecification
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createBeamJob({
        ...form,
        totalWarpEnds: Number(form.totalWarpEnds),
        beamLengthMeters: Number(form.beamLengthMeters),
        flangeWidthInches: Number(form.flangeWidthInches),
        sizePickUpPercentage: Number(form.sizePickUpPercentage),
        moisturePercentage: Number(form.moisturePercentage),
        dryingCylinderTempCelsius: Number(form.dryingCylinderTempCelsius)
      });
      alert(`Weaver's Loom Beam Prepared Successfully!\nBeam Code: ${res.data.beamNumber}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to prepare weaver beam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beam-modal-overlay">
      <div className="beam-modal-content">
        <h2>Prepare New Weaver's Loom Beam</h2>
        <p className="modal-sub">Direct warping creel setup, sizing chemical starch mix and weaver beam winding</p>

        <form onSubmit={handleSubmit}>
          <div className="beam-form-row">
            <div className="form-group flex-1">
              <label>Target Woven Fabric Quality</label>
              <select onChange={(e) => handleFabricSelect(e.target.value)} required>
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>{f.itemCode || f.qualityCode} — {f.name || f.fabricName}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Source Yarn Cone Lot (Creel Supply)</label>
              <select onChange={(e) => handleYarnSelect(e.target.value)} required>
                {yarns.map((y) => (
                  <option key={y.id} value={y.id}>{y.yarnLotNumber} ({y.yarnCountSpecification})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="beam-form-grid-3">
            <div className="form-group">
              <label>Total Warp Ends (Threads)</label>
              <input
                type="number"
                value={form.totalWarpEnds}
                onChange={(e) => setForm({ ...form, totalWarpEnds: e.target.value })}
                placeholder="e.g. 4800"
                required
              />
            </div>
            <div className="form-group">
              <label>Warp Wound Length (Meters)</label>
              <input
                type="number"
                step="10"
                value={form.beamLengthMeters}
                onChange={(e) => setForm({ ...form, beamLengthMeters: e.target.value })}
                placeholder="e.g. 1500"
                required
              />
            </div>
            <div className="form-group">
              <label>Beam Flange Width (Inches)</label>
              <input
                type="number"
                step="0.5"
                value={form.flangeWidthInches}
                onChange={(e) => setForm({ ...form, flangeWidthInches: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="sizing-box-card">
            <h4>Sizing Machine Chemical Formulation & Drying Controls</h4>
            <div className="form-group">
              <label>Starch / Sizing Chemical Recipe</label>
              <input
                type="text"
                value={form.sizingChemicalMix}
                onChange={(e) => setForm({ ...form, sizingChemicalMix: e.target.value })}
                required
              />
            </div>

            <div className="beam-form-grid-3">
              <div className="form-group">
                <label>Size Pick-up (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.sizePickUpPercentage}
                  onChange={(e) => setForm({ ...form, sizePickUpPercentage: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Residual Moisture (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.moisturePercentage}
                  onChange={(e) => setForm({ ...form, moisturePercentage: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Drying Cyl Temp (°C)</label>
                <input
                  type="number"
                  value={form.dryingCylinderTempCelsius}
                  onChange={(e) => setForm({ ...form, dryingCylinderTempCelsius: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="beam-form-row">
            <div className="form-group flex-1">
              <label>Allocate to Weaving Loom</label>
              <select value={form.assignedLoomNumber} onChange={(e) => setForm({ ...form, assignedLoomNumber: e.target.value })}>
                {looms.map((l) => (
                  <option key={l.id} value={l.loomNumber}>{l.loomNumber} ({l.machineType})</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Warping Master / In-Charge</label>
              <input
                type="text"
                value={form.supervisorName}
                onChange={(e) => setForm({ ...form, supervisorName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Winding...' : 'Generate Weaver Beam Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBeamModal;