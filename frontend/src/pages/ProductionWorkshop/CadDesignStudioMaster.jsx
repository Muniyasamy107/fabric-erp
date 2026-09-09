import React, { useEffect, useState } from 'react';
import { getCadDesigns, updateSampleStatus } from '../../services/cadDesignService';
import NewSampleDesignModal from './NewSampleDesignModal';
import SampleTechSheetPrint from './SampleTechSheetPrint';
import { Sparkles, PlusCircle, Printer } from 'lucide-react';
import './CadDesignStudioMaster.css';

const CadDesignStudioMaster = () => {
  const [designs, setDesigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printDesign, setPrintDesign] = useState(null);

  const load = async () => {
    try {
      const res = await getCadDesigns();
      setDesigns(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status, curMeters) => {
    let produced = curMeters;
    let awb = '';
    let comments = '';

    if (status === 'FINISHED_SAMPLE') {
      const m = prompt('Enter sample strike-off meters woven on loom:', '8.0');
      if (m !== null) produced = Number(m);
    } else if (status === 'BUYER_APPROVED') {
      comments = prompt('Enter buyer approval comments:', 'Approved for bulk export run.');
    }

    try {
      await updateSampleStatus(id, status, produced, comments, awb);
      load();
    } catch (err) {
      alert('Failed to update sample development status');
    }
  };

  return (
    <div className="cad-page">
      <div className="cad-header">
        <div>
          <span className="cad-kicker"><Sparkles size={14} /> MILL R&D & CAD TEXTILE DESIGN STUDIO</span>
          <h1 className="cad-title">CAD Weave Studio & Buyer Sample Strike-Offs</h1>
          <p className="cad-sub">Draft new weave architectures, Dobby shaft lifting plans, and track buyer sample approvals</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + New CAD Weave Concept
        </button>
      </div>

      <div className="cad-table-card">
        <table className="cad-table">
          <thead>
            <tr>
              <th>Design Code</th>
              <th>Concept & Collection</th>
              <th>Buyer Brand</th>
              <th>Weave Architecture</th>
              <th>Density (EPI × PPI)</th>
              <th>Sample Target</th>
              <th>Pipeline Status</th>
              <th>Tech Card</th>
            </tr>
          </thead>
          <tbody>
            {designs.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No CAD sample designs drafted yet.</td></tr>
            ) : (
              designs.map((d) => (
                <tr key={d.id}>
                  <td className="gold-code">{d.designCode}</td>
                  <td>
                    <strong>{d.designName}</strong>
                    <div className="season-sub">{d.seasonCollection}</div>
                  </td>
                  <td><span className="brand-pill">{d.targetBuyerBrand}</span></td>
                  <td>
                    <div>{d.weaveType?.replace(/_/g, ' ')}</div>
                    <small className="muted-text">{d.numberOfHealdShafts} Shafts Dobby</small>
                  </td>
                  <td>{d.endsPerInchEpi} × {d.picksPerInchPpi}</td>
                  <td className="meters-col">{d.sampleYardageRequiredMeters} m</td>
                  <td>
                    <select
                      className={`status-select ${(d.sampleDevelopmentStatus || '').toLowerCase()}`}
                      value={d.sampleDevelopmentStatus}
                      onChange={(e) => handleStatusChange(d.id, e.target.value, d.sampleYardageProducedMeters)}
                    >
                      <option value="DESIGN_DRAFTING">1. CAD Drafting</option>
                      <option value="SAMPLE_WARPING">2. Sample Warping</option>
                      <option value="SAMPLE_LOOM_WEAVING">3. Loom Weaving</option>
                      <option value="FINISHED_SAMPLE">4. Strike-off Finished</option>
                      <option value="BUYER_APPROVED">5. Buyer Approved ★</option>
                      <option value="RE_SAMPLE_REQUESTED">Re-sample Required</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-print-tech" onClick={() => setPrintDesign(d)}>
                      <Printer size={13} /> Tech Sheet
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewSampleDesignModal
          onClose={() => setShowModal(false)}
          onSuccess={(newDesign) => {
            setShowModal(false);
            setPrintDesign(newDesign);
            load();
          }}
        />
      )}

      {printDesign && (
        <SampleTechSheetPrint
          design={printDesign}
          onClose={() => setPrintDesign(null)}
        />
      )}
    </div>
  );
};

export default CadDesignStudioMaster;