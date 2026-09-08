import React, { useEffect, useState } from 'react';
import { getProductionPlans, updatePlanStage } from '../../services/planningService';
import { getFabrics } from '../../services/fabricService';
import NewPlanModal from './NewPlanModal';
import ProductionRouteCardPrint from './ProductionRouteCardPrint';
import { Compass, PlusCircle, Printer, Layers, Calendar, CheckCircle2 } from 'lucide-react';
import './ProductionPlanningMaster.css';

const ProductionPlanningMaster = () => {
  const [plans, setPlans] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [printPlan, setPrintPlan] = useState(null);

  const load = async () => {
    try {
      const [pRes, fRes] = await Promise.all([getProductionPlans(), getFabrics()]);
      setPlans(pRes.data || []);
      setFabrics(fRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStageChange = async (id, stage) => {
    try {
      await updatePlanStage(id, stage);
      load();
    } catch (err) {
      alert('Failed to update stage milestone');
    }
  };

  const totalMetersPlanned = plans.reduce((sum, p) => sum + Number(p.targetMeterage || 0), 0);

  return (
    <div className="planning-page">
      <div className="planning-header">
        <div>
          <span className="planning-kicker"><Compass size={14} /> FACTORY PRODUCTION PLANNING & CONTROL (PPC)</span>
          <h1 className="planning-title">Master Production Schedule & MRP Engine</h1>
          <p className="planning-sub">Generate yarn material requisitions, schedule loom capacities and issue traveler route cards</p>
        </div>
        <button className="gold-btn" onClick={() => setShowModal(true)}>
          <PlusCircle size={16} /> + Generate New Production Plan
        </button>
      </div>

      <div className="planning-table-card">
        <table className="planning-table">
          <thead>
            <tr>
              <th>Plan Number</th>
              <th>Buyer / Contract</th>
              <th>Fabric Quality</th>
              <th>Target Yardage</th>
              <th>Loom Allocation</th>
              <th>Warp / Weft Requisition</th>
              <th>Milestone Stage</th>
              <th>Route Card</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr><td colSpan="8" className="empty-text">No master production plans scheduled yet.</td></tr>
            ) : (
              plans.map((p) => (
                <tr key={p.id}>
                  <td className="gold-code">{p.planNumber}</td>
                  <td>
                    <strong>{p.targetClientName}</strong>
                    <div className="contract-sub">{p.orderReferenceNumber}</div>
                  </td>
                  <td>{p.fabricProductName}</td>
                  <td className="meters-bold">{Number(p.targetMeterage).toLocaleString()} m</td>
                  <td>
                    <div>{p.allocatedLoomsCount} Looms</div>
                    <small className="muted-text">{p.estimatedLoomDays} Days Duration</small>
                  </td>
                  <td>
                    <div>Warp: <strong>{p.requiredWarpYarnKg} kg</strong></div>
                    <div>Weft: <strong>{p.requiredWeftYarnKg} kg</strong></div>
                  </td>
                  <td>
                    <select
                      className={`stage-select ${(p.currentStage || '').toLowerCase()}`}
                      value={p.currentStage}
                      onChange={(e) => handleStageChange(p.id, e.target.value)}
                    >
                      <option value="YARN_PROCUREMENT">Yarn Requisition</option>
                      <option value="WARPING_BEAMS">Warping Beams Prep</option>
                      <option value="WEAVING_RUN">Active Loom Weaving</option>
                      <option value="DYEING_STENTER">Dyeing & Stenter Finish</option>
                      <option value="INSPECTION_PACK">QC & Baling</option>
                      <option value="COMPLETED">Contract Completed</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-print-route" onClick={() => setPrintPlan(p)}>
                      <Printer size={13} /> Route Card
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewPlanModal
          fabrics={fabrics}
          onClose={() => setShowModal(false)}
          onSuccess={(newPlan) => {
            setShowModal(false);
            setPrintPlan(newPlan);
            load();
          }}
        />
      )}

      {printPlan && (
        <ProductionRouteCardPrint
          plan={printPlan}
          onClose={() => setPrintPlan(null)}
        />
      )}
    </div>
  );
};

export default ProductionPlanningMaster;