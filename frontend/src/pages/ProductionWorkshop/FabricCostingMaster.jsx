import React, { useEffect, useState } from 'react';
import { getCostSheets } from '../../services/costingService';
import { getFabrics } from '../../services/fabricService';
import NewCostSheetModal from './NewCostSheetModal';
import CostSheetPrint from './CostSheetPrint';
import { Calculator, PlusCircle, Printer, Sparkles, TrendingUp } from 'lucide-react';
import './FabricCostingMaster.css';

const FabricCostingMaster = () => {
  const [sheets, setSheets] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printSheet, setPrintSheet] = useState(null);

  const load = async () => {
    try {
      const [sRes, fRes] = await Promise.all([getCostSheets(), getFabrics()]);
      setSheets(sRes.data || []);
      setFabrics(fRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="costing-page">
      <div className="costing-header">
        <div>
          <span className="costing-kicker"><Sparkles size={14} /> MILL MERCHANDISING & COST ENGINEERING</span>
          <h1 className="costing-title">Fabric Cost of Production (COP) & BOM Costing</h1>
          <p className="costing-sub">Calculate yarn consumption, sizing, weaving conversion, stenter finishing cost and derive ex-mill quotation</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + New BOM Cost Sheet
        </button>
      </div>

      <div className="costing-table-card">
        <table className="costing-table">
          <thead>
            <tr>
              <th>Cost Sheet No</th>
              <th>Fabric Quality</th>
              <th>Warp / Weft Count</th>
              <th>Density (PPI)</th>
              <th>Net Factory COP</th>
              <th>Margin %</th>
              <th>Ex-Mill Price</th>
              <th>Tech Pack</th>
            </tr>
          </thead>
          <tbody>
            {sheets.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No costing sheets calculated yet.</td></tr>
            ) : (
              sheets.map((s) => (
                <tr key={s.id}>
                  <td className="gold-code">{s.costingSheetNumber}</td>
                  <td><strong>{s.fabricName}</strong></td>
                  <td>
                    <div>W: {s.warpCountNe}</div>
                    <small className="muted-text">F: {s.weftCountNe}</small>
                  </td>
                  <td>{s.picksPerInch} PPI</td>
                  <td className="cop-td">₹{Number(s.netProductionCostPerMeter || 0).toFixed(2)}/m</td>
                  <td><span className="margin-pill">{s.targetProfitMarginPct}%</span></td>
                  <td className="ex-price-td">₹{Number(s.recommendedExMillPrice || 0).toFixed(2)}/m</td>
                  <td>
                    <button className="btn-print-cost" onClick={() => setPrintSheet(s)}>
                      <Printer size={13} /> Tech Pack
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewCostSheetModal
          fabrics={fabrics}
          onClose={() => setShowModal(false)}
          onSuccess={(newSheet) => {
            setShowModal(false);
            setPrintSheet(newSheet);
            load();
          }}
        />
      )}

      {printSheet && (
        <CostSheetPrint
          sheet={printSheet}
          onClose={() => setPrintSheet(null)}
        />
      )}
    </div>
  );
};

export default FabricCostingMaster;