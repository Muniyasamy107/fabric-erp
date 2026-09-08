import React, { useState } from 'react';
import { packNewRoll } from '../../services/rollPackingService';
import './PackNewRollModal.css';

const PackNewRollModal = ({ jobs = [], onClose, onSuccess }) => {
  const [form, setForm] = useState({
    productionJobId: '',
    batchLotNumber: '',
    fabricProductName: '',
    qualityCode: 'SATIN-SILK-900',
    weaveType: 'Satin Weave',
    fabricWidthInches: 58.0,
    netLengthMeters: 50.0,
    grossWeightKg: 12.8,
    netWeightKg: 12.0,
    qualityGrade: 'GRADE_A',
    warehouseBin: 'Finished Goods Bay A - Rack 04',
    balePackageNumber: 'BALE-LOT-01',
    packedByOperatorName: 'Packing Supervisor Ramesh'
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
        qualityGrade: matched.fabricQualityGrade || 'GRADE_A',
        balePackageNumber: `BALE-${matched.batchNumber}-01`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await packNewRoll({
        ...form,
        netLengthMeters: Number(form.netLengthMeters),
        grossWeightKg: Number(form.grossWeightKg),
        netWeightKg: Number(form.netWeightKg),
        fabricWidthInches: Number(form.fabricWidthInches)
      });
      alert(`Roll Packed Successfully!\nRoll Serial: ${res.data.rollBarcodeNumber}`);
      onSuccess(res.data);
    } catch (err) {
      alert(err.response?.data || 'Failed to pack roll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pack-modal-overlay">
      <div className="pack-modal-content">
        <h2>Pack & Tag Finished Fabric Roll</h2>
        <p className="modal-sub">Doff finished piece from inspection table and generate thermal QR identification sticker</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Production Lot / Finished Batch</label>
            <select
              value={form.productionJobId}
              onChange={(e) => handleJobSelect(e.target.value)}
              required
            >
              <option value="">-- Choose Production Lot --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.batchNumber} — {j.fabricProductName} ({j.producedMeters || j.targetMeters}m woven)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Net Piece Length (Meters)</label>
              <input
                type="number"
                step="0.1"
                value={form.netLengthMeters}
                onChange={(e) => setForm({ ...form, netLengthMeters: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Width (Panna in Inches)</label>
              <input
                type="number"
                step="0.5"
                value={form.fabricWidthInches}
                onChange={(e) => setForm({ ...form, fabricWidthInches: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Gross Weight (KG with Core)</label>
              <input
                type="number"
                step="0.1"
                value={form.grossWeightKg}
                onChange={(e) => setForm({ ...form, grossWeightKg: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Net Fabric Weight (KG)</label>
              <input
                type="number"
                step="0.1"
                value={form.netWeightKg}
                onChange={(e) => setForm({ ...form, netWeightKg: e.target.value })}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Roll Quality Grade</label>
              <select value={form.qualityGrade} onChange={(e) => setForm({ ...form, qualityGrade: e.target.value })}>
                <option value="GRADE_A">Grade A (Defect Free)</option>
                <option value="GRADE_B">Grade B (Commercial)</option>
                <option value="SECONDS">Seconds (Cut-piece)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Warehouse Storage Bay / Pallet</label>
              <input
                type="text"
                value={form.warehouseBin}
                onChange={(e) => setForm({ ...form, warehouseBin: e.target.value })}
                placeholder="e.g. Finished Bay A - Shelf 02"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Assign to Shipping Bale / Crate No</label>
              <input
                type="text"
                value={form.balePackageNumber}
                onChange={(e) => setForm({ ...form, balePackageNumber: e.target.value })}
                placeholder="e.g. BALE-EXP-01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Packing Operator / Officer Name</label>
            <input
              type="text"
              value={form.packedByOperatorName}
              onChange={(e) => setForm({ ...form, packedByOperatorName: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Packing...' : 'Confirm Roll & Print QR Sticker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackNewRollModal;