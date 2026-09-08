import React, { useState } from 'react';
import { createCadDesign } from '../../services/cadDesignService';
import './NewSampleDesignModal.css';

const NewSampleDesignModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    designName: 'Imperial Silk Herringbone Twill',
    targetBuyerBrand: 'Armani Group Milan',
    seasonCollection: 'Fall/Winter Milano 2026',
    weaveType: 'HERRINGBONE_TWILL',
    numberOfHealdShafts: 16,
    endsPerInchEpi: 110,
    picksPerInchPpi: 84,
    warpYarnSpec: 'Mulberry Silk 20/22D (Midnight Navy)',
    weftYarnSpec: 'Cashmere Wool 2/80s (Champagne Gold)',
    colorRepeatSequence: '48 Ends Navy + 6 Ends Gold + 48 Ends Navy',
    sampleYardageRequiredMeters: 10.0,
    cadTextileDesignerName: 'Lead CAD Designer Ananya (NIFT)',
    buyerFeedbackComments: 'Sample requested for Milan Fashion Week preview.'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCadDesign({
        ...form,
        numberOfHealdShafts: Number(form.numberOfHealdShafts),
        endsPerInchEpi: Number(form.endsPerInchEpi),
        picksPerInchPpi: Number(form.picksPerInchPpi),
        sampleYardageRequiredMeters: Number(form.sampleYardageRequiredMeters)
      });
      alert(`CAD Weave Sample Concept Created!\nDesign Code: ${res.data.designCode}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to create CAD sample concept');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cad-modal-overlay">
      <div className="cad-modal-content">
        <h2>Draft New CAD Weave Design & Sample Concept</h2>
        <p className="modal-sub">Define weave architecture, Dobby shaft lifting plan, yarn color repeat and buyer yardage</p>

        <form onSubmit={handleSubmit}>
          <div className="cad-form-row">
            <div className="form-group flex-1">
              <label>Concept Design Name</label>
              <input
                value={form.designName}
                onChange={(e) => setForm({ ...form, designName: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Target Buyer / Fashion House</label>
              <input
                value={form.targetBuyerBrand}
                onChange={(e) => setForm({ ...form, targetBuyerBrand: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="cad-form-row">
            <div className="form-group flex-1">
              <label>Weave Architecture Pattern</label>
              <select value={form.weaveType} onChange={(e) => setForm({ ...form, weaveType: e.target.value })}>
                <option value="HERRINGBONE_TWILL">Herringbone Pointed Twill</option>
                <option value="SATIN_STRIPE">Satin Pinstripe Damask</option>
                <option value="GLEN_PLAID_CHECK">Prince of Wales Check</option>
                <option value="DOBBY_GEOMETRIC">Dobby Geometric</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Season Collection</label>
              <input
                value={form.seasonCollection}
                onChange={(e) => setForm({ ...form, seasonCollection: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="cad-section-card">
            <h4>Dobby Loom Construction (EPI × PPI)</h4>
            <div className="cad-form-grid-3">
              <div className="form-group">
                <label>Heald Shafts</label>
                <input
                  type="number"
                  value={form.numberOfHealdShafts}
                  onChange={(e) => setForm({ ...form, numberOfHealdShafts: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Warp Density (EPI)</label>
                <input
                  type="number"
                  value={form.endsPerInchEpi}
                  onChange={(e) => setForm({ ...form, endsPerInchEpi: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weft Density (PPI)</label>
                <input
                  type="number"
                  value={form.picksPerInchPpi}
                  onChange={(e) => setForm({ ...form, picksPerInchPpi: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="cad-form-row">
            <div className="form-group flex-1">
              <label>Sample Yardage (Meters)</label>
              <input
                type="number"
                step="0.5"
                value={form.sampleYardageRequiredMeters}
                onChange={(e) => setForm({ ...form, sampleYardageRequiredMeters: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Lead CAD Designer</label>
              <input
                value={form.cadTextileDesignerName}
                onChange={(e) => setForm({ ...form, cadTextileDesignerName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Creating...' : 'Initialize Sample Development'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSampleDesignModal;