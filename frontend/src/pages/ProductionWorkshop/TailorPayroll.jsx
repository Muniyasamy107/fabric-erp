import React, { useEffect, useState } from 'react';
import { getTailorWages, getWageSummary, logTailorWage, settleWageVoucher } from '../../services/tailorWageService';
import { getTailoringOrders } from '../../services/bespokeService';
import WageVoucherPrint from './WageVoucherPrint';
import { DollarSign, UserCheck, PlusCircle, Printer, CheckCircle2, Clock } from 'lucide-react';
import './TailorPayroll.css';

const TailorPayroll = () => {
  const [wages, setWages] = useState([]);
  const [summary, setSummary] = useState(null);
  const [bespokeOrders, setBespokeOrders] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [tailorFilter, setTailorFilter] = useState('ALL');

  // New Wage Form
  const [form, setForm] = useState({
    tailoringOrderId: '',
    orderNumber: '',
    customerName: '',
    garmentType: '3-Piece Suit',
    tailorName: 'Master Rajan',
    pieceRateWage: 2500,
    bonusCommission: 0,
    notes: ''
  });

  const load = async () => {
    try {
      const [wRes, sRes, oRes] = await Promise.all([
        getTailorWages(),
        getWageSummary(),
        getTailoringOrders()
      ]);
      setWages(wRes.data || []);
      setSummary(sRes.data);
      setBespokeOrders(oRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOrderSelect = (orderId) => {
    const ord = bespokeOrders.find((o) => String(o.id) === String(orderId));
    if (ord) {
      // Automatic piece-rate recommendation based on garment
      let defaultRate = 2500;
      if (ord.garmentType.includes('Blazer')) defaultRate = 1200;
      else if (ord.garmentType.includes('Shirt')) defaultRate = 400;
      else if (ord.garmentType.includes('Trouser')) defaultRate = 350;
      else if (ord.garmentType.includes('Sherwani')) defaultRate = 3000;

      setForm({
        ...form,
        tailoringOrderId: ord.id,
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        garmentType: ord.garmentType,
        tailorName: ord.masterTailorName || 'Master Rajan',
        pieceRateWage: defaultRate
      });
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await logTailorWage({
        ...form,
        pieceRateWage: Number(form.pieceRateWage),
        bonusCommission: Number(form.bonusCommission || 0)
      });
      alert('Tailor labour wage entry logged successfully!');
      setShowLogModal(false);
      load();
    } catch (err) {
      alert(err.response?.data || 'Failed to log wage entry');
    }
  };

  const handleSettle = async (wage) => {
    const method = prompt(`Select Payment Method for ${wage.tailorName} (CASH, UPI, BANK_TRANSFER):`, 'CASH');
    if (!method) return;

    try {
      const res = await settleWageVoucher(wage.id, method, 'Settled at boutique atelier desk');
      alert(`Wage Settled! Voucher Generated: ${res.data.voucherNumber}`);
      setSelectedVoucher(res.data);
      load();
    } catch (err) {
      alert('Failed to settle wage voucher.');
    }
  };

  const tailors = ['ALL', ...Array.from(new Set(wages.map((w) => w.tailorName).filter(Boolean)))];

  const filtered = wages.filter(
    (w) => tailorFilter === 'ALL' || w.tailorName === tailorFilter
  );

  return (
    <div className="payroll-page">
      <div className="payroll-header">
        <div>
          <h1 className="payroll-title">Master Tailor Labour & Commission Payroll</h1>
          <p className="payroll-sub">Manage piece-rate stitching wages, bespoke commission disbursement and payment vouchers</p>
        </div>
        <button className="gold-btn" onClick={() => setShowLogModal(true)}>
          <PlusCircle size={16} /> Log Stitching Wage
        </button>
      </div>

      {/* KPI Cards */}
      <div className="payroll-kpi-grid">
        <div className="kpi-card pending">
          <div className="kpi-icon"><Clock size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL PENDING WAGES</span>
            <div className="kpi-val red-val">₹{Number(summary?.totalPendingWages || 0).toFixed(2)}</div>
            <small>{summary?.pendingCount || 0} Pending jobs</small>
          </div>
        </div>

        <div className="kpi-card settled">
          <div className="kpi-icon"><CheckCircle2 size={24} /></div>
          <div>
            <span className="kpi-lbl">DISBURSED LABOUR WAGES</span>
            <div className="kpi-val green-val">₹{Number(summary?.totalPaidWages || 0).toFixed(2)}</div>
            <small>{summary?.paidCount || 0} Vouchers paid</small>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="payroll-toolbar">
        <label>Filter Craftsman / Master:</label>
        <select value={tailorFilter} onChange={(e) => setTailorFilter(e.target.value)}>
          {tailors.map((t) => (
            <option key={t} value={t}>{t === 'ALL' ? 'All Master Tailors' : t}</option>
          ))}
        </select>
        <span className="count-pill">{filtered.length} Wage Entries</span>
      </div>

      {/* Wage Entries Table */}
      <div className="payroll-table-card">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Master Tailor</th>
              <th>Garment & Client</th>
              <th>Piece Rate</th>
              <th>Bonus</th>
              <th>Total Payable</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No labour wage entries recorded yet.</td></tr>
            ) : (
              filtered.map((w) => (
                <tr key={w.id}>
                  <td className="gold-code">{w.orderNumber || 'BESPOKE'}</td>
                  <td><strong>{w.tailorName}</strong></td>
                  <td>
                    <div>{w.garmentType}</div>
                    <small className="muted-text">Client: {w.customerName}</small>
                  </td>
                  <td>₹{Number(w.pieceRateWage || 0).toFixed(2)}</td>
                  <td>₹{Number(w.bonusCommission || 0).toFixed(2)}</td>
                  <td className="bold-amt">₹{Number(w.totalPayable || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-pill ${w.status?.toLowerCase()}`}>
                      {w.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {w.status === 'PENDING' ? (
                        <button className="btn-pay-wage" onClick={() => handleSettle(w)}>
                          Pay Wage
                        </button>
                      ) : (
                        <button className="btn-view-voucher" onClick={() => setSelectedVoucher(w)}>
                          <Printer size={13} /> Voucher
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Log Wage Modal */}
      {showLogModal && (
        <div className="wage-modal-overlay">
          <div className="wage-modal-content">
            <h2>Log Master Tailor Labour Wage</h2>
            <p className="modal-sub">Assign piece-rate stitching wages and fitting bonus for completed jobs</p>

            <form onSubmit={handleLogSubmit}>
              <div className="form-group">
                <label>Select Commissioned Bespoke Order</label>
                <select
                  value={form.tailoringOrderId}
                  onChange={(e) => handleOrderSelect(e.target.value)}
                  required
                >
                  <option value="">-- Choose Workshop Order --</option>
                  {bespokeOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.customerName} ({o.garmentType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Master Tailor Name</label>
                  <input
                    type="text"
                    value={form.tailorName}
                    onChange={(e) => setForm({ ...form, tailorName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Garment Type</label>
                  <input
                    type="text"
                    value={form.garmentType}
                    onChange={(e) => setForm({ ...form, garmentType: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Piece-Rate Stitching Wage (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.pieceRateWage}
                    onChange={(e) => setForm({ ...form, pieceRateWage: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Fitting Bonus / Allowance (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.bonusCommission}
                    onChange={(e) => setForm({ ...form, bonusCommission: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Labour Voucher Audit Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Hand-stitched milanese buttonholes and pick-stitching included..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="total-wage-preview">
                Total Payable: <strong>₹{(Number(form.pieceRateWage || 0) + Number(form.bonusCommission || 0)).toFixed(2)}</strong>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowLogModal(false)}>Cancel</button>
                <button type="submit" className="btn-gold-save">Log Wage Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedVoucher && (
        <WageVoucherPrint
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};

export default TailorPayroll;