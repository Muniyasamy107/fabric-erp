import React, { useEffect, useState } from 'react';
import { getYarnStock, getDyeRecipes, createDyeRecipe } from '../../services/dyeHouseService';
import NewYarnModal from './NewYarnModal';
import NewDyeRecipeModal from './NewDyeRecipeModal';
import DyeRecipePrint from './DyeRecipePrint';
import { Package, FlaskConical, PlusCircle, Printer, Sparkles } from 'lucide-react';
import './DyeHouseLab.css';

// Default Master Recipes to seed if empty
const DEFAULT_RECIPES = [
  {
    shadeName: 'Royal Midnight Navy',
    pantoneTcxCode: '19-4052 TCX',
    colorHex: '#1B2A4A',
    dyeClass: 'Reactive Dye for Cotton/Silk',
    liquorRatio: '1:8',
    dyeingTemperatureCelsius: 85,
    deltaETolerance: 0.45,
    masterDyerName: 'Master Dyer Rangasamy',
    chemicalFormulationRecipe: '1. Reactive Navy Blue 3R: 2.45% o.w.f\n2. Reactive Brilliant Blue: 0.85% o.w.f\n3. Glauber Salt: 45 g/L\n4. Soda Ash: 18 g/L at 60°C'
  },
  {
    shadeName: 'Imperial Ruby Crimson',
    pantoneTcxCode: '19-1664 TCX',
    colorHex: '#8B0000',
    dyeClass: 'Acid Dye for Silk & Wool',
    liquorRatio: '1:10',
    dyeingTemperatureCelsius: 90,
    deltaETolerance: 0.40,
    masterDyerName: 'Chemist Saravanan',
    chemicalFormulationRecipe: '1. Acid Red Scarlet: 3.20% o.w.f\n2. Acid Milling Yellow: 0.40% o.w.f\n3. Formic Acid: 2.0 g/L for pH 4.5 exhaustion'
  },
  {
    shadeName: 'Heritage Emerald Green',
    pantoneTcxCode: '18-5642 TCX',
    colorHex: '#0F3B2C',
    dyeClass: 'Reactive Dye for Cotton/Silk',
    liquorRatio: '1:8',
    dyeingTemperatureCelsius: 85,
    deltaETolerance: 0.50,
    masterDyerName: 'Master Dyer Rangasamy',
    chemicalFormulationRecipe: '1. Reactive Turquoise Blue: 2.10% o.w.f\n2. Reactive Golden Yellow: 1.80% o.w.f\n3. Glauber Salt: 50 g/L\n4. Soda Ash: 20 g/L'
  }
];

const DyeHouseLab = () => {
  const [yarnList, setYarnList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('YARN_STOCK');
  const [showYarnModal, setShowYarnModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [printRecipe, setPrintRecipe] = useState(null);

  const load = async () => {
    try {
      const [yRes, rRes] = await Promise.all([getYarnStock(), getDyeRecipes()]);
      setYarnList(yRes.data || []);
      
      // Auto-seed default Pantone recipes if database is empty
      if (!rRes.data || rRes.data.length === 0) {
        for (const dr of DEFAULT_RECIPES) {
          await createDyeRecipe(dr);
        }
        const fresh = await getDyeRecipes();
        setRecipes(fresh.data || []);
      } else {
        setRecipes(rRes.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalYarnWeight = yarnList.reduce((sum, y) => sum + Number(y.totalWeightKg || 0), 0);

  return (
    <div className="dye-page">
      <div className="dye-header">
        <div>
          <span className="dye-kicker"><Sparkles size={14} /> MILL PRE-WEAVING WET PROCESSING</span>
          <h1 className="dye-title">Yarn Cone Store & Dye Kitchen Recipe Lab</h1>
          <p className="dye-sub">Manage raw yarn cone warehouse inventory, Pantone shade formulation recipes and lab dip spectrophotometer passes</p>
        </div>

        <div className="dye-header-actions">
          {activeTab === 'YARN_STOCK' ? (
            <button className="gold-btn" onClick={() => setShowYarnModal(true)}>
              <PlusCircle size={16} /> + Inward Yarn Consignment
            </button>
          ) : (
            <button className="gold-btn" onClick={() => setShowRecipeModal(true)}>
              <FlaskConical size={16} /> + Formulate Dye Recipe
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dye-tabs-row">
        <button
          className={`tab-btn ${activeTab === 'YARN_STOCK' ? 'active' : ''}`}
          onClick={() => setActiveTab('YARN_STOCK')}
        >
          <Package size={16} /> Raw Yarn Inventory ({totalYarnWeight.toFixed(1)} KG in Store)
        </button>
        <button
          className={`tab-btn ${activeTab === 'DYE_RECIPES' ? 'active' : ''}`}
          onClick={() => setActiveTab('DYE_RECIPES')}
        >
          <FlaskConical size={16} /> Dye Kitchen Pantone Recipes ({recipes.length} Formulations)
        </button>
      </div>

      {/* View 1: Yarn Cone Warehouse */}
      {activeTab === 'YARN_STOCK' && (
        <div className="dye-table-card">
          <table className="dye-table">
            <thead>
              <tr>
                <th>Yarn Lot Number</th>
                <th>Count & Fiber Specification</th>
                <th>Spinning Mill Origin</th>
                <th>Total Stock Weight</th>
                <th>Cartons</th>
                <th>Storage Bay</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {yarnList.length === 0 ? (
                <tr><td colSpan="7" className="empty-text">No yarn consignments in store. Click "+ Inward Yarn Consignment" to add.</td></tr>
              ) : (
                yarnList.map((y) => (
                  <tr key={y.id}>
                    <td className="gold-code">{y.yarnLotNumber}</td>
                    <td>
                      <strong>{y.yarnCountSpecification}</strong>
                      <div className="muted-text">{y.fiberType}</div>
                    </td>
                    <td>{y.yarnOriginMill}</td>
                    <td className="bold-kg">{y.totalWeightKg} KG</td>
                    <td>{y.totalBagsOrBoxes} boxes</td>
                    <td><span className="bay-badge">{y.warehouseRackBay}</span></td>
                    <td>
                      <span className={`status-pill ${(y.yarnStatus || '').toLowerCase()}`}>
                        {y.yarnStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: Dye Kitchen Pantone Formulations */}
      {activeTab === 'DYE_RECIPES' && (
        <div className="recipes-grid">
          {recipes.length === 0 ? (
            <p className="empty-text">No dye recipes formulated yet.</p>
          ) : (
            recipes.map((r) => (
              <div key={r.id} className="recipe-card">
                <div className="rc-top">
                  <div className="rc-color-circle" style={{ backgroundColor: r.colorHex || '#1B2A4A' }}></div>
                  <div>
                    <h3>{r.shadeName}</h3>
                    <span className="pantone-tag">{r.pantoneTcxCode || 'Pantone TCX'}</span>
                  </div>
                </div>

                <div className="rc-body">
                  <div className="rc-row"><span>Dye Class:</span> <strong>{r.dyeClass}</strong></div>
                  <div className="rc-row"><span>Liquor Ratio:</span> <strong>{r.liquorRatio}</strong></div>
                  <div className="rc-row"><span>Dyeing Temp:</span> <strong>{r.dyeingTemperatureCelsius}°C</strong></div>
                  <div className="rc-row"><span>Delta E:</span> <strong className="green-txt">ΔE = {r.deltaETolerance}</strong></div>
                </div>

                <div className="rc-footer">
                  <button className="btn-print-recipe" onClick={() => setPrintRecipe(r)}>
                    <Printer size={14} /> Print Recipe Slip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showYarnModal && (
        <NewYarnModal
          onClose={() => setShowYarnModal(false)}
          onSuccess={() => {
            setShowYarnModal(false);
            load();
          }}
        />
      )}

      {showRecipeModal && (
        <NewDyeRecipeModal
          onClose={() => setShowRecipeModal(false)}
          onSuccess={() => {
            setShowRecipeModal(false);
            load();
          }}
        />
      )}

      {printRecipe && (
        <DyeRecipePrint
          recipe={printRecipe}
          onClose={() => setPrintRecipe(null)}
        />
      )}
    </div>
  );
};

export default DyeHouseLab;