import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { getFabrics } from '../../services/fabricService';
import ScheduleJobModal from './ScheduleJobModal';
import { Settings, PlusCircle, Layers } from 'lucide-react';
import './LoomDashboard.css';

const LoomDashboard = () => {
  const [looms, setLooms] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [activeJobForUpdate, setActiveJobForUpdate] = useState(null);
  
  const [updateFields, setUpdateFields] = useState({
    status: 'WEAVING',
    producedMeters: '',
    wasteMeters: '',
    grade: 'GRADE_A'
  });

  const loadData = async () => {
    try {
      const [loomRes, jobRes, fabRes] = await Promise.all([
        API.get('/production/looms'),
        API.get('/production/jobs'),
        getFabrics()
      ]);
      setLooms(loomRes.data || []);
      setJobs(jobRes.data || []);
      setFabrics(fabRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    // Live refresh — loom statuses update from real-time telemetry
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/production/jobs/${activeJobForUpdate.id}/status`, null, {
        params: {
          status: updateFields.status,
          producedMeters: updateFields.producedMeters ? Number(updateFields.producedMeters) : null,
          wasteMeters: updateFields.wasteMeters ? Number(updateFields.wasteMeters) : null,
          grade: updateFields.grade
        }
      });
      alert('Production Batch Yardage Updated Successfully!');
      setActiveJobForUpdate(null);
      loadData();
    } catch (err) {
      alert('Failed to update batch progress');
    }
  };

  return (
    <div className="loom-page">
      <div className="loom-header">
        <div>
          <span className="loom-kicker">MILL OPERATIONS CONTROL ROOM</span>
          <h1 className="loom-title">Weaving Loom Hall & Production Batches</h1>
          <p className="loom-sub">Track loom status, shuttle RPM, active yarn warp/weft specifications and completed fabric yardage</p>
        </div>
        <button className="gold-btn" onClick={() => setShowJobModal(true)}>
          <PlusCircle size={16} /> + Schedule Production Batch
        </button>
      </div>

      {/* Loom Status Overview */}
      <div className="looms-status-grid">
        {looms.map((l) => (
          <div key={l.id || l.loomNumber} className={`loom-card status-${l.loomStatus?.toLowerCase()}`}>
            <div className="loom-card-header">
              <h3>{l.loomNumber}</h3>
              <span className="loom-type-badge">{l.machineType}</span>
            </div>
            <div className="loom-metric">
              <span>Shuttle Speed:</span>
              <strong>{l.rpmSpeed} RPM</strong>
            </div>
            <div className="loom-yarn">
              <span>Yarn Warp/Weft:</span>
              <p>{l.currentYarnSpecification || 'Cotton 80s Compact / Silk Warp'}</p>
            </div>
            <div className="loom-footer">
              <span>Operator: {l.activeOperatorName || 'Staff'}</span>
              <span className={`status-text ${l.loomStatus?.toLowerCase()}`}>
                {l.loomStatus?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Production Jobs Table */}
      <div className="jobs-table-card">
        <div className="jobs-table-header">
          <h2>Active Production Batches (Consignments)</h2>
          <span className="batch-count">{jobs.length} Active Lots</span>
        </div>

        <table className="jobs-list-table">
          <thead>
            <tr>
              <th>Lot / Batch No</th>
              <th>Fabric Quality</th>
              <th>Assigned Loom</th>
              <th>Target Meters</th>
              <th>Produced Meters</th>
              <th>Scrap Wastage</th>
              <th>Grade</th>
              <th>Production Status</th>
              <th>Progress Update</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr><td colSpan="9" className="empty-row">No fabric batches scheduled on looms. Click "+ Schedule Production Batch" above to start!</td></tr>
            ) : (
              jobs.map((j) => (
                <tr key={j.id}>
                  <td className="gold-code">{j.batchNumber}</td>
                  <td><strong>{j.fabricProductName}</strong></td>
                  <td><span className="loom-badge">{j.assignedLoomNumber || 'Unassigned'}</span></td>
                  <td>{j.targetMeters} m</td>
                  <td className="produced-meters">{j.producedMeters} m</td>
                  <td className="scrap-meters">{j.defectWastageMeters} m</td>
                  <td><span className="grade-badge">{j.fabricQualityGrade}</span></td>
                  <td>
                    <span className={`status-pill ${j.jobStatus?.toLowerCase()}`}>
                      {j.jobStatus}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-update-progress"
                      onClick={() => {
                        setActiveJobForUpdate(j);
                        setUpdateFields({
                          status: j.jobStatus,
                          producedMeters: j.producedMeters || '',
                          wasteMeters: j.defectWastageMeters || '',
                          grade: j.fabricQualityGrade
                        });
                      }}
                    >
                      <Settings size={12} /> Log Progress
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Progress Update Modal */}
      {activeJobForUpdate && (
        <div className="progress-modal-overlay">
          <div className="progress-modal-content">
            <h3>Update Loom Batch Progress</h3>
            <p>Lot: <strong>{activeJobForUpdate.batchNumber}</strong> — {activeJobForUpdate.fabricProductName}</p>

            <form onSubmit={handleUpdateStatusSubmit}>
              <div className="form-group">
                <label>Production Status</label>
                <select 
                  value={updateFields.status} 
                  onChange={(e) => setUpdateFields({...updateFields, status: e.target.value})}
                >
                  <option value="QUEUED">Queued / Creel Loading</option>
                  <option value="WARPING">Warping Beam Prep</option>
                  <option value="WEAVING">Active Weaving</option>
                  <option value="QUALITY_INSPECT">Inspection / Grading Table</option>
                  <option value="COMPLETED">Lot Finished (Calendering Complete)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Produced Meters (Actual)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={updateFields.producedMeters}
                    onChange={(e) => setUpdateFields({...updateFields, producedMeters: e.target.value})}
                    placeholder="Meters woven"
                  />
                </div>
                <div className="form-group">
                  <label>Weaver Scrap / Flaw (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={updateFields.wasteMeters}
                    onChange={(e) => setUpdateFields({...updateFields, wasteMeters: e.target.value})}
                    placeholder="Weave defects"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Inspector Fabric Quality Grade</label>
                <select 
                  value={updateFields.grade} 
                  onChange={(e) => setUpdateFields({...updateFields, grade: e.target.value})}
                >
                  <option value="GRADE_A">Grade A (Premium Luster - Defect Free)</option>
                  <option value="GRADE_B">Grade B (Minor Weft Misalignment)</option>
                  <option value="SECONDS">Seconds (Industrial Scrap/Rejected)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setActiveJobForUpdate(null)}>Cancel</button>
                <button type="submit" className="btn-save">Save Production Yield</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJobModal && (
        <ScheduleJobModal
          fabrics={fabrics}
          looms={looms}
          onClose={() => setShowJobModal(false)}
          onSuccess={() => {
            setShowJobModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default LoomDashboard;