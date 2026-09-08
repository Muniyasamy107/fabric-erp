import React, { useEffect, useState } from 'react';
import { getEtpLogs } from '../../services/etpService';
import NewEtpLogModal from './NewEtpLogModal';
import EtpCertificatePrint from './EtpCertificatePrint';
import { Droplets, PlusCircle, Printer, ShieldCheck, Leaf, Activity } from 'lucide-react';
import './EtpSustainabilityMaster.css';

const EtpSustainabilityMaster = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printLog, setPrintLog] = useState(null);

  const load = async () => {
    try {
      const res = await getEtpLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalTreatedKld = logs.reduce((sum, l) => sum + Number(l.recycledPermeateWaterKld || 0), 0);
  const avgRecoveryPct = logs.length > 0 ? (logs.reduce((sum, l) => sum + Number(l.waterRecoveryPercentage || 0), 0) / logs.length).toFixed(1) : 93.5;

  return (
    <div className="etp-page">
      <div className="etp-header">
        <div>
          <span className="etp-kicker"><Leaf size={14} /> ZERO LIQUID DISCHARGE & ESG SUSTAINABILITY</span>
          <h1 className="etp-title">Effluent Treatment Plant (ETP) & Water Recycling</h1>
          <p className="etp-sub">Audit daily dye effluent recovery, RO permeate recycling, ZDHC water lab metrics and ZLD compliance</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Log Daily ETP Audit
        </button>
      </div>

      {/* Sustainability KPI Cards */}
      <div className="etp-kpi-grid">
        <div className="etp-card green-border">
          <div className="kpi-icon"><Droplets size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL WATER RECYCLED</span>
            <div className="kpi-val green-val">{totalTreatedKld.toFixed(1)} KLD</div>
            <small>Reclaimed for Dyeing Vessels</small>
          </div>
        </div>

        <div className="etp-card">
          <div className="kpi-icon"><ShieldCheck size={24} /></div>
          <div>
            <span className="kpi-lbl">AVG WATER RECOVERY RATE</span>
            <div className="kpi-val gold-val">{avgRecoveryPct}%</div>
            <small>Zero Liquid Discharge (ZLD)</small>
          </div>
        </div>

        <div className="etp-card">
          <div className="kpi-icon"><Activity size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL AUDITS RECORDED</span>
            <div className="kpi-val">{logs.length} Audits</div>
            <small>ISO 14001 & TNPCB Compliant</small>
          </div>
        </div>
      </div>

      {/* ETP Logs Table */}
      <div className="etp-table-card">
        <table className="etp-table">
          <thead>
            <tr>
              <th>Log Certificate No</th>
              <th>Audit Date</th>
              <th>Raw Inflow</th>
              <th>RO Recycled</th>
              <th>Recovery %</th>
              <th>Treated pH</th>
              <th>COD / BOD</th>
              <th>ZLD Status</th>
              <th>Lab Certificate</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="9" className="empty-text">No ETP compliance records logged yet.</td></tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id}>
                  <td className="gold-code">{l.logCertificateNumber}</td>
                  <td>
                    <strong>{l.auditDate}</strong>
                    <div className="shift-sub">{l.shiftTiming?.replace(/_/g, ' ')}</div>
                  </td>
                  <td>{l.rawEffluentInflowKld} KLD</td>
                  <td className="green-txt">{l.recycledPermeateWaterKld} KLD</td>
                  <td className="bold-rec">{l.waterRecoveryPercentage}%</td>
                  <td>{l.testedPhValue}</td>
                  <td>{l.chemicalOxygenDemandCod} / {l.biochemicalOxygenDemandBod}</td>
                  <td>
                    <span className="zld-pill passed">
                      {l.zldComplianceStatus?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <button className="btn-print-etp" onClick={() => setPrintLog(l)}>
                      <Printer size={13} /> Certificate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewEtpLogModal
          onClose={() => setShowModal(false)}
          onSuccess={(newLog) => {
            setShowModal(false);
            setPrintLog(newLog);
            load();
          }}
        />
      )}

      {printLog && (
        <EtpCertificatePrint
          log={printLog}
          onClose={() => setPrintLog(null)}
        />
      )}
    </div>
  );
};

export default EtpSustainabilityMaster;