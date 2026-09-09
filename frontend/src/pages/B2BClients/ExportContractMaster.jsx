import React, { useEffect, useState } from 'react';
import { getExportContracts, updateContractStatus } from '../../services/exportService';
import { getFabrics } from '../../services/fabricService';
import NewExportContractModal from './NewExportContractModal';
import CommercialInvoicePrint from './CommercialInvoicePrint';
import { Globe, PlusCircle, Printer, Anchor, ShieldCheck, DollarSign } from 'lucide-react';
import './ExportContractMaster.css';

const ExportContractMaster = () => {
  const [contracts, setContracts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printContract, setPrintContract] = useState(null);

  const load = async () => {
    try {
      const [cRes, fRes] = await Promise.all([getExportContracts(), getFabrics()]);
      setContracts(cRes.data || []);
      setFabrics(fRes.data || []);
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

  const totalExportValueUsd = contracts.reduce((sum, c) => sum + Number(c.totalContractValueForeign || 0), 0);
  const totalInrRealization = contracts.reduce((sum, c) => sum + Number(c.totalInrRealizationValue || 0), 0);

  const handleStatusChange = async (id, status) => {
    try {
      await updateContractStatus(id, status);
      load();
    } catch (err) {
      alert('Failed to update export status');
    }
  };

  return (
    <div className="export-page">
      <div className="export-header">
        <div>
          <span className="export-kicker"><Globe size={14} /> GLOBAL B2B TEXTILE EXPORT DESK</span>
          <h1 className="export-title">Export Orders, Letter of Credit (LC) & Proforma</h1>
          <p className="export-sub">Manage overseas brand contracts, port container dispatches, LC banking compliance and customs invoices</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Draft Export Contract
        </button>
      </div>

      {/* Export KPI Grid */}
      <div className="export-kpi-grid">
        <div className="exp-kpi-card gold-border">
          <div className="kpi-icon"><DollarSign size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL EXPORT CONTRACTS</span>
            <div className="kpi-val gold-val">${totalExportValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <small>Forex Foreign Currency Book</small>
          </div>
        </div>

        <div className="exp-kpi-card">
          <div className="kpi-icon"><Anchor size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL INR REALIZATION</span>
            <div className="kpi-val">₹{(totalInrRealization / 100000).toFixed(2)} Lakhs</div>
            <small>Estimated Bank Inflow at Sight</small>
          </div>
        </div>

        <div className="exp-kpi-card">
          <div className="kpi-icon"><ShieldCheck size={24} /></div>
          <div>
            <span className="kpi-lbl">ACTIVE LC ORDERS</span>
            <div className="kpi-val">{contracts.length} Contracts</div>
            <small>LC Backed Confirmed Export</small>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="export-table-card">
        <table className="export-table">
          <thead>
            <tr>
              <th>Contract No</th>
              <th>Buyer Brand</th>
              <th>Fabric & Volume</th>
              <th>Incoterms & Port</th>
              <th>LC Number</th>
              <th>Value (Forex)</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No international export contracts on record.</td></tr>
            ) : (
              contracts.map((c) => (
                <tr key={c.id}>
                  <td className="gold-code">{c.exportContractNumber}</td>
                  <td>
                    <strong>{c.buyerCompanyName}</strong>
                    <div className="muted-country">{c.buyerCountry}</div>
                  </td>
                  <td>
                    <div>{c.fabricProductName}</div>
                    <small className="muted-text">{Number(c.contractedMeters).toLocaleString()} m</small>
                  </td>
                  <td>
                    <span className="inco-badge">{c.incoterms}</span>
                    <div className="port-sub">{c.portOfDischarge}</div>
                  </td>
                  <td><span className="lc-pill">{c.lcNumber}</span></td>
                  <td className="forex-val">{c.tradeCurrency} ${Number(c.totalContractValueForeign).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <select
                      className={`status-select ${(c.contractStatus || '').toLowerCase()}`}
                      value={c.contractStatus}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    >
                      <option value="LC_CONFIRMED">LC Confirmed</option>
                      <option value="UNDER_PRODUCTION">Under Production</option>
                      <option value="SHIPPED_ON_BOARD">Shipped on Board</option>
                      <option value="SETTLED">Bank Settled</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-print-ci" onClick={() => setPrintContract(c)}>
                      <Printer size={13} /> Invoice
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewExportContractModal
          fabrics={fabrics}
          onClose={() => setShowModal(false)}
          onSuccess={(newContract) => {
            setShowModal(false);
            setPrintContract(newContract);
            load();
          }}
        />
      )}

      {printContract && (
        <CommercialInvoicePrint
          contract={printContract}
          onClose={() => setPrintContract(null)}
        />
      )}
    </div>
  );
};

export default ExportContractMaster;