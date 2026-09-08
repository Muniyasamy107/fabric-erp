import React, { useState } from 'react';
import API from '../../services/api';
import './AddSupplierModal.css';

const AddSupplierModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    millName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    country: 'India',
    fabricSpeciality: 'Yarn Spinning & Dyeing',
    gstin: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/suppliers', form);
      alert('Yarn Supplier registered successfully!');
      onSuccess();
    } catch (err) {
      alert('Failed to register supplier');
    }
  };

  return (
    <div className="sup-modal-overlay">
      <div className="sup-modal">
        <h2>Register Yarn / Raw Material Supplier</h2>
        <form onSubmit={handleSubmit}>
          <label>Spinning Mill / Vendor Name</label>
          <input value={form.millName} onChange={(e) => setForm({ ...form, millName: e.target.value })} required />

          <div className="form-row">
            <div className="form-group">
              <label>Contact Person</label>
              <input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Speciality Supply</label>
              <select value={form.fabricSpeciality} onChange={(e) => setForm({ ...form, fabricSpeciality: e.target.value })}>
                <option value="Cotton Yarn Spinning">Cotton Yarn Spinning</option>
                <option value="Raw Silk Filament">Raw Silk Filament</option>
                <option value="Wool / Cashmere Tops">Wool / Cashmere Tops</option>
                <option value="Dyes & Calendering Auxiliaries">Dyes & Calendering Auxiliaries</option>
              </select>
            </div>
            <div className="form-group">
              <label>City & Country</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
          </div>

          <label>GSTIN Number</label>
          <input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />

          <div className="actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold">Save Supplier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;