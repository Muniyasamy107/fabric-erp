import React, { useState } from 'react';
import { updateOrderStyles } from '../../services/bespokeService';
import { Sparkles, Bookmark, Scissors, Layers, Check } from 'lucide-react';
import "./StyleConfigurationModal.css";

const StyleConfiguratorModal = ({ order, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    lapelStyle: order.lapelStyle || 'PEAK_LAPEL',
    liningFabric: order.liningFabric || 'BEMBERG_SILK_CRIMSON',
    buttonType: order.buttonType || 'REAL_HORN',
    ventStyle: order.ventStyle || 'DOUBLE_BRITISH_VENT',
    pocketStyle: order.pocketStyle || 'SLANTED_TICKET_POCKET',
    monogramText: order.monogramText || '',
    monogramFont: order.monogramFont || 'ITALIC_CURSIVE',
    monogramThreadColor: order.monogramThreadColor || 'GOLD',
    monogramPlacement: order.monogramPlacement || 'INNER_JACKET_POCKET'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOrderStyles(order.id, formData);
      alert('Bespoke Style Configurator & Monogram Specs Updated!');
      onSuccess();
    } catch (err) {
      alert('Failed to update style configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="style-modal-overlay">
      <div className="style-modal-content">
        <div className="style-modal-header">
          <div>
            <span className="sm-kicker"><Sparkles size={14} /> HAUTE COUTURE BESPOKE STUDIO</span>
            <h2>Custom Style & Monogram Configurator</h2>
            <p>Commission Ref: <strong>{order.orderNumber}</strong> | Client: <strong>{order.customerName}</strong> ({order.garmentType})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="style-form-layout">
          {/* Section 1: Lapel Style Options */}
          <div className="style-section">
            <label className="section-label">1. Lapel Architecture</label>
            <div className="option-chips-grid">
              {[
                { id: 'PEAK_LAPEL', name: 'Peak Lapel', sub: 'Tom Ford / Formal statement' },
                { id: 'NOTCH_LAPEL', name: 'Classic Notch', sub: 'Single breasted business standard' },
                { id: 'SHAWL_COLLAR', name: 'Shawl Lapel', sub: 'Black-Tie Red Carpet Tuxedo' },
                { id: 'MANDARIN', name: 'Mandarin Collar', sub: 'Bandhgala / Royal Heritage' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  className={`chip-card ${formData.lapelStyle === opt.id ? 'selected' : ''}`}
                  onClick={() => handleSelectOption('lapelStyle', opt.id)}
                >
                  <div className="chip-header">
                    <strong>{opt.name}</strong>
                    {formData.lapelStyle === opt.id && <Check size={14} color="#d4af37" />}
                  </div>
                  <small>{opt.sub}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Inner Silk Lining */}
          <div className="style-section">
            <label className="section-label">2. Inner Bemberg Silk Lining</label>
            <div className="option-chips-grid">
              {[
                { id: 'BEMBERG_SILK_CRIMSON', name: 'Crimson Scarlet', sub: 'Classic Italian contrast silk' },
                { id: 'GOLD_JACQUARD', name: 'Royal Gold Paisley', sub: 'Luxury Haute Couture jacquard' },
                { id: 'MIDNIGHT_NAVY_SATIN', name: 'Midnight Navy Satin', sub: 'Subtle tone-on-tone elegance' },
                { id: 'EMERALD_GREEN', name: 'Emerald Velvet Twill', sub: 'Signature bespoke lining' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  className={`chip-card ${formData.liningFabric === opt.id ? 'selected' : ''}`}
                  onClick={() => handleSelectOption('liningFabric', opt.id)}
                >
                  <div className="chip-header">
                    <strong>{opt.name}</strong>
                    {formData.liningFabric === opt.id && <Check size={14} color="#d4af37" />}
                  </div>
                  <small>{opt.sub}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Luxury Buttons */}
          <div className="style-section">
            <label className="section-label">3. Hand-Carved Buttons</label>
            <div className="option-chips-grid">
              {[
                { id: 'REAL_HORN', name: 'Real Water Buffalo Horn', sub: 'Matte dark brown organic horn' },
                { id: 'MOTHER_OF_PEARL', name: 'Mother of Pearl', sub: 'Genuine iridescent oyster shell' },
                { id: 'GOLD_CREST', name: 'Gold Blazer Crest', sub: 'Embossed military royal brass' },
                { id: 'MATTE_BRASS', name: 'Antique Matte Brass', sub: 'Subtle vintage patina finish' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  className={`chip-card ${formData.buttonType === opt.id ? 'selected' : ''}`}
                  onClick={() => handleSelectOption('buttonType', opt.id)}
                >
                  <div className="chip-header">
                    <strong>{opt.name}</strong>
                    {formData.buttonType === opt.id && <Check size={14} color="#d4af37" />}
                  </div>
                  <small>{opt.sub}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Vents & Pockets */}
          <div className="style-two-col">
            <div className="form-group">
              <label>Back Vent Styling</label>
              <select name="ventStyle" value={formData.ventStyle} onChange={handleChange}>
                <option value="DOUBLE_BRITISH_VENT">Double British Side Vents (Savile Row)</option>
                <option value="SINGLE_VENT">Single Center Vent (American Classic)</option>
                <option value="NO_VENT">No Vent / Closed Back (Italian Dinner Suit)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Waist Pocket Architecture</label>
              <select name="pocketStyle" value={formData.pocketStyle} onChange={handleChange}>
                <option value="SLANTED_TICKET_POCKET">Slanted Flap with Ticket Pocket (Hacking)</option>
                <option value="STRAIGHT_FLAP">Classic Straight Flap Pockets</option>
                <option value="JETTED">Double Jetted Slim (Tuxedo Formal)</option>
              </select>
            </div>
          </div>

          {/* Section 5: Personalized Monogram Studio */}
          <div className="monogram-studio-card">
            <div className="ms-header">
              <Bookmark size={16} color="#d4af37" />
              <h4>Personalized Silk Monogram Embroidery</h4>
            </div>

            <div className="ms-inputs-grid">
              <div className="form-group">
                <label>Initials / Name Text</label>
                <input
                  name="monogramText"
                  placeholder="e.g. M.R. or MUNISH"
                  value={formData.monogramText}
                  onChange={handleChange}
                  maxLength={15}
                />
              </div>

              <div className="form-group">
                <label>Embroidery Font</label>
                <select name="monogramFont" value={formData.monogramFont} onChange={handleChange}>
                  <option value="ITALIC_CURSIVE">Italic Script (Old English)</option>
                  <option value="BLOCK_SERIF">Royal Block Serif</option>
                </select>
              </div>

              <div className="form-group">
                <label>Silk Thread Color</label>
                <select name="monogramThreadColor" value={formData.monogramThreadColor} onChange={handleChange}>
                  <option value="GOLD">Champagne Gold Silk</option>
                  <option value="PLATINUM">Platinum Silver Silk</option>
                  <option value="BURGUNDY">Royal Burgundy</option>
                  <option value="ROYAL_BLUE">Midnight Royal Blue</option>
                </select>
              </div>

              <div className="form-group">
                <label>Placement on Garment</label>
                <select name="monogramPlacement" value={formData.monogramPlacement} onChange={handleChange}>
                  <option value="INNER_JACKET_POCKET">Inside Left Chest Pocket</option>
                  <option value="LEFT_CUFF">Left Shirt / Jacket Cuff</option>
                  <option value="UNDER_COLLAR">Under Collar Felt (Secret)</option>
                </select>
              </div>
            </div>

            {formData.monogramText && (
              <div className="monogram-live-preview">
                <span>Live Embroidery Preview:</span>
                <div className={`preview-monogram-badge ${formData.monogramThreadColor.toLowerCase()} ${formData.monogramFont.toLowerCase()}`}>
                  {formData.monogramText}
                </div>
                <small>Placing at: {formData.monogramPlacement}</small>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Saving Specs...' : 'Save Style & Monogram Blueprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StyleConfiguratorModal;