import React, { useEffect, useState } from 'react';
import { getAllBeams, mountBeamOnLoom, updateBeamStatus } from '../../services/warpingSizingService';
import { getFabrics } from '../../services/fabricService';
import { getYarnStock } from '../../services/dyeHouseService';
import { getWeavingLooms } from '../../services/factoryService';
import NewBeamModal from './NewBeamModal';
import BeamTicketPrint from './BeamTicketPrint';
import { Layers, PlusCircle, Printer, CheckCircle2, Play, Sparkles } from 'lucide-react';
import './BeamPreparationMaster.css';

const BeamPreparationMaster = () => {
  const [beams, setBeams] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [yarns, setYarns] = useState([]);
  const [looms, setLooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printBeam, setPrintBeam] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = async () => {
    try {
      const [bRes, fRes, yRes, lRes] = await Promise.all([
        getAllBeams(),
        getFabrics(),
        getYarnStock(),
        getWeavingLooms()
      ]);
      setBeams(bRes.data || []);
      setFabrics(fRes.data || []);
      setYarns(yRes.data || []);
      setLooms(lRes.data || []);
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

  const handleMountLoom = async (beamId) => {
    const loomNo = prompt('Enter Loom Number to Mount this Beam (e.g. LOOM-A01, LOOM-A02):', 'LOOM-A01');
    if (!loomNo) return;
    try {
      await mountBeamOnLoom(beamId, loomNo.toUpperCase());
      alert(`Beam successfully gaiting and mounted on ${loomNo.toUpperCase()}! Loom is now ACTIVE.`);
      load();
    } catch (err) {
      alert('Failed to mount beam on loom');
    }
  };

  const filtered = beams.filter(
    (b) => statusFilter === 'ALL' || b.beamStatus === statusFilter
  );

  return (
    <div className="beam-page">
      <div className="beam-header">
        <div>
          <span className="beam-kicker"><Sparkles size={14} /> MILL PRE-WEAVING BEAM PREPARATION</span>
          <h1 className="beam-title">Warping Creel, Sizing & Weaver's Beam Bank</h1>
          <p className="beam-sub">Wound beam warp ends calculation, starch sizing formulation, and loom gaiting allocation</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Prepare New Weaver's Beam
        </button>
      </div>

      <div className="beam-toolbar">
        <label>Filter Beam Bank:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Weaver's Beams</option>
          <option value="READY_IN_BEAM_BANK">Ready in Beam Bank</option>
          <option value="MOUNTED_ON_LOOM">Mounted on Active Loom</option>
          <option value="IN_SIZING">In Sizing Machine Box</option>
          <option value="EXHAUSTED">Exhausted / Empty Core</option>
        </select>
        <span className="count-pill">{filtered.length} Beams Available</span>
      </div>

      <div className="beam-table-card">
        <table className="beam-table">
          <thead>
            <tr>
              <th>Beam No</th>
              <th>Fabric Quality</th>
              <th>Yarn Specification</th>
              <th>Warp Ends</th>
              <th>Beam Length</th>
              <th>Assigned Loom</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No weaver beams in storage bank.</td></tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td className="gold-code">{b.beamNumber}</td>
                  <td><strong>{b.fabricProductName}</strong></td>
                  <td>
                    <div>{b.yarnCountSpecification}</div>
                    <small className="muted-text">Lot: {b.yarnLotNumber}</small>
                  </td>
                  <td className="ends-col">{b.totalWarpEnds} ends</td>
                  <td className="length-col">{b.beamLengthMeters} m</td>
                  <td><span className="loom-tag">{b.assignedLoomNumber || 'Beam Bank'}</span></td>
                  <td>
                    <span className={`status-pill ${(b.beamStatus || '').toLowerCase()}`}>
                      {b.beamStatus?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {b.beamStatus === 'READY_IN_BEAM_BANK' && (
                        <button className="btn-mount-loom" onClick={() => handleMountLoom(b.id)}>
                          <Play size={12} /> Mount on Loom
                        </button>
                      )}
                      <button className="btn-print-beam" onClick={() => setPrintBeam(b)}>
                        <Printer size={13} /> Beam Card
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewBeamModal
          fabrics={fabrics}
          yarns={yarns}
          looms={looms}
          onClose={() => setShowModal(false)}
          onSuccess={(newBeam) => {
            setShowModal(false);
            setPrintBeam(newBeam);
            load();
          }}
        />
      )}

      {printBeam && (
        <BeamTicketPrint
          beam={printBeam}
          onClose={() => setPrintBeam(null)}
        />
      )}
    </div>
  );
};

export default BeamPreparationMaster;