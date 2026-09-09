import React, { useEffect, useState } from 'react';
import { getBoilerLogs } from '../../services/boilerService';
import NewBoilerLogModal from './NewBoilerLogModal';
import BoilerLogPrint from './BoilerLogPrint';
import { Flame, PlusCircle, Printer, Gauge, Zap, Activity } from 'lucide-react';
import './BoilerEnergyMaster.css';

const BoilerEnergyMaster = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printLog, setPrintLog] = useState(null);

  const load = async () => {
    try {
      const res = await getBoilerLogs();
      setLogs(res.data || []);
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

  const totalSteamTons = logs.reduce((sum, l) => sum + Number(l.totalSteamGeneratedTons || 0), 0);
  const totalFuelTons = logs.reduce((sum, l) => sum + Number(l.fuelConsumedTons || 0), 0);
  const avgEvaporation = totalFuelTons > 0 ? (totalSteamTons / totalFuelTons).toFixed(2) : 4.2;

  return (
    <div className="boiler-page">
      <div className="boiler-header">
        <div>
          <span className="boiler-kicker"><Flame size={14} /> MILL THERMAL POWER & STEAM GENERATION</span>
          <h1 className="boiler-title">Boiler Operations, Steam Distribution & Energy Audit</h1>
          <p className="boiler-sub">Monitor daily high-pressure steam generation, biomass fuel evaporation ratio and departmental steam allocation</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Log Boiler Shift Generation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="boiler-kpi-grid">
        <div className="boiler-card gold-border">
          <div className="kpi-icon"><Flame size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL STEAM GENERATED</span>
            <div className="kpi-val gold-val">{totalSteamTons.toFixed(1)} Tons</div>
            <small>High Pressure 10.5 Bar Steam</small>
          </div>
        </div>

        <div className="boiler-card">
          <div className="kpi-icon"><Activity size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL BIOMASS CONSUMED</span>
            <div className="kpi-val">{totalFuelTons.toFixed(1)} Tons</div>
            <small>Sawdust Briquettes / Wood</small>
          </div>
        </div>

        <div className="boiler-card">
          <div className="kpi-icon"><Gauge size={24} /></div>
          <div>
            <span className="kpi-lbl">AVG EVAPORATION RATIO</span>
            <div className="kpi-val green-val">{avgEvaporation} kg/kg</div>
            <small>Steam Generated per KG Fuel</small>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="boiler-table-card">
        <table className="boiler-table">
          <thead>
            <tr>
              <th>Steam Log No</th>
              <th>Log Date</th>
              <th>Boiler Plant</th>
              <th>Steam Generated</th>
              <th>Pressure</th>
              <th>Fuel Consumed</th>
              <th>Evaporation</th>
              <th>Dye House Share</th>
              <th>Log Sheet</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="9" className="empty-text">No boiler generation logs recorded yet.</td></tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id}>
                  <td className="gold-code">{l.steamLogNumber}</td>
                  <td>
                    <strong>{l.logDate}</strong>
                    <div className="shift-sub">{l.shiftTiming?.replace(/_/g, ' ')}</div>
                  </td>
                  <td>{l.boilerUnitCode}</td>
                  <td className="steam-bold">{l.totalSteamGeneratedTons} Tons</td>
                  <td>{l.averageSteamPressureBar} Bar</td>
                  <td>{l.fuelConsumedTons} Tons</td>
                  <td className="green-txt">{l.evaporationRatio} kg/kg</td>
                  <td>{l.dyeHouseSteamTons} Tons</td>
                  <td>
                    <button className="btn-print-boiler" onClick={() => setPrintLog(l)}>
                      <Printer size={13} /> Log Sheet
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewBoilerLogModal
          onClose={() => setShowModal(false)}
          onSuccess={(newLog) => {
            setShowModal(false);
            setPrintLog(newLog);
            load();
          }}
        />
      )}

      {printLog && (
        <BoilerLogPrint
          log={printLog}
          onClose={() => setPrintLog(null)}
        />
      )}
    </div>
  );
};

export default BoilerEnergyMaster;