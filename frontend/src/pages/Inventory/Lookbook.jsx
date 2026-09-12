import React, { useEffect, useState } from 'react';
import { getFabrics } from '../../services/fabricService';
import {
  getFabricCode,
  getFabricGsm,
  getFabricGstRate,
  getFabricImage,
  getFabricLocation,
  getFabricName,
  getFabricPrice,
  getFabricStock,
  getFabricType,
} from '../../utils/fabricFormat';
import { Sparkles, MapPin } from 'lucide-react';
import './Lookbook.css';

const Lookbook = () => {
  const [fabrics, setFabrics] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const refresh = () => getFabrics().then(res => setFabrics(res.data || [])).catch(console.error);
    refresh();
    // Live refresh
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const types = ['ALL', ...Array.from(new Set(fabrics.map(f => getFabricType(f)).filter(Boolean)))];
  const filtered = filter === 'ALL' ? fabrics : fabrics.filter(f => getFabricType(f) === filter);

  return (
    <div className="lookbook-page">
      <div className="lookbook-header">
        <div>
          <span className="lb-kicker"><Sparkles size={14} /> DIGITAL SWATCH GALLERY</span>
          <h1 className="lb-title">Fabric Swatch Showcase</h1>
          <p className="lb-sub">Visual catalog for B2B buyer presentations and fabric sampling</p>
        </div>
      </div>

      <div className="lb-filters">
        {types.map(t => (
          <button key={t} className={`lb-filter ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'ALL' ? 'All Fabrics' : t}
          </button>
        ))}
      </div>

      <div className="lb-grid">
        {filtered.map(f => {
          return (
            <div key={f.id} className="swatch-card">
              <div className="swatch-img-wrap">
                <img
                  src={getFabricImage(f)}
                  alt={getFabricName(f)}
                  onError={e => e.target.src = getFabricImage(null)}
                />
              </div>
              <div className="swatch-info">
                <span className="swatch-sku">{getFabricCode(f)}</span>
                <h3>{getFabricName(f)}</h3>
                <div className="swatch-tags">
                  <span>{getFabricType(f)}</span>
                  <span>{getFabricGsm(f)} GSM</span>
                  <span>GST {getFabricGstRate(f)}%</span>
                </div>
                <div className="swatch-loc"><MapPin size={11} color="#d4af37" /> {getFabricLocation(f)}</div>
                <div className="swatch-bottom">
                  <span className="swatch-price">₹{getFabricPrice(f).toFixed(2)}/m</span>
                  <span className="swatch-stock">{getFabricStock(f).toFixed(1)} m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lookbook;