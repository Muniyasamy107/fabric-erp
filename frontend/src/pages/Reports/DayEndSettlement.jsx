import React, { useEffect, useState } from 'react';
import { getTodayLiveSummary, closeShiftRegister, getShiftHistory } from '../../services/shiftService';
import { useAuth } from '../../context/AuthContext';
import ZReportPrint from './ZReportPrint';
import { Lock, Calculator, Banknote, CreditCard, QrCode, Printer, CheckCircle } from 'lucide-react';
import './DayEndSettlement.css';

const DayEndSettlement = () => {
  const { user } = useAuth();
  const [liveSummary, setLiveSummary] = useState(null);
  const [openingFloat, setOpeningFloat] = useState(5000); // Default ₹5,000 float
  const [denominations, setDenominations] = useState({
    c500: 0,
    c200: 0,
    c100: 0,
    c50: 0,
    c20: 0,
    c10: 0,
    coins: 0
  });
  const [closingNotes, setClosingNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [selectedZReport, setSelectedZReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [liveRes, histRes] = await Promise.all([getTodayLiveSummary(), getShiftHistory()]);
      setLiveSummary(liveRes.data);
      setHistory(histRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Calculate actual cash from denomination counter
  const actualCashCounted =
    (Number(denominations.c500) || 0) * 500 +
    (Number(denominations.c200) || 0) * 200 +
    (Number(denominations.c100) || 0) * 100 +
    (Number(denominations.c50) || 0) * 50 +
    (Number(denominations.c20) || 0) * 20 +
    (Number(denominations.c10) || 0) * 10 +
    (Number(denominations.coins) || 0);

  const cashSales = Number(liveSummary?.cashSales || 0);
  const expectedCashInDrawer = Number(openingFloat || 0) + cashSales;
  const variance = actualCashCounted - expectedCashInDrawer;

  const handleCloseShift = async (e) => {
    e.preventDefault();
    if (actualCashCounted <= 0) {
      const ok = window.confirm('Physical cash counted is ₹0. Confirm drawer close?');
      if (!ok) return;
    }

    try {
      const payload = {
        shiftDate: liveSummary?.shiftDate,
        cashierUsername: user?.username || 'admin',
        cashierFullName: user?.fullName || 'Boutique Manager',
        openingFloat: Number(openingFloat),
        cashSales: cashSales,
        cardSales: Number(liveSummary?.cardSales || 0),
        upiSales: Number(liveSummary?.upiSales || 0),
        totalGrossSales: Number(liveSummary?.totalGrossSales || 0),
        actualCashCounted: actualCashCounted,
        totalBillsCount: liveSummary?.totalBillsCount || 0,
        totalMetersSold: liveSummary?.totalMetersSold || 0,
        closingNotes: closingNotes
      };

      const res = await closeShiftRegister(payload);
      alert('Shift Register Closed & Official Z-Report Generated!');
      setSelectedZReport(res.data);
      load();
    } catch (err) {
      alert('Failed to close shift register');
    }
  };

  if (loading) {
    return <div className="settlement-loading">Auditing Live Drawer Balances...</div>;
  }

  return (
    <div className="settlement-page">
      <div className="settlement-header">
        <div>
          <h1 className="settlement-title">Day-End Drawer & Shift Settlement</h1>
          <p className="settlement-sub">Reconcile physical cash drawer, verify EDC card totals and generate official Z-Report</p>
        </div>
      </div>

      <div className="settlement-grid">
        {/* Left Side: Live Channel Totals & Denomination Counter */}
        <div className="drawer-audit-card">
          <h3><Banknote size={18} /> Live Shift Sales Breakdown</h3>

          <div className="channel-cards-row">
            <div className="ch-box">
              <span className="ch-lbl"><Banknote size={14} /> Cash Sales</span>
              <div className="ch-val">₹{cashSales.toFixed(2)}</div>
            </div>
            <div className="ch-box">
              <span className="ch-lbl"><CreditCard size={14} /> Card EDC</span>
              <div className="ch-val">₹{Number(liveSummary?.cardSales || 0).toFixed(2)}</div>
            </div>
            <div className="ch-box">
              <span className="ch-lbl"><QrCode size={14} /> UPI / QR</span>
              <div className="ch-val">₹{Number(liveSummary?.upiSales || 0).toFixed(2)}</div>
            </div>
          </div>

          <div className="opening-float-row">
            <label>Morning Opening Cash Float (₹):</label>
            <input
              type="number"
              value={openingFloat}
              onChange={(e) => setOpeningFloat(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>

          <h4 className="denom-heading"><Calculator size={16} /> Physical Cash Denomination Counter</h4>
          <div className="denom-grid">
            <div className="d-cell"><span>₹500 ×</span><input type="number" min="0" value={denominations.c500} onChange={(e) => setDenominations({...denominations, c500: e.target.value})} /></div>
            <div className="d-cell"><span>₹200 ×</span><input type="number" min="0" value={denominations.c200} onChange={(e) => setDenominations({...denominations, c200: e.target.value})} /></div>
            <div className="d-cell"><span>₹100 ×</span><input type="number" min="0" value={denominations.c100} onChange={(e) => setDenominations({...denominations, c100: e.target.value})} /></div>
            <div className="d-cell"><span>₹50 ×</span><input type="number" min="0" value={denominations.c50} onChange={(e) => setDenominations({...denominations, c50: e.target.value})} /></div>
            <div className="d-cell"><span>₹20 ×</span><input type="number" min="0" value={denominations.c20} onChange={(e) => setDenominations({...denominations, c20: e.target.value})} /></div>
            <div className="d-cell"><span>₹10 ×</span><input type="number" min="0" value={denominations.c10} onChange={(e) => setDenominations({...denominations, c10: e.target.value})} /></div>
            <div className="d-cell"><span>Coins ₹</span><input type="number" min="0" value={denominations.coins} onChange={(e) => setDenominations({...denominations, coins: e.target.value})} /></div>
          </div>

          <div className="notes-block">
            <label>Manager Closing Observations:</label>
            <textarea
              rows="2"
              placeholder="e.g. All EDC batches settled, cash deposited into drop safe..."
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Side: Reconciliation & Lock Button */}
        <div className="reconciliation-panel">
          <h3>Reconciliation & Z-Lock</h3>

          <div className="rec-summary-list">
            <div className="rec-row">
              <span>Opening Float:</span>
              <strong>₹{Number(openingFloat || 0).toFixed(2)}</strong>
            </div>
            <div className="rec-row">
              <span>+ Live Cash Inflow:</span>
              <strong>₹{cashSales.toFixed(2)}</strong>
            </div>
            <div className="rec-row total-expected">
              <span>Expected Cash in Drawer:</span>
              <span className="gold-text">₹{expectedCashInDrawer.toFixed(2)}</span>
            </div>

            <div className="rec-row counted-row">
              <span>Counted Physical Cash:</span>
              <span>₹{actualCashCounted.toFixed(2)}</span>
            </div>

            <div className={`variance-banner ${variance === 0 ? 'matched' : variance < 0 ? 'short' : 'excess'}`}>
              <span>DRAWER VARIANCE:</span>
              <strong>
                {variance === 0 && '₹0.00 (BALANCED)'}
                {variance < 0 && `-₹${Math.abs(variance).toFixed(2)} (SHORTAGE)`}
                {variance > 0 && `+₹${variance.toFixed(2)} (EXCESS)`}
              </strong>
            </div>
          </div>

          <button className="btn-close-shift" onClick={handleCloseShift}>
            <Lock size={18} /> Reconcile & Generate Z-Report
          </button>
        </div>
      </div>

      {/* Past Shift Z-Reports History */}
      <div className="shift-history-card">
        <h3>Past Closed Shift Z-Reports</h3>
        <table className="shift-table">
          <thead>
            <tr>
              <th>Shift Date</th>
              <th>Audited By</th>
              <th>Gross Revenue</th>
              <th>Cash Counted</th>
              <th>Expected Cash</th>
              <th>Variance</th>
              <th>Z-Slip</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan="7" className="empty-text">No past shift settlement records.</td></tr>
            ) : (
              history.map((s) => (
                <tr key={s.id}>
                  <td className="gold-text">{s.shiftDate}</td>
                  <td>{s.cashierFullName}</td>
                  <td>₹{Number(s.totalGrossSales || 0).toFixed(2)}</td>
                  <td>₹{Number(s.actualCashCounted || 0).toFixed(2)}</td>
                  <td>₹{Number(s.expectedCashInDrawer || 0).toFixed(2)}</td>
                  <td>
                    <span className={`diff-tag ${Number(s.cashDifference || 0) === 0 ? 'matched' : Number(s.cashDifference || 0) < 0 ? 'short' : 'excess'}`}>
                      {Number(s.cashDifference || 0) === 0 ? 'Balanced' : `₹${s.cashDifference}`}
                    </span>
                  </td>
                  <td>
                    <button className="btn-view-z" onClick={() => setSelectedZReport(s)}>
                      <Printer size={14} /> Print Z-Report
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedZReport && (
        <ZReportPrint
          shift={selectedZReport}
          onClose={() => setSelectedZReport(null)}
        />
      )}
    </div>
  );
};

export default DayEndSettlement;