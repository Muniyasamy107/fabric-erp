import React, { useState } from 'react';
import { createBoilerLog } from '../../services/boilerService';
import './NewBoilerLogModal.css';

const NewBoilerLogModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    logDate: new Date().toISOString().slice(0, 10),
    shiftTiming: 'SHIFT_A_MORNING',
    boilerUnitCode: 'BOILER-THERMAX-01 (6 TPH)',
    totalSteamGeneratedTons: 48.5,
    averageSteamPressureBar: 10.5,
    averageSteamTempCelsius: 185,
    fuelTypeUsed: 'BIOMASS_BRIQUETTES',
    fuelConsumedTons: 11.5,
    dyeHouseSteamTons: 31.5,
    stenterFinishingSteamTons: 9.8,
    sizingYarnSteamTons: 7.2,
    feedWaterHardnessPpm: 2.0,
    boilerWaterPh: 11.0,
    blowdownTdsPpm: 3200.0,
    boilerAttendantEngineer: 'Certified Boiler Engineer Natarajan (1st Class)',
    logRemarks: 'Steam header pressure stable at 10.5 Bar. Softener plant salt dosing completed.'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createBoilerLog({
        ...form,
        totalSteamGeneratedTons: Number(form.totalSteamGeneratedTons),
        averageSteamPressureBar: Number(form.averageSteamPressureBar),
        averageSteamTempCelsius: Number(form.averageSteamTempCelsius),
        fuelConsumedTons: Number(form.fuelConsumedTons),
        dyeHouseSteamTons: Number(form.dyeHouseSteamTons),
        stenterFinishingSteamTons: Number(form.stenterFinishingSteamTons),
        sizingYarnSteamTons: Number(form.sizingYarnSteamTons),
        feedWaterHardnessPpm: Number(form.feedWaterHardnessPpm),
        boilerWaterPh: Number(form.boilerWaterPh),
        blowdownTdsPpm: Number(form.blowdownTdsPpm)
      });
      alert(`Boiler Thermal Generation Logged Successfully!\nEvaporation Ratio: ${res.data.evaporationRatio} kg steam / kg fuel`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to log boiler steam data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="boiler-modal-overlay">
      <div className="boiler-modal-content">
        <h2>Log Daily Boiler Steam Generation & Biomass Fuel</h2>
        <p className="modal-sub">Record steam tonnage, header pressure, fuel consumption and water softener parameters</p>

        <form onSubmit={handleSubmit}>
          <div className="boiler-form-row">
            <div className="form-group flex-1">
              <label>Log Date</label>
              <input
                type="date"
                value={form.logDate}
                onChange={(e) => setForm({ ...form, logDate: e.target.value })}
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

          <div className="boiler-section-card">
            <h4>1. Steam Generation & Header Pressure Parameters</h4>
            <div className="boiler-form-grid-3">
              <div className="form-group">
                <label>Total Steam Generated (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.totalSteamGeneratedTons}
                  onChange={(e) => setForm({ ...form, totalSteamGeneratedTons: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Avg Header Pressure (Bar)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.averageSteamPressureBar}
                  onChange={(e) => setForm({ ...form, averageSteamPressureBar: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Steam Temperature (°C)</label>
                <input
                  type="number"
                  value={form.averageSteamTempCelsius}
                  onChange={(e) => setForm({ ...form, averageSteamTempCelsius: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="boiler-section-card">
            <h4>2. Biomass Fuel Consumption & Combustion Feed</h4>
            <div className="boiler-form-grid-3">
              <div className="form-group">
                <label>Fuel Class</label>
                <select value={form.fuelTypeUsed} onChange={(e) => setForm({ ...form, fuelTypeUsed: e.target.value })}>
                  <option value="BIOMASS_BRIQUETTES">Sawdust Biomass Briquettes</option>
                  <option value="WOOD_CHIPS">Casuarina Hardwood Chips</option>
                  <option value="IMPORTED_COAL">Low Ash Indonesian Coal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuel Consumed (Metric Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.fuelConsumedTons}
                  onChange={(e) => setForm({ ...form, fuelConsumedTons: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Boiler Unit Plant</label>
                <input
                  type="text"
                  value={form.boilerUnitCode}
                  onChange={(e) => setForm({ ...form, boilerUnitCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="boiler-section-card">
            <h4>3. Departmental Steam Flow Metering Allocation (Tons)</h4>
            <div className="boiler-form-grid-3">
              <div className="form-group">
                <label>Dye House Vessels (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dyeHouseSteamTons}
                  onChange={(e) => setForm({ ...form, dyeHouseSteamTons: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stenter Finishing (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.stenterFinishingSteamTons}
                  onChange={(e) => setForm({ ...form, stenterFinishingSteamTons: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sizing Machine Cylinders (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.sizingYarnSteamTons}
                  onChange={(e) => setForm({ ...form, sizingYarnSteamTons: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="boiler-form-row">
            <div className="form-group flex-1">
              <label>Feed Water Hardness (ppm)</label>
              <input
                type="number"
                step="0.1"
                value={form.feedWaterHardnessPpm}
                onChange={(e) => setForm({ ...form, feedWaterHardnessPpm: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Boiler Water pH (10.5-11.5)</label>
              <input
                type="number"
                step="0.1"
                value={form.boilerWaterPh}
                onChange={(e) => setForm({ ...form, boilerWaterPh: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Certified Boiler Engineer</label>
              <input
                type="text"
                value={form.boilerAttendantEngineer}
                onChange={(e) => setForm({ ...form, boilerAttendantEngineer: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Evaluating...' : 'Authorize Boiler Steam Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBoilerLogModal;