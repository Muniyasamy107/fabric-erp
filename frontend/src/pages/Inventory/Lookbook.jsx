import React, { useEffect, useState } from 'react';
import { getFabrics } from '../../services/fabricService';
import { Sparkles, MapPin } from 'lucide-react';
import './Lookbook.css';

const DEFAULT_IMG = '/fabrics/cotton-shirting.jpg';

const Lookbook = () => {
  const [fabrics, setFabrics] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getFabrics().then(res => setFabrics(res.data || [])).catch(console.error);
  }, []);

  const types = ['ALL', ...Array.from(new Set(fabrics.map(f => f.fabricType).filter(Boolean)))];
  const filtered = filter === 'ALL' ? fabrics : fabrics.filter(f => f.fabricType === filter);

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
          const img = f.imageUrl && f.imageUrl.trim() ? f.imageUrl.trim() : DEFAULT_IMG;
          const price = Number(f.wholesalePricePerMeter ?? f.pricePerMeter ?? 0);
          const loc = f.warehouseBinLocation || f.rackLocation || 'Rack A-01';
          return (
            <div key={f.id} className="swatch-card">
              <div className="swatch-img-wrap">
                <img src={img} alt={f.fabricName} onError={e => e.target.src = DEFAULT_IMG} />
              </div>
              <div className="swatch-info">
                <span className="swatch-sku">{f.qualityCode || f.itemCode}</span>
                <h3>{f.fabricName || f.name}</h3>
                <div className="swatch-tags">
                  <span>{f.fabricType}</span>
                  <span>{f.gsm} GSM</span>
                  <span>GST {f.gstRate || 5}%</span>
                </div>
                <div className="swatch-loc"><MapPin size={11} color="#d4af37" /> {loc}</div>
                <div className="swatch-bottom">
                  <span className="swatch-price">₹{price.toFixed(2)}/m</span>
                  <span className="swatch-stock">{Number(f.totalStockMeters ?? f.totalAvailableMeters ?? 0).toFixed(1)} m</span>
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