import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFabrics, deleteFabric } from '../../services/fabricService';
import AddFabricModal from './AddFabricModal';
import BarcodeGenerator from './BarcodeGenerator';
import {
  formatMeters,
  getFabricCode,
  getFabricGsm,
  getFabricGstRate,
  getFabricHsn,
  getFabricImage,
  getFabricLocation,
  getFabricMinStock,
  getFabricName,
  getFabricPrice,
  getFabricStock,
  getFabricType,
  matchesFabricSearch,
} from '../../utils/fabricFormat';
import { MapPin, Edit, Trash2, Tag } from 'lucide-react';
import './FabricList.css';

const FabricList = () => {
  const [fabrics, setFabrics] = useState([]);
  const [modalFabric, setModalFabric] = useState(undefined);
  const [tagFabric, setTagFabric] = useState(null);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('card');

  // Sync search when navbar quick-search navigates here with ?q=
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  const load = async () => {
    try {
      const res = await getFabrics();
      setFabrics(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    // Live refresh — data updates in real time
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (f) => {
    const name = getFabricName(f);
    const code = getFabricCode(f);
    if (!window.confirm(`Are you sure you want to permanently delete fabric quality "${name}" (${code})?`)) return;
    try {
      await deleteFabric(f.id);
      load();
    } catch (err) {
      alert('Cannot delete this fabric quality.');
    }
  };

  const filtered = fabrics.filter((f) => matchesFabricSearch(f, search));

  return (
    <div className="fabric-container">
      <div className="fabric-header">
        <div>
          <h1 className="fabric-title">Fabric Product Catalog</h1>
          <p className="fabric-sub">Real-time inventory, rack shelf locations, GST and remnant status</p>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button className={viewMode === 'card' ? 'vt active' : 'vt'} onClick={() => setViewMode('card')}>Cards</button>
            <button className={viewMode === 'table' ? 'vt active' : 'vt'} onClick={() => setViewMode('table')}>Table</button>
          </div>
          <button className="gold-btn" onClick={() => setModalFabric(null)}>+ Add Product</button>
        </div>
      </div>

      <div className="fabric-toolbar">
        <input className="fabric-search" placeholder="Search SKU, name, material..." value={search} onChange={e => setSearch(e.target.value)} />
        <span className="result-count">{filtered.length} Products</span>
      </div>

      {/* CARD VIEW */}
      {viewMode === 'card' && (
        <div className="fabric-card-grid">
          {filtered.length === 0 ? (
            <div className="empty-catalog-box">No products found.</div>
          ) : filtered.map((f) => {
            const stock = getFabricStock(f);
            const price = getFabricPrice(f);
            const img = getFabricImage(f);
            const loc = getFabricLocation(f);
            const alertLimit = getFabricMinStock(f);
            const isLow = stock <= alertLimit;
            const isRemnant = f.isRemnant;

            return (
              <div key={f.id} className={`product-card ${isLow ? 'card-low' : ''} ${isRemnant ? 'card-remnant' : ''}`}>
                <div className="card-image-wrap">
                  <img src={img} alt={getFabricName(f)} onError={e => e.target.src = getFabricImage(null)} />
                  {isRemnant && <span className="remnant-ribbon">REMNANT</span>}
                  {isLow && !isRemnant && <span className="low-ribbon">LOW STOCK</span>}
                </div>
                <div className="card-body">
                  <div className="card-sku">{getFabricCode(f)}</div>
                  <h3 className="card-name">{getFabricName(f)}</h3>
                  <div className="card-meta">
                    <span>{getFabricType(f)}</span>
                    <span>{getFabricGsm(f)} GSM</span>
                    <span>GST {getFabricGstRate(f)}%</span>
                  </div>
                  <div className="card-location">
                    <MapPin size={12} color="#d4af37" /> {loc}
                  </div>
                  <div className="card-bottom">
                    <div className="card-price">₹{price.toFixed(2)}<small>/m</small></div>
                    <div className={`card-stock ${isLow ? 'low' : 'ok'}`}>{formatMeters(stock)}</div>
                  </div>
                  <div className="card-actions">
                    <button className="ca-btn edit" onClick={() => setModalFabric(f)}><Edit size={12} /> Edit</button>
                    <button className="ca-btn tag" onClick={() => setTagFabric(f)}><Tag size={12} /> Tag</button>
                    <button className="ca-btn del" onClick={() => handleDelete(f)}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="fabric-table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Swatch</th><th>SKU</th><th>Fabric Name</th><th>Material</th>
                <th>GSM</th><th>Rack</th><th>HSN</th><th>Rate/m</th>
                <th>GST</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="11" className="text-center">No products found.</td></tr>
              ) : filtered.map((f) => {
                const stock = getFabricStock(f);
                const price = getFabricPrice(f);
                const img = getFabricImage(f);
                const loc = getFabricLocation(f);
                const alertLimit = getFabricMinStock(f);
                return (
                  <tr key={f.id}>
                    <td><div className="thumb"><img src={img} alt="" onError={e => e.target.src = getFabricImage(null)} /></div></td>
                    <td className="gold">{getFabricCode(f)}</td>
                    <td><strong>{getFabricName(f)}</strong><div className="sub">{f.seasonCollection}</div></td>
                    <td>{getFabricType(f)}</td>
                    <td>{getFabricGsm(f)}</td>
                    <td><span className="loc-tag"><MapPin size={11} color="#d4af37" /> {loc}</span></td>
                    <td>{getFabricHsn(f)}</td>
                    <td>₹{price.toFixed(2)}</td>
                    <td>{getFabricGstRate(f)}%</td>
                    <td className={stock <= alertLimit ? 'low' : 'ok'}>
                      {formatMeters(stock)}
                      {f.isRemnant && <span className="remnant-badge">Remnant</span>}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-e" onClick={() => setModalFabric(f)}><Edit size={12} /></button>
                        <button className="btn-t" onClick={() => setTagFabric(f)}>Tag</button>
                        <button className="btn-d" onClick={() => handleDelete(f)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalFabric !== undefined && (
        <AddFabricModal fabric={modalFabric} onClose={() => setModalFabric(undefined)} onSuccess={() => { setModalFabric(undefined); load(); }} />
      )}
      {tagFabric && <BarcodeGenerator fabric={tagFabric} onClose={() => setTagFabric(null)} />}
    </div>
  );
};

export default FabricList;
