import React, { useEffect, useState } from 'react';
import { getQualityReports } from '../../services/qualityService';
import { getProductionJobs } from '../../services/factoryService';
import NewInspectionModal from './NewInspectionModal';
import LabCertificatePrint from './LabCertificatePrint';
import { Award, PlusCircle, Printer, ShieldCheck, AlertOctagon } from 'lucide-react';
import './QualityInspectionList.css';

const QualityInspectionList = () => {
  const [reports, setReports] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [printReport, setPrintReport] = useState(null);
  const [gradeFilter, setGradeFilter] = useState('ALL');

  const load = async () => {
    try {
      const [rRes, jRes] = await Promise.all([getQualityReports(), getProductionJobs()]);
      setReports(rRes.data || []);
      setJobs(jRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    // Live refresh — data updates in real time
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  const filtered = reports.filter(
    (r) => gradeFilter === 'ALL' || r.finalVerdict === gradeFilter
  );

  return (
    <div className="qc-page">
      <div className="qc-header">
        <div>
          <span className="qc-kicker">CENTRAL TEXTILE TESTING & AUDIT LAB</span>
          <h1 className="qc-title">Fabric Quality Control & 4-Point Inspection</h1>
          <p className="qc-sub">Perform ASTM 4-Point defect grading, physical lab verification and issue export test certificates</p>
        </div>
        <button className="gold-btn" onClick={() => setShowNewModal(true)}>
          <PlusCircle size={16} /> + New 4-Point Inspection
        </button>
      </div>

      {/* Toolbar */}
      <div className="qc-toolbar">
        <label>Filter Audit Grade:</label>
        <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="ALL">All Inspection Reports</option>
          <option value="GRADE_A_PASS">Grade A (Export Certified)</option>
          <option value="GRADE_B_ACCEPTABLE">Grade B (Commercial Lot)</option>
          <option value="REJECTED_SECONDS">Rejected / Industrial Seconds</option>
        </select>
        <span className="count-pill">{filtered.length} Lab Certificates</span>
      </div>

      {/* Reports Table */}
      <div className="qc-table-card">
        <table className="qc-table">
          <thead>
            <tr>
              <th>Cert Number</th>
              <th>Batch Lot</th>
              <th>Fabric Name</th>
              <th>Inspected Meters</th>
              <th>4-Point Score</th>
              <th>Tested GSM</th>
              <th>Audit Verdict</th>
              <th>Lab Certificate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No quality inspection certificates on record.</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td className="gold-code">{r.certificateNumber}</td>
                  <td><strong>{r.batchLotNumber}</strong></td>
                  <td>{r.fabricProductName}</td>
                  <td>{r.totalInspectedMeters} m</td>
                  <td className="score-val">{r.fourPointScore} pts</td>
                  <td>{r.testedGsm} GSM</td>
                  <td>
                    <span className={`verdict-pill ${(r.finalVerdict || '').toLowerCase()}`}>
                      {r.finalVerdict?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <button className="btn-print-cert" onClick={() => setPrintReport(r)}>
                      <Printer size={13} /> Print Certificate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showNewModal && (
        <NewInspectionModal
          jobs={jobs}
          onClose={() => setShowNewModal(false)}
          onSuccess={(newReport) => {
            setShowNewModal(false);
            setPrintReport(newReport);
            load();
          }}
        />
      )}

      {printReport && (
        <LabCertificatePrint
          report={printReport}
          onClose={() => setPrintReport(null)}
        />
      )}
    </div>
  );
};

export default QualityInspectionList;