import React, { useState } from 'react';
import { createFabric, updateFabric } from '../../services/fabricService';
import { Layers } from 'lucide-react';
import './AddFabricModal.css';

const AddFabricModal = ({ fabric, onClose, onSuccess }) => {
  const isEdit = Boolean(fabric?.id);

  const [formData, setFormData] = useState({
    qualityCode: fabric?.qualityCode || fabric?.itemCode || '',
    fabricName: fabric?.fabricName || fabric?.name || '',
    fabricType: fabric?.fabricType || 'Mulberry Silk',
    gsm: fabric?.gsm ?? '',
    warehouseBinLocation: fabric?.warehouseBinLocation || fabric?.rackLocation || 'Rack A-01',
    hsnCode: fabric?.hsnCode || '5007',
    seasonCollection: fabric?.seasonCollection || 'Royal Wedding 2026',
    recommendedGarment: fabric?.recommendedGarment || '3-Piece Tuxedo',
    imageUrl: fabric?.imageUrl || '',
    wholesalePricePerMeter: fabric?.wholesalePricePerMeter ?? fabric?.pricePerMeter ?? '',
    totalStockMeters: fabric?.totalStockMeters ?? fabric?.totalAvailableMeters ?? '',
    minStockAlert: fabric?.minStockAlert ?? 10,
    gstRate: fabric?.gstRate ?? 5,
    isRemnant: fabric?.isRemnant || false,
    remnantDiscountPct: fabric?.remnantDiscountPct ?? 0
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const extractErrorMessage = (err) => {
    if (!err.response) {
      return 'Network connection error. Please verify your backend server is active on port 8083.';
    }
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
      return JSON.stringify(data);
    }
    return 'An unexpected error occurred while saving.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      qualityCode: formData.qualityCode.trim(),
      fabricName: formData.fabricName.trim(),
      fabricType: formData.fabricType,
      gsm: formData.gsm === '' ? null : Number(formData.gsm),
      warehouseBinLocation: formData.warehouseBinLocation.trim(),
      hsnCode: formData.hsnCode.trim(),
      seasonCollection: formData.seasonCollection,
      recommendedGarment: formData.recommendedGarment.trim(),
      imageUrl: formData.imageUrl.trim(),
      wholesalePricePerMeter: Number(formData.wholesalePricePerMeter),
      totalStockMeters: Number(formData.totalStockMeters),
      minStockAlert: Number(formData.minStockAlert),
      gstRate: Number(formData.gstRate),
      isRemnant: formData.isRemnant,
      remnantDiscountPct: formData.isRemnant ? Number(formData.remnantDiscountPct || 0) : 0
    };

    try {
      if (isEdit) {
        await updateFabric(fabric.id, payload);
      } else {
        await createFabric(payload);
      }
      onSuccess();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          <Layers size={20} color="#d4af37" /> {isEdit ? 'Edit Fabric Quality' : 'Add New Fabric Product'}
        </h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Item Code (SKU) *</label>
            <input
              name="qualityCode"
              value={formData.qualityCode}
              placeholder="e.g. SILK-101"
              required
              onChange={handleChange}
              disabled={isEdit}
            />
          </div>

          <div className="form-group">
            <label>Fabric Name *</label>
            <input
              name="fabricName"
              value={formData.fabricName}
              placeholder="e.g. Pure Mulberry Silk Jacquard"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Fabric Material</label>
              <select name="fabricType" value={formData.fabricType} onChange={handleChange}>
                <option value="Mulberry Silk">Mulberry Silk</option>
                <option value="Italian Linen">Italian Linen</option>
                <option value="Cashmere / Merino Wool">Cashmere / Merino Wool</option>
                <option value="Royal Velvet">Royal Velvet</option>
                <option value="Egyptian Giza Cotton">Egyptian Giza Cotton</option>
                <option value="Varanasi Brocade">Varanasi Brocade</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>GSM (Weight)</label>
              <input
                type="number"
                name="gsm"
                value={formData.gsm}
                placeholder="e.g. 140"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Rack / Vault Shelf Location</label>
              <input
                name="warehouseBinLocation"
                value={formData.warehouseBinLocation}
                placeholder="e.g. Rack A-01"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>GST HSN Code</label>
              <input
                name="hsnCode"
                value={formData.hsnCode}
                placeholder="e.g. 5007"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Season Collection</label>
              <select name="seasonCollection" value={formData.seasonCollection} onChange={handleChange}>
                <option value="Royal Wedding 2026">Royal Wedding 2026</option>
                <option value="Fall/Winter Milano">Fall/Winter Milano</option>
                <option value="Spring/Summer Riviera">Spring/Summer Riviera</option>
                <option value="Classic Formal">Classic Formal</option>
                <option value="Heritage Handloom Guild">Heritage Handloom Guild</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Recommended Garment</label>
              <input
                name="recommendedGarment"
                value={formData.recommendedGarment}
                placeholder="e.g. 3-Piece Tuxedo"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Swatch Texture Image URL</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              placeholder="e.g. https://images.unsplash.com/photo-1618220179428-22790b461013"
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Price / Meter (₹) excl. GST *</label>
              <input
                type="number"
                step="0.01"
                name="wholesalePricePerMeter"
                value={formData.wholesalePricePerMeter}
                placeholder="e.g. 2450.00"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>Total Available Meters *</label>
              <input
                type="number"
                step="0.1"
                name="totalStockMeters"
                value={formData.totalStockMeters}
                placeholder="e.g. 450.0"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Low Stock Alert (m)</label>
              <input
                type="number"
                step="1"
                name="minStockAlert"
                value={formData.minStockAlert}
                onChange={handleChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>GST Rate</label>
              <select name="gstRate" value={formData.gstRate} onChange={handleChange}>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
              </select>
            </div>
          </div>

          {/* Remnant Checkbox */}
          <div className="remnant-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRemnant"
                checked={formData.isRemnant}
                onChange={handleChange}
              />
              Mark as Remnant / End-Piece (Thaan Cut-Piece Clearance)
            </label>

            {formData.isRemnant && (
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Remnant Clearance Discount (%)</label>
                <input
                  type="number"
                  name="remnantDiscountPct"
                  value={formData.remnantDiscountPct}
                  placeholder="e.g. 30"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFabricModal;