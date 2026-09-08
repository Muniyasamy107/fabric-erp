import React, { useEffect, useState } from 'react';
import { getWholesaleClients, registerWholesaleClient } from '../../services/factoryService';
import { Building2, Phone, Mail, MapPin, BadgePercent } from 'lucide-react';
import './ClientDirectory.css';

const ClientDirectory = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ companyName: '', contactPhone: '', email: '', billingAddress: '', gstin: '', clientSegment: 'RETAIL_BRAND' });

  const load = async () => {
    try {
      const res = await getWholesaleClients();
      setClients(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerWholesaleClient(form);
      alert('Wholesale Client successfully registered!');
      setShowModal(false);
      setForm({ companyName: '', contactPhone: '', email: '', billingAddress: '', gstin: '', clientSegment: 'RETAIL_BRAND' });
      load();
    } catch (err) {
      alert(err.response?.data || 'Failed to save client');
    }
  };

  const filtered = clients.filter((c) =>
    (c.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.contactPhone || '').includes(search)
  );

  return (
    <div className="client-page">
      <div className="client-header">
        <div>
          <h1>B2B Wholesale Clients Directory</h1>
          <p>Manage international apparel brands, wholesale distributors, and direct garment factories</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>+ Register Brand Client</button>
      </div>

      <input className="client-search" placeholder="Search Company name, phone, HSN..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="client-grid">
        {filtered.map((c) => (
          <div key={c.id} className="client-card">
            <div className="cc-top">
              <Building2 size={24} color="#d4af37" />
              <span className="segment-badge">{c.clientSegment}</span>
            </div>
            <h3>{c.companyName}</h3>
            <div className="row"><Phone size={14} /> {c.contactPhone}</div>
            {c.email && <div className="row"><Mail size={14} /> {c.email}</div>}
            {c.billingAddress && <div className="row"><MapPin size={14} /> {c.billingAddress}</div>}
            {c.gstin && <div className="gst-badge">GSTIN: {c.gstin}</div>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="c-modal-overlay">
          <div className="c-modal">
            <h2>Register B2B Wholesale Partner</h2>
            <form onSubmit={handleSubmit}>
              <label>Company/Brand Name</label>
              <input value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} required />

              <label>Commercial Phone</label>
              <input value={form.contactPhone} onChange={(e) => setForm({...form, contactPhone: e.target.value})} required />

              <label>Official Email</label>
              <input value={form.email} type="email" onChange={(e) => setForm({...form, email: e.target.value})} />

              <label>GSTIN / Tax ID</label>
              <input value={form.gstin} onChange={(e) => setForm({...form, gstin: e.target.value})} />

              <label>Client Industry Segment</label>
              <select value={form.clientSegment} onChange={(e) => setForm({...form, clientSegment: e.target.value})}>
                <option value="RETAIL_BRAND">Retail Apparel Brand</option>
                <option value="EXPORTER">Export House / Apparel Exporter</option>
                <option value="GARMENT_FACTORY">Garment Manufacturing Unit</option>
              </select>

              <label>Factory Billing Address</label>
              <textarea rows="2" value={form.billingAddress} onChange={(e) => setForm({...form, billingAddress: e.target.value})} />

              <div className="actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-gold">Register Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDirectory;