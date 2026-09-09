import React from 'react';
import { Printer, X, FlaskConical } from 'lucide-react';
import './DyeRecipePrint.css';

const DyeRecipePrint = ({ recipe, onClose }) => {
  if (!recipe) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="recipe-print-overlay">
      <div className="recipe-print-container">
        <div className="no-print recipe-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Dye Kitchen Formulation Card
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Chemical Recipe Card */}
        <div className="recipe-paper" id="printable-recipe">
          <div className="r-head">
            <div className="r-brand">
              <h1>KAK TEXTILE PROCESSING DYEING DIVISION</h1>
              <p className="r-tag">CENTRAL COLOR KITCHEN & CHEMICAL RECIPE BATCH CARD</p>
              <p className="r-addr">Textile Wet Processing Complex | Shade Matching Lab</p>
            </div>
            <div className="r-meta">
              <div className="r-badge">DYE BATCH CARD</div>
              <p><strong>Recipe Code:</strong> {recipe.recipeCode}</p>
              <p><strong>Issued Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="r-divider"></div>

          {/* Color & Pantone Information */}
          <div className="r-shade-block">
            <div className="r-swatch-circle" style={{ backgroundColor: recipe.colorHex || '#1B2A4A' }}></div>
            <div className="r-shade-details">
              <span className="lbl">COMMISSIONED SHADE & PANTONE:</span>
              <h3>{recipe.shadeName}</h3>
              <p>Pantone Standard: <strong>{recipe.pantoneTcxCode || 'TCX Standard'}</strong> | Hex: {recipe.colorHex || '#1B2A4A'}</p>
            </div>
            <div className="r-delta-box">
              <span className="lbl">SPECTRO TOLERANCE:</span>
              <div className="delta-val">ΔE ≤ {recipe.deltaETolerance || 0.50}</div>
              <small>Grade A Pass Tolerance</small>
            </div>
          </div>

          {/* Dyeing Machine Process Parameters */}
          <div className="r-params-grid">
            <div><span>Dye Chemistry Class:</span> <strong>{recipe.dyeClass || 'Reactive Dye'}</strong></div>
            <div><span>Liquor Ratio (M:L):</span> <strong>{recipe.liquorRatio || '1:8'}</strong></div>
            <div><span>Peak Dyeing Temperature:</span> <strong>{recipe.dyeingTemperatureCelsius || 85}°C</strong></div>
            <div><span>Lab Dip Status:</span> <strong className="green">{recipe.labDipStatus?.replace(/_/g, ' ')}</strong></div>
          </div>

          {/* Chemical Formulation Breakdown */}
          <div className="r-section-title">
            <FlaskConical size={14} /> CHEMICAL & DYESTUFF WEIGHING RECIPE BREAKDOWN (g/L or %)
          </div>

          <div className="r-formula-card">
            <pre>{recipe.chemicalFormulationRecipe || `1. Dyestuff Navy Blue 3R: 2.45% on weight of fabric (o.w.f)\n2. Dyestuff Royal Brilliant Blue: 0.85% o.w.f\n3. Glauber's Salt (Sodium Sulfate): 45.0 g/L (Added at 40°C)\n4. Soda Ash (Sodium Carbonate): 18.0 g/L (Dosing over 30 mins at 60°C)\n5. Levelling & Wetting Aux: 1.5 g/L\n6. Acetic Acid Rinse at 85°C for neutralisation`}</pre>
          </div>

          {/* Dye Master Sign-off */}
          <div className="r-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>Color Lab Chemist Signature</span>
              <small>Spectrophotometer Passed</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>{recipe.masterDyerName || 'Master Dyer'}</span>
              <small>Dye House Kitchen Master</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DyeRecipePrint;