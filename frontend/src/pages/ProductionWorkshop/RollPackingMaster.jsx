import React, { useEffect, useState } from 'react';
import { getAllPackedRolls } from '../../services/rollPackingService';
import { getProductionJobs } from '../../services/factoryService';
import PackNewRollModal from './PackNewRollModal';
import RollStickerTagPrint from './RollStickerTagPrint';
import BaleManifestPrint from './BaleManifestPrint';
import { Package, PlusCircle, Printer, FileText, QrCode, Sparkles } from 'lucide-react';
import './RollPackingMaster.css';

const RollPackingMaster = () => {
  const [rolls, setRolls] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showPackModal, setShowPackModal] = useState(false);
  const [printRollSticker, setPrintRollSticker] = useState(null);
  const [printBaleManifest, setPrintBaleManifest] = useState(null); // { baleNo, rolls }
  const [baleFilter, setBaleFilter] = useState('ALL');

  const load = async () => {
    try {
      const [rRes, jRes] = await Promise.all([getAllPackedRolls(), getProductionJobs()]);
      setRolls(rRes.data || []);
      setJobs(jRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalPackedMeters = rolls.reduce((sum, r) => sum + Number(r.netLengthMeters || 0), 0);
  const bales = ['ALL', ...Array.from(new Set(rolls.map((r) => r.balePackageNumber).filter(Boolean)))];

  const filtered = rolls.filter(
    (r) => baleFilter === 'ALL' || r.balePackageNumber === baleFilter
  );

  const handlePrintBaleManifest = (baleNo) => {
    const matchedRolls = rolls.filter((r) => r.balePackageNumber === baleNo);
    setPrintBaleManifest({ baleNo, rolls: matchedRolls });
  };

  return (
    <div className="pack-page">
      <div className="pack-header">
        <div>
          <span className="pack-kicker"><Sparkles size={14} /> WAREHOUSE DOFFING & PACKING TERMINAL</span>
          <h1 className="pack-title">Finished Fabric Roll Packing & Bale Manifest</h1>
          <p className="pack-sub">Doff 50m/100m pieces, print QR barcode thermal roll stickers and compile container bale packing lists</p>
        </div>
        <button className="gold-btn" onClick={() => setShowPackModal(true)}>
          <PlusCircle size={16} /> + Pack New Fabric Roll
        </button>
      </div>

      {/* KPI & Filter Toolbar */}
      <div className="pack-toolbar">
        <div className="tb-select-group">
          <label>Filter Bale / Crate:</label>
          <select value={baleFilter} onChange={(e) => setBaleFilter(e.target.value)}>
            {bales.map((b) => (
              <option key={b} value={b}>{b === 'ALL' ? 'All Packed Bales' : b}</option>
            ))}
          </select>
        </div>

        {baleFilter !== 'ALL' && (
          <button className="btn-manifest-print" onClick={() => handlePrintBaleManifest(baleFilter)}>
            <FileText size={14} /> Print Bale Manifest ({baleFilter})
          </button>
        )}

        <span className="count-pill">{filtered.length} Rolls ({totalPackedMeters.toFixed(1)} m Total)</span>
      </div>

      {/* Rolls Inventory Table */}
      <div className="pack-table-card">
        <table className="pack-table">
          <thead>
            <tr>
              <th>Roll Barcode Serial</th>
              <th>Fabric Quality</th>
              <th>Batch Lot</th>
              <th>Piece Meters</th>
              <th>Net Weight</th>
              <th>Grade</th>
              <th>Storage Bay</th>
              <th>Bale Ref</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="9" className="empty-text">No packed rolls in finished warehouse.</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td className="gold-code">{r.rollBarcodeNumber}</td>
                  <td><strong>{r.fabricProductName}</strong></td>
                  <td>{r.batchLotNumber}</td>
                  <td className="meters-col">{r.netLengthMeters} m</td>
                  <td>{r.netWeightKg} kg</td>
                  <td><span className="grade-badge">{r.qualityGrade}</span></td>
                  <td>{r.warehouseBin}</td>
                  <td><span className="bale-pill">{r.balePackageNumber}</span></td>
                  <td>
                    <button className="btn-print-tag" onClick={() => setPrintRollSticker(r)}>
                      <QrCode size={13} /> QR Sticker
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPackModal && (
        <PackNewRollModal
          jobs={jobs}
          onClose={() => setShowPackModal(false)}
          onSuccess={(newRoll) => {
            setShowPackModal(false);
            setPrintRollSticker(newRoll);
            load();
          }}
        />
      )}

      {printRollSticker && (
        <RollStickerTagPrint
          roll={printRollSticker}
          onClose={() => setPrintRollSticker(null)}
        />
      )}

      {printBaleManifest && (
        <BaleManifestPrint
          baleNumber={printBaleManifest.baleNo}
          rolls={printBaleManifest.rolls}
          onClose={() => setPrintBaleManifest(null)}
        />
      )}
    </div>
  );
};

export default RollPackingMaster;