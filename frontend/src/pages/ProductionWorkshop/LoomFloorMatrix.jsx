import React, { useEffect, useState } from 'react';
import { getLoomFloorMatrix } from '../../services/loomTelemetryService';
import LoomTelemetryDetailModal from './LoomTelemetryDetailModal';
import LoomFloorPrint from './LoomFloorPrint';
import { Grid, Activity, Gauge, AlertTriangle, Printer, Sparkles, RefreshCw, Layers } from 'lucide-react';
import './LoomFloorMatrix.css';

const LoomFloorMatrix = () => {
  const [looms, setLooms] = useState([]);
  const [selectedLoom, setSelectedLoom] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadMatrix = async () => {
    try {
      const res = await getLoomFloorMatrix();
      setLooms(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMatrix();
    const interval = setInterval(() => {
      if (autoRefresh) {
        loadMatrix();
      }
    }, 10000); // 10-second live telemetry poll
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const runningCount = looms.filter((l) => l.liveStatus === 'ACTIVE_RUNNING').length;
  const warpStopCount = looms.filter((l) => l.liveStatus === 'WARP_BREAK_STOP').length;
  const weftStopCount = looms.filter((l) => l.liveStatus === 'WEFT_FEEDER_STOP').length;
  const gaitingCount = looms.filter((l) => l.liveStatus === 'BEAM_GAITING_CHANGE').length;
  const avgEfficiency = looms.length > 0 ? (looms.reduce((sum, l) => sum + Number(l.currentShiftEfficiencyPct || 0), 0) / looms.length).toFixed(1) : 0;

  return (
    <div className="matrix-page">
      <div className="matrix-header">
        <div>
          <span className="matrix-kicker"><Sparkles size={14} /> WEAVING SHED SCADA TELEMETRY</span>
          <h1 className="matrix-title">Loom Hall 2D Floor Matrix & Live Monitoring</h1>
          <p className="matrix-sub">Interactive 2D visual machine grid tracking real-time RPM, warp/weft breakages and live shed efficiency</p>
        </div>
        <div className="matrix-header-btns">
          <button className="btn-refresh-telemetry" onClick={loadMatrix}>
            <RefreshCw size={14} /> Refresh Sensors
          </button>
          <button className="gold-btn" onClick={() => setShowPrint(true)}>
            <Printer size={16} /> Print Floor Audit
          </button>
        </div>
      </div>

      {/* Live Hall KPI Summary Bar */}
      <div className="matrix-kpi-bar">
        <div className="mk-cell running">
          <div className="mk-dot green"></div>
          <div>
            <span>Active Running (550+ RPM):</span>
            <strong>{runningCount} Looms</strong>
          </div>
        </div>
        <div className="mk-cell warp">
          <div className="mk-dot red"></div>
          <div>
            <span>Warp Break Stops:</span>
            <strong>{warpStopCount} Machines</strong>
          </div>
        </div>
        <div className="mk-cell weft">
          <div className="mk-dot amber"></div>
          <div>
            <span>Weft Feeder Stops:</span>
            <strong>{weftStopCount} Machines</strong>
          </div>
        </div>
        <div className="mk-cell gaiting">
          <div className="mk-dot blue"></div>
          <div>
            <span>Beam Gaiting / Mount:</span>
            <strong>{gaitingCount} Looms</strong>
          </div>
        </div>
        <div className="mk-cell eff">
          <span>Overall Hall Efficiency:</span>
          <strong className="gold-txt">{avgEfficiency}% OEE</strong>
        </div>
      </div>

      {/* 2D Loom Hall Matrix Floor Grid */}
      <div className="loom-2d-floor-grid">
        {looms.map((loom) => {
          const isRunning = loom.liveStatus === 'ACTIVE_RUNNING';
          return (
            <div
              key={loom.id}
              className={`loom-floor-tile ${loom.liveStatus?.toLowerCase()}`}
              onClick={() => setSelectedLoom(loom)}
            >
              <div className="tile-head">
                <span className="tile-num">{loom.loomNumber}</span>
                <span className="tile-rpm">{loom.currentRpmSpeed} RPM</span>
              </div>

              <div className="tile-center-visual">
                <div className="pulse-indicator"></div>
                <h4 className="tile-fabric-name">{loom.fabricQualityName}</h4>
                <p className="tile-lot">{loom.currentLotBatchNumber}</p>
              </div>

              <div className="tile-bottom">
                <div className="tile-eff">{loom.currentShiftEfficiencyPct}% Eff</div>
                <div className="tile-meters">{loom.currentWovenMeters}m</div>
              </div>

              {loom.liveStatus !== 'ACTIVE_RUNNING' && (
                <div className="tile-alert-ribbon">
                  {loom.liveStatus?.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedLoom && (
        <LoomTelemetryDetailModal
          loom={selectedLoom}
          onClose={() => setSelectedLoom(null)}
          onSuccess={() => {
            setSelectedLoom(null);
            loadMatrix();
          }}
        />
      )}

      {showPrint && (
        <LoomFloorPrint
          looms={looms}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
};

export default LoomFloorMatrix;