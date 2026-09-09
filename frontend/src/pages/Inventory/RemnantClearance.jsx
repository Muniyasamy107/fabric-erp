import React, { useEffect, useState } from 'react';
import { getRemnantFabrics, toggleRemnantClearance } from '../../services/fabricService';
import { useNavigate } from 'react-router-dom';
import { Scissors, Tag, ShoppingBag, MapPin, Sparkles, Percent } from 'lucide-react';
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

  const handleToggle = async (f) => {
    const defaultDiscount = f.remnantDiscountPct || 30;
    const discount = prompt(`Set Remnant Clearance Discount % for "${f.name}":`, defaultDiscount);
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
          <span className="remnant-kicker"><Sparkles size={14} /> LUXURY END-BIT RECOVERY STUDIO</span>
          <h1 className="remnant-title">Roll Remnant Box & Thaan Clearance</h1>
          <p className="remnant-sub">Browse short roll remnants (under 2.5m) ideal for Waistcoats, Pocket Squares, Blouses and Cravats</p>
        </div>
      </div>

      <div className="remnants-grid">
        {remnants.length === 0 ? (
          <div className="empty-remnant-box">
            <Scissors size={40} color="#d4af37" />
            <p>No roll end-bits currently in the Remnant Box. All fabric rolls are at full length.</p>
          </div>
        ) : (
          remnants.map((f) => {
            const originalPrice = Number(f.pricePerMeter);
            const discountPct = Number(f.remnantDiscountPct || 30);
            const discountedPrice = originalPrice - (originalPrice * (discountPct / 100));
            const totalRemnantValue = discountedPrice * Number(f.totalAvailableMeters);

            return (
              <div key={f.id} className="remnant-card">
                <div className="rem-card-top">
                  <span className="rem-tag-badge"><Tag size={12} /> {discountPct}% CLEARANCE</span>
                  <span className="rem-rack"><MapPin size={12} /> {f.rackLocation || 'Rack A-01'}</span>
                </div>

                <div className="rem-body">
                  <span className="rem-sku">{f.itemCode} • HSN: {f.hsnCode}</span>
                  <h3>{f.name}</h3>
                  <p className="rem-type">{f.fabricType} ({f.gsm} GSM)</p>

                  <div className="rem-length-box">
                    <span className="lbl">REMAINING CUT LENGTH:</span>
                    <strong className="len-val">{f.totalAvailableMeters} meters</strong>
                    <small>Ideal for Waistcoat, Blouse or Silk Pocket Square</small>
                  </div>

                  <div className="rem-price-row">
                    <div>
                      <span className="old-price">₹{originalPrice.toFixed(2)}/m</span>
                      <div className="new-price">₹{discountedPrice.toFixed(2)}/m</div>
                    </div>
                    <div className="rem-lot-total">
                      <span>Whole Piece:</span>
                      <strong>₹{totalRemnantValue.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                <div className="rem-actions">
                  <button className="btn-edit-disc" onClick={() => handleToggle(f)}>
                    <Percent size={12} /> Set Disc
                  </button>
                  <button className="btn-take-pos" onClick={() => navigate('/billing')}>
                    <ShoppingBag size={14} /> Cut at POS
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