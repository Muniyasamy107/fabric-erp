import React, { useEffect, useState } from 'react';
import { getMaintenanceTickets, resolveMaintenanceTicket, getSpareParts } from '../../services/maintenanceService';
import { getWeavingLooms } from '../../services/factoryService';
import NewBreakdownModal from './NewBreakdownModal';
import { Wrench, PlusCircle, Printer, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import './MachineMaintenanceMaster.css';

const MachineMaintenanceMaster = () => {
  const [tickets, setTickets] = useState([]);
  const [spares, setSpares] = useState([]);
  const [looms, setLooms] = useState([]);
  const [activeTab, setActiveTab] = useState('TICKETS');
  const [showNewModal, setShowNewModal] = useState(false);
  const [printTicket, setPrintTicket] = useState(null);

  const load = async () => {
    try {
      const [tRes, sRes, lRes] = await Promise.all([
        getMaintenanceTickets(),
        getSpareParts(),
        getWeavingLooms()
      ]);
      setTickets(tRes.data || []);
      setSpares(sRes.data || []);
      setLooms(lRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleResolve = async (ticket) => {
    const hours = prompt(`Enter total downtime hours for ${ticket.machineCode}:`, '2.5');
    if (hours === null) return;

    const parts = prompt('Enter spare parts consumed during repair:', ticket.partsReplacedSummary || '1x Spare Part');
    const notes = prompt('Enter resolution test remarks:', 'Tested running smoothly at 550 RPM.');

    try {
      await resolveMaintenanceTicket(ticket.id, Number(hours), parts, notes);
      alert(`${ticket.machineCode} repaired & restored to ACTIVE RUNNING status!`);
      load();
    } catch (err) {
      alert('Failed to resolve ticket');
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const downCount = tickets.filter((t) => t.status === 'OPEN_DOWN').length;

  return (
    <div className="maint-page">
      <div className="maint-header">
        <div>
          <span className="maint-kicker">MILL ASSET ENGINEERING & FITTER DESK</span>
          <h1 className="maint-title">Loom Maintenance, Breakdown Log & Spares</h1>
          <p className="maint-sub">Log loom stoppage, schedule preventive lubrication, track downtime hours and manage spare parts</p>
        </div>
        <button className="danger-btn" onClick={() => setShowNewModal(true)} type="button">
          <PlusCircle size={16} /> + Report Machine Breakdown
        </button>
      </div>

      <div className="maint-tabs-row">
        <button
          className={`tab-btn ${activeTab === 'TICKETS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TICKETS')}
          type="button"
        >
          <AlertTriangle size={16} /> Maintenance Breakdown Logs ({downCount} Machine Down)
        </button>
        <button
          className={`tab-btn ${activeTab === 'SPARES' ? 'active' : ''}`}
          onClick={() => setActiveTab('SPARES')}
          type="button"
        >
          <Wrench size={16} /> Loom Spare Parts Store ({spares.length} Stock SKUs)
        </button>
      </div>

      {activeTab === 'TICKETS' && (
        <div className="maint-table-card">
          <table className="maint-table">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Machine Asset</th>
                <th>Breakdown Issue</th>
                <th>Priority</th>
                <th>Lead Fitter</th>
                <th>Downtime</th>
                <th>Machine Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan="8" className="empty-text">No active breakdown tickets. All looms running.</td></tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="gold-code">{t.ticketNumber}</td>
                    <td><strong>{t.machineCode}</strong></td>
                    <td className="issue-desc">{t.issueDescription}</td>
                    <td><span className={`pri-tag ${t.priority?.toLowerCase()}`}>{t.priority}</span></td>
                    <td>{t.technicianName}</td>
                    <td>{t.downtimeHours ? `${t.downtimeHours} hrs` : '-'}</td>
                    <td>
                      <span className={`status-pill ${t.status?.toLowerCase()}`}>
                        {t.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {t.status === 'OPEN_DOWN' ? (
                          <button className="btn-resolve" onClick={() => handleResolve(t)} type="button">
                            <CheckCircle2 size={12} /> Resolve Down
                          </button>
                        ) : (
                          <span className="repaired-tag">Repaired</span>
                        )}
                        <button className="btn-print-ticket" onClick={() => setPrintTicket(t)} type="button">
                          <Printer size={13} /> Job Ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'SPARES' && (
        <div className="spares-grid">
          {spares.length === 0 ? (
            <p className="empty-text">No spare parts registered in maintenance bay.</p>
          ) : (
            spares.map((s) => (
              <div key={s.id} className="spare-card">
                <div className="sc-top">
                  <span className="sku">{s.partSku}</span>
                  <span className="cat-badge">{s.category?.replace(/_/g, ' ')}</span>
                </div>
                <h3>{s.partName}</h3>
                <div className="sc-stock-row">
                  <div>
                    <span className="lbl">Available Stock:</span>
                    <strong className="stock-qty">{s.currentStockQty} units</strong>
                  </div>
                  <div>
                    <span className="lbl">Unit Cost:</span>
                    <span className="cost-tag">₹{s.unitCost}</span>
                  </div>
                </div>
                <div className="sc-footer">
                  <span>Storage: <strong>{s.storageBinLocation}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showNewModal && (
        <NewBreakdownModal
          looms={looms}
          onClose={() => setShowNewModal(false)}
          onSuccess={(newTicket) => {
            setShowNewModal(false);
            setPrintTicket(newTicket);
            load();
          }}
        />
      )}

      {/* 🌟 Direct Inlined Print Modal (No external file needed) */}
      {printTicket && (
        <div className="mjob-print-overlay">
          <div className="mjob-print-container">
            <div className="no-print mjob-actions">
              <button className="gold-print-btn" onClick={handleDirectPrint} type="button">
                <Printer size={18} /> Print Fitter Maintenance Ticket
              </button>
              <button className="close-btn" onClick={() => setPrintTicket(null)} type="button">
                <X size={20} />
              </button>
            </div>

            <div className="mjob-paper" id="printable-mjob">
              <div className="mj-head">
                <div className="mj-brand">
                  <h1>ROYAL FABRICS PLANT ENGINEERING</h1>
                  <p className="mj-tag">MECHANICAL AND ELECTRICAL BREAKDOWN WORK ORDER TICKET</p>
                  <p className="mj-addr">Plant Maintenance Wing | Weaving and Finishing Hall</p>
                </div>
                <div className="mj-meta">
                  <div className="mj-badge">WORK ORDER</div>
                  <p><strong>Ticket No:</strong> {printTicket.ticketNumber || 'TICKET-01'}</p>
                  <p><strong>Priority:</strong> <span className="mj-pri">{printTicket.priority || 'CRITICAL'}</span></p>
                </div>
              </div>

              <div className="mj-divider"></div>

              <div className="mj-grid-2">
                <div className="mj-cell">
                  <span className="lbl">AFFECTED MILL ASSET:</span>
                  <h3>{printTicket.machineCode || 'MACHINE-01'}</h3>
                  <p>Classification: <strong>{printTicket.maintenanceType ? printTicket.maintenanceType.replace(/_/g, ' ') : 'Breakdown Repair'}</strong></p>
                </div>
                <div className="mj-cell">
                  <span className="lbl">ASSIGNED LEAD FITTER:</span>
                  <h3>{printTicket.technicianName || 'Plant Engineering Fitter'}</h3>
                  <p>Current Status: <strong>{printTicket.status ? printTicket.status.replace(/_/g, ' ') : 'Open'}</strong></p>
                </div>
              </div>

              <div className="mj-section-title">
                <AlertTriangle size={14} /> OBSERVED BREAKDOWN FAULT AND SYMPTOMS
              </div>
              <div className="mj-fault-card">
                <p>{printTicket.issueDescription || 'Reported stoppage in machine drive / mechanism.'}</p>
              </div>

              <div className="mj-section-title" style={{ marginTop: '15px' }}>
                <Wrench size={14} /> REQUISITIONED REPLACEMENT SPARE PARTS
              </div>
              <div className="mj-spares-card">
                <strong>Store Requisition Indent:</strong>
                <p>{printTicket.partsReplacedSummary || 'Standard consumable greasing and inspection'}</p>
              </div>

              <div className="mj-checklist-box">
                <div className="cl-title">FITTER WORK COMPLETION CHECKLIST</div>
                <div className="cl-item"><span>[ ] 1. Power Lockout and Tagout (LOTO) Executed</span></div>
                <div className="cl-item"><span>[ ] 2. Mechanical Parts Replaced and Torqued</span></div>
                <div className="cl-item"><span>[ ] 3. Manual Handwheel Inching Test Passed</span></div>
                <div className="cl-item"><span>[ ] 4. High-Speed Trial Weaving (No Warp Snags)</span></div>
              </div>

              <div className="mj-sign-row">
                <div className="sign-col">
                  <div className="line"></div>
                  <span>{printTicket.technicianName || 'Maintenance Fitter'}</span>
                  <small>Repair Completion Sign</small>
                </div>
                <div className="sign-col">
                  <div className="line"></div>
                  <span>Shift Weaving Supervisor</span>
                  <small>Machine Production Handover</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineMaintenanceMaster;