import React, { useState } from 'react';
import { updateLoomLiveStatus } from '../../services/loomTelemetryService';
import { Activity, Gauge, Zap, AlertTriangle, CheckCircle2, User, Play, Pause, Wrench } from 'lucide-react';
import './LoomTelemetryDetailModal.css';

const LoomTelemetryDetailModal = ({ loom, onClose, onSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState(loom.liveStatus);
  const [sensorAlert, setSensorAlert] = useState(loom.telemetrySensorAlert || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLoomLiveStatus(loom.loomNumber, selectedStatus, sensorAlert);
      alert(`${loom.loomNumber} Status Updated to ${selectedStatus}!`);
      onSuccess();
    } catch (err) {
      alert('Failed to update telemetry status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="telemetry-modal-overlay">
      <div className="telemetry-modal-content">
        <div className="tm-head">
          <div className="tm-title-group">
            <span className="tm-kicker">LOOM TELEMETRY SENSOR DIAGNOSTICS</span>
            <h2>{loom.loomNumber} ({loom.machineType?.replace(/_/g, ' ')})</h2>
            <p>Active Lot: <strong>{loom.currentLotBatchNumber}</strong> | Fabric: <strong>{loom.fabricQualityName}</strong></p>
          </div>
          <span className={`tm-live-pill ${loom.liveStatus?.toLowerCase()}`}>
            {loom.liveStatus?.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="tm-metrics-grid">
          <div className="tm-m-box">
            <span className="lbl"><Gauge size={14} /> CURRENT SHUTTLE SPEED</span>
            <strong className="val">{loom.currentRpmSpeed} RPM</strong>
            <small>Rated High-Speed Weaving</small>
          </div>
          <div className="tm-m-box">
            <span className="lbl"><Activity size={14} /> SHIFT EFFICIENCY</span>
            <strong className="val green">{loom.currentShiftEfficiencyPct}%</strong>
            <small>Running vs Idle Ratio</small>
          </div>
          <div className="tm-m-box">
            <span className="lbl"><Zap size={14} /> WOVEN YARDAGE</span>
            <strong className="val gold">{loom.currentWovenMeters} m</strong>
            <small>{Number(loom.currentPicksCounter || 0).toLocaleString()} Picks Woven</small>
          </div>
        </div>

        <div className="tm-weaver-bar">
          <User size={16} color="#d4af37" />
          <span>Operator in Attendance: <strong>{loom.allocatedWeaverName || 'Assigned Weaver'}</strong></span>
        </div>

        <form onSubmit={handleUpdate} className="tm-control-form">
          <label>Simulate Loom Sensor Telemetry / Override Machine Status:</label>
          <div className="tm-status-buttons-grid">
            <button
              type="button"
              className={`btn-state-opt running ${selectedStatus === 'ACTIVE_RUNNING' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('ACTIVE_RUNNING')}
            >
              <Play size={14} /> Running (550+ RPM)
            </button>
            <button
              type="button"
              className={`btn-state-opt warp-stop ${selectedStatus === 'WARP_BREAK_STOP' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('WARP_BREAK_STOP')}
            >
              <AlertTriangle size={14} /> Warp Break Stop
            </button>
            <button
              type="button"
              className={`btn-state-opt weft-stop ${selectedStatus === 'WEFT_FEEDER_STOP' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('WEFT_FEEDER_STOP')}
            >
              <Pause size={14} /> Weft Stoppage
            </button>
            <button
              type="button"
              className={`btn-state-opt beam-change ${selectedStatus === 'BEAM_GAITING_CHANGE' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('BEAM_GAITING_CHANGE')}
            >
              <Wrench size={14} /> Beam Gaiting Change
            </button>
          </div>

          <div className="form-group" style={{ marginTop: '14px' }}>
            <label>Sensor Diagnostic Log & Fault Trip Detail</label>
            <input
              type="text"
              value={sensorAlert}
              onChange={(e) => setSensorAlert(e.target.value)}
              placeholder="e.g. Warp Dropper Pin #204 Trip / Weft Sensor OK"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Close</button>
            <button type="submit" className="btn-gold-save" disabled={loading}>
              {loading ? 'Transmitting...' : 'Transmit Telemetry Command'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoomTelemetryDetailModal;