import React, { useEffect, useState } from 'react';
import {
  getPurchaseOrders,
  updatePoStatus
} from '../../services/purchaseOrderService';

import { getSuppliers } from '../../services/supplierService';
import { getFabrics } from '../../services/fabricService';

import CreatePurchaseOrderModel from './CreatePurchaseOrderModal';
import PurchaseOrderPrint from './PurchaseOrderPrint';

import { PlusCircle, Printer } from 'lucide-react';

import './PurchaseOrderList.css';

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [fabrics, setFabrics] = useState([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [printPo, setPrintPo] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = async () => {
    try {
      const [poRes, supRes, fabRes] = await Promise.all([
        getPurchaseOrders(),
        getSuppliers(),
        getFabrics()
      ]);

      setOrders(poRes?.data || []);
      setSuppliers(supRes?.data || []);
      setFabrics(fabRes?.data || []);
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePoStatus(id, newStatus);
      await load();
    } catch (err) {
      console.error('Failed to update PO status:', err);
      alert('Failed to update PO status');
    }
  };

  const filtered = orders.filter(
    (o) => statusFilter === 'ALL' || o.status === statusFilter
  );

  return (
    <div className="po-page">

      {/* HEADER */}
      <div className="po-header">
        <div>
          <h1 className="page-title">
            Mill Purchase Orders & Indents
          </h1>

          <p className="page-desc">
            Issue procurement indents to weaver mills and track freight consignments
          </p>
        </div>

        <button
          className="gold-btn"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusCircle size={16} />
          Issue New PO
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="po-toolbar">
        <label>Filter Status:</label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">
            All Purchase Orders
          </option>

          <option value="ISSUED_TO_MILL">
            Issued to Mill
          </option>

          <option value="RECEIVED">
            Stock Received (Inwarded)
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>

        <span className="count-tag">
          {filtered.length} Indents
        </span>
      </div>

      {/* PURCHASE ORDER TABLE */}
      <div className="po-table-card">

        <table className="po-list-table">

          <thead>
            <tr>
              <th>PO Number</th>
              <th>Mill / Weaver</th>
              <th>Items & Meter Spec</th>
              <th>Expected Date</th>
              <th>Estimated Total</th>
              <th>PO Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="empty-row"
                >
                  No purchase orders found.
                </td>
              </tr>

            ) : (

              filtered.map((po) => (

                <tr key={po.id}>

                  {/* PO NUMBER */}
                  <td className="gold-code">
                    {po.poNumber || 'N/A'}
                  </td>

                  {/* SUPPLIER / MILL */}
                  <td>
                    <strong>
                      {po.supplierMillName || 'N/A'}
                    </strong>

                    <div className="muted-city">
                      {po.millCity || ''}
                    </div>
                  </td>

                  {/* ITEMS */}
                  <td>

                    {po.items?.length > 0 ? (

                      po.items.map((item, idx) => (

                        <div
                          key={idx}
                          className="po-item-tag"
                        >
                          {item.fabricName || 'Fabric'}{' '}
                          ({item.orderedMeters || 0}m)
                        </div>

                      ))

                    ) : (

                      <span className="muted-city">
                        No items
                      </span>

                    )}

                  </td>

                  {/* EXPECTED DATE */}
                  <td>
                    {po.expectedDeliveryDate || 'N/A'}
                  </td>

                  {/* TOTAL */}
                  <td className="amt-col">
                    ₹
                    {Number(
                      po.totalEstimatedCost || 0
                    ).toFixed(2)}
                  </td>

                  {/* STATUS */}
                  <td>

                    <select
                      className={`po-status-select ${
                        (po.status || '').toLowerCase()
                      }`}
                      value={po.status || 'ISSUED_TO_MILL'}
                      onChange={(e) =>
                        handleStatusChange(
                          po.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="ISSUED_TO_MILL">
                        Issued to Mill
                      </option>

                      <option value="RECEIVED">
                        Received
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>

                    </select>

                  </td>

                  {/* ACTION */}
                  <td>

                    <button
                      className="btn-print-po"
                      onClick={() => setPrintPo(po)}
                    >
                      <Printer size={14} />
                      Print PO
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* CREATE PURCHASE ORDER MODAL */}
      {isCreateOpen && (

        <CreatePurchaseOrderModel
          suppliers={suppliers}
          fabrics={fabrics}

          onClose={() =>
            setIsCreateOpen(false)
          }

          onSuccess={() => {
            setIsCreateOpen(false);
            load();
          }}
        />

      )}

      {/* PRINT PURCHASE ORDER */}
      {printPo && (

        <PurchaseOrderPrint
          po={printPo}
          onClose={() =>
            setPrintPo(null)
          }
        />

      )}

    </div>
  );
};

export default PurchaseOrderList;