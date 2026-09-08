import React, { useState } from 'react';
import { createPurchaseOrder } from '../../services/purchaseOrderService';
import './CreatePurchaseOrderModal.css';

const CreatePurchaseOrderModal = ({ suppliers = [], fabrics = [], onClose, onSuccess }) => {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    {
      fabricId: fabrics[0]?.id || '',
      itemCode: fabrics[0]?.itemCode || '',
      fabricName: fabrics[0]?.name || '',
      fabricType: fabrics[0]?.fabricType || 'Silk',
      orderedMeters: 50,
      estimatedCostPerMeter: fabrics[0]?.costPricePerMeter || fabrics[0]?.pricePerMeter || 1000
    }
  ]);
  const [error, setError] = useState('');

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === 'fabricId') {
      const selected = fabrics.find((f) => String(f.id) === String(value));
      if (selected) {
        updated[index] = {
          ...updated[index],
          fabricId: selected.id,
          itemCode: selected.itemCode,
          fabricName: selected.name,
          fabricType: selected.fabricType,
          estimatedCostPerMeter: selected.costPricePerMeter || selected.pricePerMeter || 1000
        };
      }
    } else {
      updated[index][field] = value;
    }
    setItems(updated);
  };

  const addItemRow = () => {
    const defaultFab = fabrics[0];
    setItems([
      ...items,
      {
        fabricId: defaultFab?.id || '',
        itemCode: defaultFab?.itemCode || '',
        fabricName: defaultFab?.name || '',
        fabricType: defaultFab?.fabricType || 'Silk',
        orderedMeters: 50,
        estimatedCostPerMeter: defaultFab?.costPricePerMeter || defaultFab?.pricePerMeter || 1000
      }
    ]);
  };

  const removeItemRow = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const totalEstimated = items.reduce(
    (sum, item) => sum + (Number(item.orderedMeters) || 0) * (Number(item.estimatedCostPerMeter) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createPurchaseOrder({
        supplierId: Number(supplierId),
        expectedDeliveryDate: expectedDeliveryDate || null,
        notes,
        items: items.map((it) => ({
          ...it,
          orderedMeters: Number(it.orderedMeters),
          estimatedCostPerMeter: Number(it.estimatedCostPerMeter)
        }))
      });
      alert('Purchase Order successfully issued to Mill!');
      onSuccess();
    } catch (err) {
      setError(err.response?.data || 'Failed to create Purchase Order');
    }
  };

  return (
    <div className="po-modal-overlay">
      <div className="po-modal-content">
        <h2>Issue Mill Purchase Order (PO)</h2>
        <p className="po-modal-sub">Draft official procurement indent for textile weaver mills</p>

        <form onSubmit={handleSubmit}>
          <div className="po-form-row">
            <div className="form-group flex-1">
              <label>Select Mill / Supplier</label>
              <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.millName} — {s.city} ({s.fabricSpeciality})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Expected Dispatch Date</label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="po-items-section">
            <div className="section-head">
              <h4>Fabric Indent Items</h4>
              <button type="button" className="btn-add-item" onClick={addItemRow}>
                + Add Roll Spec
              </button>
            </div>

            {items.map((it, idx) => (
              <div key={idx} className="po-item-row">
                <select
                  value={it.fabricId}
                  onChange={(e) => handleItemChange(idx, 'fabricId', e.target.value)}
                  className="fabric-select"
                >
                  {fabrics.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.itemCode} - {f.name}
                    </option>
                  ))}
                </select>

                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={it.orderedMeters}
                    onChange={(e) => handleItemChange(idx, 'orderedMeters', e.target.value)}
                    placeholder="Meters"
                    required
                  />
                  <span>m</span>
                </div>

                <div className="input-with-unit">
                  <span>₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={it.estimatedCostPerMeter}
                    onChange={(e) => handleItemChange(idx, 'estimatedCostPerMeter', e.target.value)}
                    placeholder="Rate/m"
                    required
                  />
                </div>

                <div className="row-total">
                  ₹{((Number(it.orderedMeters) || 0) * (Number(it.estimatedCostPerMeter) || 0)).toFixed(2)}
                </div>

                <button type="button" className="btn-remove-item" onClick={() => removeItemRow(idx)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Mill Delivery Instructions & Quality Terms</label>
            <textarea
              rows="2"
              placeholder="e.g. 100% Mulberry Grade 6A Silk required, inspect for loom streaks before freight dispatch..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="po-bottom-summary">
            <div className="est-total">
              Estimated Indent Total: <strong>₹{totalEstimated.toFixed(2)}</strong>
            </div>
          </div>

          {error && <div className="po-error">{String(error)}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-gold-save">
              Issue Official PO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;