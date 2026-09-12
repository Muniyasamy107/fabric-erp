import React, { useEffect, useState } from 'react';
import { getRemnantFabrics, toggleRemnantClearance } from '../../services/fabricService';
import {
  getFabricCode,
  getFabricGsm,
  getFabricHsn,
  getFabricImage,
  getFabricLocation,
  getFabricName,
  getFabricPrice,
  getFabricStock,
  getFabricType,
} from '../../utils/fabricFormat';
import { useNavigate } from 'react-router-dom';
import { Scissors, Tag, MapPin, Sparkles, Percent, Eye } from 'lucide-react';
import './RemnantClearance.css';

const RemnantClearance = () => {
  const [remnants, setRemnants] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await getRemnantFabrics();
      setRemnants(res.data || []);
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

  const handleSetDiscount = async (f) => {
    const defaultDiscount = f.remnantDiscountPct || 30;
    const discount = prompt(`Set remnant clearance discount % for "${getFabricName(f)}":`, defaultDiscount);
    if (discount === null) return;
    try {
      await toggleRemnantClearance(f.id, Number(discount));
      load();
    } catch (err) {
      alert('Failed to update remnant clearance status');
    }
  };

  return (
    <div className="remnant-page">
      <div className="remnant-header">
        <div>
          <span className="remnant-kicker"><Sparkles size={14} /> FACTORY STOCK RECOVERY</span>
          <h1 className="remnant-title">Remnant Clearance Yard</h1>
          <p className="remnant-sub">
            Short-length finished rolls and end-bits cleared from the warehouse at discounted
            rates — ideal for small-lot buyers, sampling and job-work accounts.
          </p>
        </div>
      </div>

      <div className="remnants-grid">
        {remnants.length === 0 ? (
          <div className="empty-remnant-box">
            <Scissors size={40} color="#d4af37" />
            <p>No short-length rolls in the remnant yard right now. All stock is at full length.</p>
          </div>
        ) : (
          remnants.map((f) => {
            const originalPrice = getFabricPrice(f);
            const discountPct = Number(f.remnantDiscountPct || 30);
            const discountedPrice = originalPrice - (originalPrice * (discountPct / 100));
            const meters = getFabricStock(f);
            const totalRemnantValue = discountedPrice * meters;

            return (
              <div key={f.id} className="remnant-card">
                {f.imageUrl && (
                  <div className="rem-photo">
                    <img src={getFabricImage(f)} alt={getFabricName(f)} loading="lazy" />
                    <span className="rem-tag-badge"><Tag size={12} /> {discountPct}% OFF</span>
                  </div>
                )}

                <div className="rem-card-top">
                  <span className="rem-sku">{getFabricCode(f)} • HSN {getFabricHsn(f)}</span>
                  <span className="rem-rack"><MapPin size={12} /> {getFabricLocation(f)}</span>
                </div>

                <div className="rem-body">
                  <h3>{getFabricName(f)}</h3>
                  <p className="rem-type">{getFabricType(f).replace(/_/g, ' ')} · {getFabricGsm(f) || '—'} GSM</p>

                  <div className="rem-length-box">
                    <span className="lbl">AVAILABLE LENGTH:</span>
                    <strong className="len-val">{meters.toFixed(1)} meters</strong>
                    <small>Single piece — sold as-is on full payment</small>
                  </div>

                  <div className="rem-price-row">
                    <div>
                      <span className="old-price">₹{originalPrice.toFixed(2)}/m</span>
                      <div className="new-price">₹{discountedPrice.toFixed(2)}/m</div>
                    </div>
                    <div className="rem-lot-total">
                      <span>Full Piece Value:</span>
                      <strong>₹{totalRemnantValue.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                <div className="rem-actions">
                  <button className="btn-edit-disc" onClick={() => handleSetDiscount(f)}>
                    <Percent size={12} /> Set Discount
                  </button>
                  <button className="btn-take-pos" onClick={() => navigate(`/fabrics?q=${encodeURIComponent(getFabricCode(f))}`)}>
                    <Eye size={13} /> View in Catalog
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RemnantClearance;
