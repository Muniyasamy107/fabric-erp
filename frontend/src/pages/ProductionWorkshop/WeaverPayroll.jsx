import React, { useEffect, useState } from 'react';
import { getWeaverWages, logWeaverWage, payWeaverWage } from '../../services/factoryService';
import { getProductionJobs } from '../../services/factoryService';
import { Coins, CheckCircle, PlusCircle, CreditCard } from 'lucide-react';
import './WeaverPayroll.css';

const WeaverPayroll = () => {
  const [wages, setWages] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ productionJobId: '', weaverName: '', totalWovenMeters: '', ratePerMeter: 30, batchNumber: '', fabricProductName: '' });

  const load = async () => {
    try {
      const [wRes, jRes] = await Promise.all([getWeaverWages(), getProductionJobs()]);
      setWages(wRes.data || []);
      setJobs(jRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleJobChange = (jobId) => {
    const matched = jobs.find(j => String(j.id) === String(jobId));
    if (matched) {
      setForm({
        ...form,
        productionJobId: matched.id,
        batchNumber: matched.batchNumber,
        fabricProductName: matched.fabricProductName,
        totalWovenMeters: matched.producedMeters || 50,
        weaverName: matched.masterWeaverName || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logWeaverWage({
        ...form,
        totalWovenMeters: Number(form.totalWovenMeters),
        ratePerMeter: Number(form.ratePerMeter)
      });
      alert('Weaver Wage logged successfully!');
      setShowModal(false);
      load();
    } catch (err) {
      alert('Failed to log wage');
    }
  };

  const handlePay = async (id) => {
    try {
      await payWeaverWage(id, 'BANK_TRANSFER');
      alert('Wage Voucher successfully transferred to Bank!');
      load();
    } catch (err) {
      alert('Failed to settle');
    }
  };

  return (
    <div className="pay-page">
      <div className="pay-header">
        <div>
          <h1>Weaver Wage Ledger & Dispatch</h1>
          <p>Disburse piece-rate compensation directly to operators based on completed loom yardage</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}><PlusCircle size={16} /> Log Weaver Wages</button>
      </div>

      <div className="pay-table-card">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Lot Ref</th>
              <th>Weaver Name</th>
              <th>Woven Meters</th>
              <th>Rate / m</th>
              <th>Total Payable</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wages.map((w) => (
              <tr key={w.id}>
                <td className="gold-code">{w.batchNumber}</td>
                <td><strong>{w.weaverName}</strong></td>
                <td>{w.totalWovenMeters} m</td>
                <td>₹{w.ratePerMeter}</td>
                <td className="tot-w">₹{Number(w.totalPayableWage).toFixed(2)}</td>
                <td><span className={`status-pill ${w.paymentStatus?.toLowerCase()}`}>{w.paymentStatus}</span></td>
                <td>
                  {w.paymentStatus === 'PENDING' ? (
                    <button className="btn-pay-op" onClick={() => handlePay(w.id)}><CreditCard size={12} /> Settle Bank</button>
                  ) : (
                    <span className="settled-lbl"><CheckCircle size={12} /> Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="wage-modal-overlay">
          <div className="wage-modal">
            <h2>Log Machine Operator Wages</h2>
            <form onSubmit={handleSubmit}>
              <label>Select Production Lot</label>
              <select onChange={(e) => handleJobChange(e.target.value)}>
                <option value="">-- Choose Batch Lot --</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.batchNumber} — {j.fabricProductName}</option>)}
              </select>

              <label>Operator Weaver Name</label>
              <input value={form.weaverName} onChange={(e) => setForm({...form, weaverName: e.target.value})} required />

              <div className="form-row">
                <div className="form-group">
                  <label>Woven Length (Meters)</label>
                  <input type="number" value={form.totalWovenMeters} onChange={(e) => setForm({...form, totalWovenMeters: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Factory Rate / Meter (₹)</label>
                  <input type="number" value={form.ratePerMeter} onChange={(e) => setForm({...form, ratePerMeter: e.target.value})} required />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-gold-save">Log Wage</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeaverPayroll;