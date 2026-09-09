import React, { useState } from 'react';
import { createDyeRecipe } from '../../services/dyeHouseService';
import { FlaskConical } from 'lucide-react';
import './NewDyeRecipeModal.css';

const NewDyeRecipeModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    shadeName: 'Midnight Navy',
    pantoneTcxCode: '19-4052 TCX',
    colorHex: '#1B2A4A',
    dyeClass: 'Reactive Dye for Cotton/Silk',
    liquorRatio: '1:8',
    dyeingTemperatureCelsius: 85,
    deltaETolerance: 0.45,
    masterDyerName: 'Chief Colorist Rangasamy',
    chemicalFormulationRecipe: `1. Dyestuff Navy Blue 3R: 2.45% on weight of fabric (o.w.f)\n2. Dyestuff Royal Brilliant Blue: 0.85% o.w.f\n3. Glauber's Salt (Sodium Sulfate): 45.0 g/L (Added at 40°C)\n4. Soda Ash (Sodium Carbonate): 18.0 g/L (Dosing over 30 mins at 60°C)\n5. Levelling & Wetting Aux: 1.5 g/L\n6. Acetic Acid Neutralisation at 85°C`
  });
  const [loading, setLoading] = useState(false);

  // Safe color validator for HTML5 color input
  const isValidHex = (hex) => /^#[0-9A-Fa-f]{6}$/.test(hex);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createDyeRecipe({
        ...form,
        dyeingTemperatureCelsius: Number(form.dyeingTemperatureCelsius),
        deltaETolerance: Number(form.deltaETolerance)
      });
      alert(`Dye Recipe Formulated Successfully!\nRecipe Code: ${res.data.recipeCode}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to create dye recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dye-modal-overlay">
      <div className="dye-modal-content">
        <h2><FlaskConical size={20} color="#d4af37" /> Formulate New Pantone Dye Recipe</h2>
        <p className="modal-sub">Create master chemical formulation, liquor ratio, and spectrophotometer tolerance</p>

        <form onSubmit={handleSubmit}>
          <div className="dye-form-row">
            <div className="form-group flex-1">
              <label>Shade / Color Name *</label>
              <input
                value={form.shadeName}
                onChange={(e) => setForm({ ...form, shadeName: e.target.value })}
                placeholder="e.g. Midnight Navy"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Pantone TCX Standard Code *</label>
              <input
                value={form.pantoneTcxCode}
                onChange={(e) => setForm({ ...form, pantoneTcxCode: e.target.value })}
                placeholder="e.g. 19-4052 TCX"
                required
              />
            </div>
          </div>

          <div className="dye-form-row">
            <div className="form-group">
              <label>Visual Swatch Color</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={isValidHex(form.colorHex) ? form.colorHex : '#1B2A4A'}
                  onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  className="color-input-box"
                />
                <input
                  type="text"
                  value={form.colorHex}
                  onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  placeholder="#1B2A4A"
                  className="hex-text-input"
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label>Dye Chemistry Class</label>
              <select value={form.dyeClass} onChange={(e) => setForm({ ...form, dyeClass: e.target.value })}>
                <option value="Reactive Dye for Cotton/Silk">Reactive Dye (High Fastness)</option>
                <option value="Acid Dye for Pure Silk/Wool">Acid Dye (Silk & Cashmere)</option>
                <option value="Disperse Dye for Synthetics">Disperse Dye</option>
                <option value="Vat Dye for Military/Industrial">Vat Dye</option>
              </select>
            </div>
          </div>

          <div className="dye-form-grid-3">
            <div className="form-group">
              <label>Liquor Ratio (M:L)</label>
              <input
                value={form.liquorRatio}
                onChange={(e) => setForm({ ...form, liquorRatio: e.target.value })}
                placeholder="e.g. 1:8"
                required
              />
            </div>
            <div className="form-group">
              <label>Peak Dye Temp (°C)</label>
              <input
                type="number"
                value={form.dyeingTemperatureCelsius}
                onChange={(e) => setForm({ ...form, dyeingTemperatureCelsius: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Delta E Tolerance (ΔE)</label>
              <input
                type="number"
                step="0.05"
                value={form.deltaETolerance}
                onChange={(e) => setForm({ ...form, deltaETolerance: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Chemical & Dyestuff Formulation Recipe (g/L or % o.w.f)</label>
            <textarea
              rows="5"
              value={form.chemicalFormulationRecipe}
              onChange={(e) => setForm({ ...form, chemicalFormulationRecipe: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Master Dyer / Lab Chemist Name</label>
            <input
              value={form.masterDyerName}
              onChange={(e) => setForm({ ...form, masterDyerName: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Saving Recipe...' : 'Save & Issue Dye Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDyeRecipeModal;