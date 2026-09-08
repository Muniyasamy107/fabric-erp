import React, { useState } from 'react';
import { receiveYarnStock } from '../../services/dyeHouseService';
import './NewYarnModal.css';

const NewYarnModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    yarnLotNumber: '',
    yarnCountSpecification: 'Cotton 80/1 Ne Combed Giza',
    fiberType: 'Pure Cotton',
    yarnOriginMill: 'Coimbatore Spinning Guild Ltd',
    totalWeightKg: 250.0,
    totalBagsOrBoxes: 5,
    conesPerBag: 24,
    purchasePricePerKg: 480.0,
    warehouseRackBay: 'Yarn Bay A-02',
    yarnStatus: 'RAW_GREIGE'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await receiveYarnStock({
        ...form,
        totalWeightKg: Number(form.totalWeightKg),
        totalBagsOrBoxes: Number(form.totalBagsOrBoxes),
        purchasePricePerKg: Number(form.purchasePricePerKg)
      });
      alert('Yarn Cone Consignment Inwarded to Warehouse!');
      onSuccess();
    } catch (err) {
      alert('Failed to inward yarn stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yarn-modal-overlay">
      <div className="yarn-modal-content">
        <h2>Inward Raw Yarn Cone Consignment</h2>
        <p className="modal-sub">Log spinning mill cone delivery, yarn count specification and warehouse bay</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Yarn Count & Specification</label>
            <input
              value={form.yarnCountSpecification}
              onChange={(e) => setForm({ ...form, yarnCountSpecification: e.target.value })}
              placeholder="e.g. Mulberry Silk 20/22 Denier or Cotton 60s Compact"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Fiber Class</label>
              <select value={form.fiberType} onChange={(e) => setForm({ ...form, fiberType: e.target.value })}>
                <option value="Pure Cotton">Egyptian / Giza Cotton</option>
                <option value="Mulberry Silk">Pure Mulberry Silk</option>
                <option value="Cashmere Wool">Merino / Cashmere Wool</option>
                <option value="Linen Flax">Belgian Linen Flax</option>
                <option value="Viscose / Rayon">Viscose Filament</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Spinning Mill / Origin Vendor</label>
              <input
                value={form.yarnOriginMill}
                onChange={(e) => setForm({ ...form, yarnOriginMill: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Net Inward Weight (Kilograms)</label>
              <input
                type="number"
                step="0.1"
                value={form.totalWeightKg}
                onChange={(e) => setForm({ ...form, totalWeightKg: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Cartons / Bag Count</label>
              <input
                type="number"
                value={form.totalBagsOrBoxes}
                onChange={(e) => setForm({ ...form, totalBagsOrBoxes: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Rate / Kg (₹)</label>
              <input
                type="number"
                step="0.1"
                value={form.purchasePricePerKg}
                onChange={(e) => setForm({ ...form, purchasePricePerKg: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Warehouse Storage Bay / Rack</label>
              <input
                value={form.warehouseRackBay}
                onChange={(e) => setForm({ ...form, warehouseRackBay: e.target.value })}
                placeholder="e.g. Yarn Bay A-02"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Yarn State</label>
              <select value={form.yarnStatus} onChange={(e) => setForm({ ...form, yarnStatus: e.target.value })}>
                <option value="RAW_GREIGE">Raw Greige (Undyed)</option>
                <option value="DYED_READY">Dyed & Conditioned</option>
                <option value="IN_WARPING_CREEL">Loaded in Warping Creel</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Inwarding...' : 'Inward to Yarn Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewYarnModal;