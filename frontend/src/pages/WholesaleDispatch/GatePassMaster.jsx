import React, { useEffect, useState } from 'react';
import { getGatePasses } from '../../services/gatePassService';
import { getDispatchInvoices } from '../../services/factoryService';
import NewGatePassModal from './NewGatePassModal';
import GatePassPrint from './GatePassPrint';
import { Shield, PlusCircle, Printer, Truck, Scale, CheckCircle2 } from 'lucide-react';
import './GatePassMaster.css';

const GatePassMaster = () => {
  const [passes, setPasses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printPass, setPrintPass] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const load = async () => {
    try {
      const [pRes, iRes] = await Promise.all([getGatePasses(), getDispatchInvoices()]);
      setPasses(pRes.data || []);
      setInvoices(iRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = passes.filter(
    (p) => filterType === 'ALL' || p.passType === filterType
  );

  return (
    <div className="gate-page">
      <div className="gate-header">
        <div>
          <span className="gate-kicker"><Shield size={14} /> MILL SECURITY & LOGISTICS WEIGHBRIDGE</span>
          <h1 className="gate-title">Security Gate Pass & Vehicle Manifest Desk</h1>
          <p className="gate-sub">Authorize lorry outward fabric dispatches, record weighbridge gross/tare, and generate E-Way bill security gate passes</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Issue Gate Pass
        </button>
      </div>

      <div className="gate-toolbar">
        <label>Filter Movement:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="ALL">All Factory Movements</option>
          <option value="OUTWARD_FINISHED_GOODS">Outward Finished Goods (Lorry)</option>
          <option value="INWARD_RAW_MATERIAL">Inward Raw Yarn / Chemicals</option>
          <option value="RETURNABLE_JOB_WORK">Returnable Maintenance Spares</option>
        </select>
        <span className="count-pill">{filtered.length} Gate Movements Logged</span>
      </div>

      <div className="gate-table-card">
        <table className="gate-table">
          <thead>
            <tr>
              <th>Gate Pass No</th>
              <th>Vehicle Number</th>
              <th>Transporter & Party</th>
              <th>Category</th>
              <th>Packages / Meters</th>
              <th>Net Wt (kg)</th>
              <th>Status</th>
              <th>Gate Slip</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No security gate pass records logged.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td className="gold-code">{p.gatePassNumber}</td>
                  <td>
                    <strong className="veh-num">{p.vehicleNumber}</strong>
                    <div className="driver-sub">{p.driverName}</div>
                  </td>
                  <td>
                    <div>{p.destinationOrSourceParty}</div>
                    <small className="muted-text">{p.transporterName}</small>
                  </td>
                  <td><span className="type-badge">{p.passType?.replace(/_/g, ' ')}</span></td>
                  <td>{p.totalPackagesCount} pkgs ({p.totalMeterageQuantity}m)</td>
                  <td className="net-wt-col">{p.netMaterialWeightKg ? `${p.netMaterialWeightKg} kg` : '-'}</td>
                  <td><span className="status-pill green">{p.gateStatus}</span></td>
                  <td>
                    <button className="btn-print-gp" onClick={() => setPrintPass(p)}>
                      <Printer size={13} /> Gate Pass
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewGatePassModal
          invoices={invoices}
          onClose={() => setShowModal(false)}
          onSuccess={(newPass) => {
            setShowModal(false);
            setPrintPass(newPass);
            load();
          }}
        />
      )}

      {printPass && (
        <GatePassPrint
          pass={printPass}
          onClose={() => setPrintPass(null)}
        />
      )}
    </div>
  );
};

export default GatePassMaster;