import React, { useState } from 'react';
import { saveMeasurement } from '../../services/bespokeService';
import './MeasurementSheet.css';

const MeasurementSheet = ({ customerId, customerName, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: customerId,
    garmentType: '3-Piece Suit',
    neck: '',
    chest: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeveLength: '',
    jacketLength: '',
    trouserWaist: '',
    inseam: '',
    fitPreference: 'Slim Luxury Fit',
    specialInstructions: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveMeasurement(formData);
      alert("Measurement saved successfully!");
      onClose();
    } catch (err) {
      alert("Failed to save measurements");
    }
  };

  return (
    <div className="measurement-overlay">
      <div className="measurement-modal">
        <div className="modal-header">
          <h2>Client Measurement Sheet</h2>
          <p className="client-name">VIP Client: <span>{customerName}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="measurement-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Garment Type</label>
              <select name="garmentType" onChange={handleChange}>
                <option value="3-Piece Suit">3-Piece Suit / Tuxedo</option>
                <option value="Bespoke Blazer">Bespoke Blazer</option>
                <option value="Luxury Shirt">Luxury Formal Shirt</option>
                <option value="Bandhgala / Sherwani">Bandhgala / Sherwani</option>
                <option value="Trouser">Custom Trouser</option>
              </select>
            </div>

            <div className="input-group">
              <label>Fit Style</label>
              <select name="fitPreference" onChange={handleChange}>
                <option value="Slim Luxury Fit">Italian Slim Fit</option>
                <option value="Classic British Regular">Classic British Regular</option>
                <option value="Relaxed Royal">Relaxed Royal</option>
              </select>
            </div>

            <div className="input-group">
              <label>Neck (in)</label>
              <input type="number" step="0.25" name="neck" onChange={handleChange} placeholder="e.g. 16.5" />
            </div>

            <div className="input-group">
              <label>Chest (in)</label>
              <input type="number" step="0.25" name="chest" required onChange={handleChange} placeholder="e.g. 40.0" />
            </div>

            <div className="input-group">
              <label>Waist (in)</label>
              <input type="number" step="0.25" name="waist" required onChange={handleChange} placeholder="e.g. 34.0" />
            </div>

            <div className="input-group">
              <label>Hip (in)</label>
              <input type="number" step="0.25" name="hip" onChange={handleChange} placeholder="e.g. 41.0" />
            </div>

            <div className="input-group">
              <label>Shoulder (in)</label>
              <input type="number" step="0.25" name="shoulder" required onChange={handleChange} placeholder="e.g. 18.5" />
            </div>

            <div className="input-group">
              <label>Sleeve Length (in)</label>
              <input type="number" step="0.25" name="sleeveLength" required onChange={handleChange} placeholder="e.g. 25.0" />
            </div>

            <div className="input-group">
              <label>Jacket Length (in)</label>
              <input type="number" step="0.25" name="jacketLength" onChange={handleChange} placeholder="e.g. 30.0" />
            </div>

            <div className="input-group">
              <label>Trouser Inseam (in)</label>
              <input type="number" step="0.25" name="inseam" onChange={handleChange} placeholder="e.g. 32.0" />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Master Tailor Special Notes</label>
            <textarea 
              name="specialInstructions" 
              rows="3" 
              placeholder="e.g. Broad shoulders, left cuff wider for Rolex watch..."
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Close</button>
            <button type="submit" className="btn-save-gold">Save Body Specs</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeasurementSheet;