import React from 'react';
import { Printer, X, Compass, CheckSquare } from 'lucide-react';
import './ProductionRouteCardPrint.css';

const ProductionRouteCardPrint = ({ plan, onClose }) => {
  if (!plan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="route-print-overlay">
      <div className="route-print-container">
        <div className="no-print route-actions">
          <button className="gold-print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Factory Production Route Card
          </button>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Printable Factory Traveler Route Card */}
        <div className="route-paper" id="printable-route">
          <div className="rc-head">
            <div className="rc-brand">
              <h1>KAK TEXTILE PROCESSING MILLS</h1>
              <p className="tag">OFFICIAL PRODUCTION TRAVELER ROUTE CARD & PROCESS CLEARANCE SHEET</p>
              <p className="addr">Production Planning & Control (PPC) Department | 24x7 Integrated Plant</p>
            </div>
            <div className="rc-meta">
              <div className="rc-badge">TRAVELER ROUTE CARD</div>
              <p><strong>Plan No:</strong> {plan.planNumber}</p>
              <p><strong>Order Ref:</strong> {plan.orderReferenceNumber}</p>
              <p><strong>Buyer:</strong> {plan.targetClientName}</p>
            </div>
          </div>

          <div className="rc-divider"></div>

          {/* Core Plan & Material Specs */}
          <div className="rc-grid-3">
            <div className="rc-box">
              <span className="lbl">COMMISSIONED FABRIC:</span>
              <h3>{plan.fabricProductName}</h3>
              <p>Quality Code: <strong>{plan.qualityCode}</strong></p>
            </div>

            <div className="rc-box highlight">
              <span className="lbl">TARGET VOLUME & DURATION:</span>
              <div className="rc-val gold-val">{Number(plan.targetMeterage || 0).toLocaleString()} METERS</div>
              <p>Loom Allocation: <strong>{plan.allocatedLoomsCount} Looms ({plan.estimatedLoomDays} Days)</strong></p>
            </div>

            <div className="rc-box highlight">
              <span className="lbl">DELIVERY DEADLINE:</span>
              <div className="rc-val">{plan.committedDeliveryDate}</div>
              <p>Start: {plan.plannedStartDate}</p>
            </div>
          </div>

          {/* MRP Material Requisition Schedule */}
          <div className="rc-section-title">1. MRP RAW MATERIAL REQUISITION SCHEDULE (BOM)</div>
          <table className="rc-table">
            <thead>
              <tr>
                <th>Raw Material Item</th>
                <th>Requisition Quantity (KG)</th>
                <th>Store Department</th>
                <th>Material Store Clearance</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Warp Greige Filament/Yarn</td><td className="bold">{plan.requiredWarpYarnKg} KG</td><td>Yarn Cone Warehouse</td><td>[ &nbsp; ] Issued & Weighed</td></tr>
              <tr><td>Weft Insertion Yarn</td><td className="bold">{plan.requiredWeftYarnKg} KG</td><td>Yarn Cone Warehouse</td><td>[ &nbsp; ] Issued & Weighed</td></tr>
              <tr><td>Sizing Starch & PVA Binder</td><td className="bold">{plan.requiredSizingChemicalKg} KG</td><td>Chemical Store</td><td>[ &nbsp; ] Mixed in Size Box</td></tr>
              <tr><td>Dye House Colors & Auxiliaries</td><td className="bold">{plan.requiredDyesAndAuxiliariesKg} KG</td><td>Dye Color Kitchen</td><td>[ &nbsp; ] Formulated</td></tr>
            </tbody>
          </table>

          {/* Factory Stage Clearance Milestones */}
          <div className="rc-section-title" style={{ marginTop: '20px' }}>2. FACTORY PROCESS ROUTE CLEARANCE CHECKPOINTS</div>
          <table className="rc-table route-stages-table">
            <thead>
              <tr>
                <th>Process Stage</th>
                <th>Machine Line</th>
                <th>Stage Master In-Charge</th>
                <th>Passed Output</th>
                <th>Master Signature</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>1. Warping & Sizing</strong></td><td>Warping Creel 01</td><td>Warping Master</td><td>........ Beams wound</td><td>__________________</td></tr>
              <tr><td><strong>2. Loom Weaving</strong></td><td>Loom Hall ({plan.allocatedLoomsCount} Looms)</td><td>Weaving Supervisor</td><td>........ Greige m</td><td>__________________</td></tr>
              <tr><td><strong>3. Dyeing / Processing</strong></td><td>Dye Jet Vessel 02</td><td>Dye House Chemist</td><td>........ Dyed m</td><td>__________________</td></tr>
              <tr><td><strong>4. Stenter Finishing</strong></td><td>Stenter Line 01</td><td>Finishing Master</td><td>........ Finished m</td><td>__________________</td></tr>
              <tr><td><strong>5. 4-Point Final QC</strong></td><td>Inspection Table 01</td><td>QC Lab Officer</td><td>Grade: .........</td><td>__________________</td></tr>
              <tr><td><strong>6. Packing & Baling</strong></td><td>Warehouse Packing Bay</td><td>Warehouse Head</td><td>........ Bales</td><td>__________________</td></tr>
            </tbody>
          </table>

          {/* Signoff */}
          <div className="rc-sign-row">
            <div className="sign-col">
              <div className="line"></div>
              <span>{plan.plannedByManager || 'Planning Manager'}</span>
              <small>Production Planning & Control (PPC)</small>
            </div>
            <div className="sign-col">
              <div className="line"></div>
              <span>General Manager (Plant Operations)</span>
              <small>Master Factory Authorization</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionRouteCardPrint;