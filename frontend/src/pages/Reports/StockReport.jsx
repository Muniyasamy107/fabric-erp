import React, { useEffect, useState } from 'react';
import { getStockMovements, recordWastage } from '../../services/stockService';
import { getFabrics } from '../../services/fabricService';
import { ArrowDownLeft, ArrowUpRight, Scissors, AlertOctagon, Download } from 'lucide-react';
import './StockReport.css';

const StockReport = () => {
  const [movements, setMovements] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showWastageModal, setShowWastageModal] = useState(false);
  const [wastageForm, setWastageForm] = useState({
    fabricId: '',
    meters: '',
    referenceNumber: '',
    notes: ''
  });

  const load = async () => {
    try {
      const [mvRes, fabRes] = await Promise.all([getStockMovements(), getFabrics()]);
      setMovements(mvRes.data || []);
      setFabrics(fabRes.data || []);
      if (fabRes.data && fabRes.data.length > 0 && !wastageForm.fabricId) {
        setWastageForm((prev) => ({ ...prev, fabricId: fabRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleWastageSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordWastage({
        fabricId: Number(wastageForm.fabricId),
        meters: Number(wastageForm.meters),
        referenceNumber: wastageForm.referenceNumber,
        notes: wastageForm.notes
      });
      alert('Wastage written off successfully');
      setShowWastageModal(false);
      setWastageForm({ fabricId: fabrics[0]?.id || '', meters: '', referenceNumber: '', notes: '' });
      load();
    } catch (err) {
      alert(err.response?.data || 'Failed to record wastage');
    }
  };

  const exportCSV = () => {
    if (movements.length === 0) return;
    const headers = 'ID,SKU,Fabric Name,Type,Meters,Balance After,Ref No,Notes,Date\n';
    const rows = movements
      .map(
        (m) =>
          `"${m.id}","${m.itemCode}","${m.fabricName}","${m.movementType}",${m.meters},${m.balanceAfter},"${m.referenceNumber}","${m.notes}","${m.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stock_Movement_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = movements.filter(
    (m) => typeFilter === 'ALL' || m.movementType === typeFilter
  );

  return (
    <div className="ledger-page">
      <div className="ledger-header">
        <div>
          <h1 className="ledger-title">Stock Movement & Wastage Ledger</h1>
          <p className="ledger-sub">Audited real-time logs of roll inward, counter sales cuts, and flaw write-offs</p>
        </div>
        <div className="header-btns">
          <button className="btn-wastage" onClick={() => setShowWastageModal(true)}>
            <AlertOctagon size={16} /> Record Flaw / Wastage
          </button>
          <button className="btn-export-gold" onClick={exportCSV}>
            <Download size={16} /> Export Audit CSV
          </button>
        </div>
      </div>

      <div className="ledger-filter-bar">
        <label>Filter Movement:</label>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">All Transactions</option>
          <option value="INWARD">Mill Inward (+)</option>
          <option value="SALE_CUT">Counter Sale Cuts (-)</option>
          <option value="WASTAGE">Damage / Wastage (-)</option>
        </select>
        <span className="count-pill">{filtered.length} entries</span>
      </div>

      <div className="ledger-table-card">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Fabric SKU & Material</th>
              <th>Action Type</th>
              <th>Movement</th>
              <th>Roll Balance</th>
              <th>Reference No</th>
              <th>Audit Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No stock ledger records found.</td>
              </tr>
            ) : (
              filtered.map((m) => {
                const isPositive = Number(m.meters) > 0;
                return (
                  <tr key={m.id}>
                    <td>{m.createdAt ? new Date(m.createdAt).toLocaleString('en-IN') : 'N/A'}</td>
                    <td>
                      <strong className="gold-text">{m.itemCode}</strong>
                      <div className="muted-sub">{m.fabricName}</div>
                    </td>
                    <td>
                      <span className={`type-tag ${m.movementType?.toLowerCase()}`}>
                        {m.movementType === 'INWARD' && <ArrowDownLeft size={12} />}
                        {m.movementType === 'SALE_CUT' && <Scissors size={12} />}
                        {m.movementType === 'WASTAGE' && <AlertOctagon size={12} />}
                        {m.movementType}
                      </span>
                    </td>
                    <td className={`meters-cell ${isPositive ? 'pos' : 'neg'}`}>
                      {isPositive ? `+${m.meters} m` : `${m.meters} m`}
                    </td>
                    <td className="bold-balance">{m.balanceAfter != null ? `${m.balanceAfter} m` : '-'}</td>
                    <td><span className="ref-badge">{m.referenceNumber}</span></td>
                    <td className="notes-col">{m.notes}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showWastageModal && (
        <div className="wastage-overlay">
          <div className="wastage-modal">
            <h2>Record Fabric Damage / Wastage</h2>
            <p className="modal-sub">Deduct flawed fabric cut or roll end-bit from active inventory</p>

            <form onSubmit={handleWastageSubmit}>
              <label>Select Fabric Roll</label>
              <select
                value={wastageForm.fabricId}
                onChange={(e) => setWastageForm({ ...wastageForm, fabricId: e.target.value })}
                required
              >
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.itemCode} - {f.name} ({f.totalAvailableMeters}m available)
                  </option>
                ))}
              </select>

              <label>Wasted Meters (to deduct)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 1.2"
                value={wastageForm.meters}
                onChange={(e) => setWastageForm({ ...wastageForm, meters: e.target.value })}
                required
              />

              <label>Reference Tag / Ticket</label>
              <input
                type="text"
                placeholder="e.g. FLAW-CUT-99"
                value={wastageForm.referenceNumber}
                onChange={(e) => setWastageForm({ ...wastageForm, referenceNumber: e.target.value })}
              />

              <label>Reason & Tailor/Cutter Notes</label>
              <textarea
                rows="3"
                placeholder="e.g. Weave defect near roll core / oil stain from loom"
                value={wastageForm.notes}
                onChange={(e) => setWastageForm({ ...wastageForm, notes: e.target.value })}
              />

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowWastageModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-danger-submit">
                  Deduct & Log Wastage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReport;