import React, { useState, useEffect } from 'react';
import { getTailoringOrders, updateOrderStatus, getMeasurements } from '../../services/bespokeService';
import MeasurementSheet from './MeasurementSheet';
import CreateOrderModal from './CreateOrderModal';
import JobCardPrint from './JobCardPrint';
import StyleConfigurationModal from './StyleConfigurationModal';
import { Sparkles } from 'lucide-react';
import './BespokeOrders.css';

const BespokeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [jobCardOrder, setJobCardOrder] = useState(null);
  const [jobCardMeasurements, setJobCardMeasurements] = useState([]);
  const [styleConfigOrder, setStyleConfigOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getTailoringOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleOpenJobCard = async (order) => {
    try {
      if (order.customerId) {
        const res = await getMeasurements(order.customerId);
        setJobCardMeasurements(res.data || []);
      } else {
        setJobCardMeasurements([]);
      }
      setJobCardOrder(order);
    } catch (err) {
      setJobCardMeasurements([]);
      setJobCardOrder(order);
    }
  };

  return (
    <div className="bespoke-page">
      <div className="bespoke-header">
        <div>
          <h1 className="page-title">Haute Couture & Tailoring Hub</h1>
          <p className="page-desc">
            Track suit cuts, custom style blueprints, master tailoring stages and print workshop tickets
          </p>
        </div>

        <button className="gold-btn" onClick={() => setShowCreate(true)}>
          + New Bespoke Order
        </button>
      </div>

      <div className="bespoke-table-card">
        <table className="bespoke-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>VIP Client</th>
              <th>Garment & Style</th>
              <th>Master Tailor</th>
              <th>Trial Date</th>
              <th>Delivery Date</th>
              <th>Workshop Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  No bespoke orders in workshop.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="gold-code">{o.orderNumber}</td>

                  <td>
                    <strong>{o.customerName}</strong>
                    <div className="client-phone">{o.customerPhone}</div>
                  </td>

                  <td>
                    <span className="garment-badge">{o.garmentType}</span>

                    <div className="style-sub-tag">
                      {o.lapelStyle?.replace(/_/g, ' ')} •{' '}
                      {o.monogramText
                        ? `Monogram: "${o.monogramText}"`
                        : 'Plain'}
                    </div>
                  </td>

                  <td>{o.masterTailorName || 'Unassigned'}</td>

                  <td className="trial-date-cell">
                    {o.trialDate || 'N/A'}
                  </td>

                  <td className="delivery-date-cell">
                    {o.deliveryDate || 'N/A'}
                  </td>

                  <td>
                    <select
                      className={`status-select ${(o.status || '').toLowerCase()}`}
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o.id, e.target.value)
                      }
                    >
                      <option value="RECEIVED">Received</option>
                      <option value="CUTTING">Fabric Cutting</option>
                      <option value="STITCHING">Master Stitching</option>
                      <option value="TRIAL_FITTING">
                        Trial Fitting Ready
                      </option>
                      <option value="DELIVERED">
                        Delivered to Client
                      </option>
                    </select>
                  </td>

                  <td>
                    <div className="bespoke-actions-row">

                      <button
                        className="btn-style-studio"
                        onClick={() => setStyleConfigOrder(o)}
                        title="Configure Style & Monogram"
                      >
                        <Sparkles size={12} /> Styles
                      </button>

                      <button
                        className="btn-measure"
                        onClick={() =>
                          setActiveCustomer({
                            id: o.customerId,
                            name: o.customerName
                          })
                        }
                      >
                        Body Specs
                      </button>

                      <button
                        className="btn-jobcard"
                        onClick={() => handleOpenJobCard(o)}
                      >
                        Job Card
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeCustomer && (
        <MeasurementSheet
          customerId={activeCustomer.id}
          customerName={activeCustomer.name}
          onClose={() => setActiveCustomer(null)}
        />
      )}

      {showCreate && (
        <CreateOrderModal
          customer={{}}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            fetchOrders();
          }}
        />
      )}

      {jobCardOrder && (
        <JobCardPrint
          order={jobCardOrder}
          measurements={jobCardMeasurements}
          onClose={() => setJobCardOrder(null)}
        />
      )}

      {styleConfigOrder && (
        <StyleConfigurationModal
          order={styleConfigOrder}
          onClose={() => setStyleConfigOrder(null)}
          onSuccess={() => {
            setStyleConfigOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default BespokeOrders;