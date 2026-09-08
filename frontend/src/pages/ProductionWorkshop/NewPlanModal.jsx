import React, { useState } from 'react';
import { createProductionPlan } from '../../services/planningService';
import './NewPlanModal.css';

const NewPlanModal = ({ fabrics = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    orderReferenceNumber: 'EXP-2026-9021',
    targetClientName: 'Armani Group Milan / Raymonds',
    fabricProductName: fabrics[0]?.name || 'Royal Silk Crepe 900',
    qualityCode: 'SATIN-SILK-900',
    targetMeterage: 25000.0,
    allocatedLoomsCount: 6,
    plannedStartDate: new Date().toISOString().slice(0, 10),
    committedDeliveryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    plannedByManager: 'Chief Planning Merchandiser (PPC)',
    remarks: 'Priority contract for Spring export consignment.'
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

  const estWarpYarn = (Number(form.targetMeterage || 0) * 0.088).toFixed(1);
  const estWeftYarn = (Number(form.targetMeterage || 0) * 0.067).toFixed(1);
  const estDays = Math.ceil(Number(form.targetMeterage || 0) / (Number(form.allocatedLoomsCount || 6) * 250));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createProductionPlan({
        ...form,
        targetMeterage: Number(form.targetMeterage),
        allocatedLoomsCount: Number(form.allocatedLoomsCount)
      });
      alert(`Master Production Plan & MRP Generated!\nPlan Ref: ${res.data.planNumber}\nEstimated Days: ${res.data.estimatedLoomDays} Days`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to generate production plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-modal-overlay">
      <div className="plan-modal-content">
        <h2>Generate Factory Production Plan & MRP</h2>
        <p className="modal-sub">Calculate yarn requisition in KG, loom capacity allocation and stage milestones</p>

        <form onSubmit={handleSubmit}>
          <div className="plan-form-row">
            <div className="form-group flex-1">
              <label>Wholesale Order / Export Contract Reference</label>
              <input
                value={form.orderReferenceNumber}
                onChange={(e) => setForm({ ...form, orderReferenceNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Target Buyer / Garment Brand</label>
              <input
                value={form.targetClientName}
                onChange={(e) => setForm({ ...form, targetClientName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="plan-form-row">
            <div className="form-group flex-1">
              <label>Commissioned Woven Fabric Quality</label>
              <select onChange={(e) => handleFabricSelect(e.target.value)} required>
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>{f.itemCode || f.qualityCode} — {f.name || f.fabricName}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Contract Target Volume (Meters)</label>
              <input
                type="number"
                step="500"
                value={form.targetMeterage}
                onChange={(e) => setForm({ ...form, targetMeterage: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mrp-live-preview-box">
            <h4>Live MRP Material Requisition & Capacity Estimation</h4>
            <div className="mrp-grid-4">
              <div className="mrp-cell">
                <span>Required Warp Yarn:</span>
                <strong>{estWarpYarn} KG</strong>
              </div>
              <div className="mrp-cell">
                <span>Required Weft Yarn:</span>
                <strong>{estWeftYarn} KG</strong>
              </div>
              <div className="mrp-cell">
                <span>Allocated Looms:</span>
                <strong>{form.allocatedLoomsCount} Looms</strong>
              </div>
              <div className="mrp-cell">
                <span>Loom Time Required:</span>
                <strong className="green-txt">{estDays} Days</strong>
              </div>
            </div>
          </div>

          <div className="plan-form-row">
            <div className="form-group flex-1">
              <label>Allocate Weaving Looms Count</label>
              <input
                type="number"
                min="1"
                max="48"
                value={form.allocatedLoomsCount}
                onChange={(e) => setForm({ ...form, allocatedLoomsCount: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Planned Production Start Date</label>
              <input
                type="date"
                value={form.plannedStartDate}
                onChange={(e) => setForm({ ...form, plannedStartDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Committed Buyer Delivery Date</label>
              <input
                type="date"
                value={form.committedDeliveryDate}
                onChange={(e) => setForm({ ...form, committedDeliveryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Calculating MRP...' : 'Issue Master Production Plan & Route Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPlanModal;