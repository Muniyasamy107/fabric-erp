import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import AddSupplierModal from './AddSupplierModal';
import { Truck, Phone, Mail, MapPin, PlusCircle } from 'lucide-react';
import './SupplierList.css';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadSuppliers = async () => {
    try {
      const res = await API.get('/suppliers');
      setSuppliers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSuppliers();
    // Live refresh
    const interval = setInterval(loadSuppliers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="supplier-page">
      <div className="supplier-header">
        <div>
          <h1>Raw Material & Yarn Mill Suppliers</h1>
          <p>Manage spinning mills, raw silk cocoon guilds, and dye chemical vendors</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Register Yarn Supplier
        </button>
      </div>

      <div className="supplier-grid">
        {suppliers.length === 0 ? (
          <p className="empty-msg">No yarn suppliers registered yet.</p>
        ) : (
          suppliers.map((s) => (
            <div key={s.id} className="sup-card">
              <div className="sup-top">
                <Truck size={22} color="#d4af37" />
                <span className="spec-badge">{s.fabricSpeciality || 'Yarn Spinning'}</span>
              </div>
              <h3>{s.millName}</h3>
              <p className="contact-person">Contact: <strong>{s.contactPerson}</strong></p>
              <div className="sup-row"><Phone size={14} /> {s.phone}</div>
              {s.email && <div className="sup-row"><Mail size={14} /> {s.email}</div>}
              <div className="sup-row"><MapPin size={14} /> {s.city}, {s.country}</div>
              {s.gstin && <div className="gstin-tag">GSTIN: {s.gstin}</div>}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AddSupplierModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadSuppliers();
          }}
        />
      )}
    </div>
  );
};

export default SupplierList;