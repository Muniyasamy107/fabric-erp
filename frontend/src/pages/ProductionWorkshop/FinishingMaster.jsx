import React, { useEffect, useState } from 'react';
import { getFinishingBatches, updateFinishingStatus } from '../../services/finishingService';
import { getProductionJobs } from '../../services/factoryService';
import NewFinishingModal from './NewFinishingModal';
import FinishingBatchPrint from './FinishingBatchPrint';
import { Sparkles, PlusCircle, Printer, Thermometer, CheckCircle2 } from 'lucide-react';
import './FinishingMaster.css';

const FinishingMaster = () => {
  const [batches, setBatches] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printBatch, setPrintBatch] = useState(null);

  const load = async () => {
    try {
      const [bRes, jRes] = await Promise.all([getFinishingBatches(), getProductionJobs()]);
      setBatches(bRes.data || []);
      setJobs(jRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, newStatus, currentInputMeters) => {
    let outputMeters = currentInputMeters;
    if (newStatus === 'COMPLETED') {
      const m = prompt('Enter final finished delivery meters (after calendering):', currentInputMeters);
      if (m !== null) outputMeters = Number(m);
    }

    try {
      await updateFinishingStatus(id, newStatus, outputMeters);
      load();
    } catch (err) {
      alert('Failed to update finishing stage');
    }
  };

  return (
    <div className="fin-page">
      <div className="fin-header">
        <div>
          <span className="fin-kicker">MILL WET & DRY PROCESSING HOUSE</span>
          <h1 className="fin-title">Stenter, Calendering & Fabric Finishing Master</h1>
          <p className="fin-sub">Queue thermofixation heat setting, high-luster calendering, silicone softening and pre-shrinkage sanforizing</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Queue Finishing Batch
        </button>
      </div>

      <div className="fin-table-card">
        <table className="fin-table">
          <thead>
            <tr>
              <th>Finish Batch No</th>
              <th>Raw Woven Lot</th>
              <th>Fabric Quality</th>
              <th>Machine Line</th>
              <th>Treatment Specification</th>
              <th>Chamber Temp</th>
              <th>Input / Output (m)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr><td colSpan="9" className="empty-text">No finishing batches queued.</td></tr>
            ) : (
              batches.map((b) => (
                <tr key={b.id}>
                  <td className="gold-code">{b.finishBatchNumber}</td>
                  <td><strong>{b.rawBatchLotNumber}</strong></td>
                  <td>{b.fabricProductName}</td>
                  <td><span className="line-tag">{b.machineLine?.replace(/_/g, ' ')}</span></td>
                  <td className="treatment-txt">{b.finishTreatmentType?.replace(/_/g, ' ')}</td>
                  <td className="temp-txt">{b.stenterTemperatureCelsius}°C</td>
                  <td>
                    <strong>{b.inputGreigeMeters}m</strong> ➔ <span className="green-txt">{b.outputFinishedMeters || b.inputGreigeMeters}m</span>
                  </td>
                  <td>
                    <select
                      className={`status-select ${(b.finishStatus || '').toLowerCase()}`}
                      value={b.finishStatus}
                      onChange={(e) => handleStatusChange(b.id, e.target.value, b.inputGreigeMeters)}
                    >
                      <option value="QUEUED">Queued</option>
                      <option value="IN_STENTER">In Stenter Line</option>
                      <option value="CALENDERING">Rotary Calendering</option>
                      <option value="COMPLETED">Finished (Warehouse Ready)</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-print-batch" onClick={() => setPrintBatch(b)}>
                      <Printer size={13} /> Batch Card
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewFinishingModal
          jobs={jobs}
          onClose={() => setShowModal(false)}
          onSuccess={(newBatch) => {
            setShowModal(false);
            setPrintBatch(newBatch);
            load();
          }}
        />
      )}

      {printBatch && (
        <FinishingBatchPrint
          batch={printBatch}
          onClose={() => setPrintBatch(null)}
        />
      )}
    </div>
  );
};

export default FinishingMaster;