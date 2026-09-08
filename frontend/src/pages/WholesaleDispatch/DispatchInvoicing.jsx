import React, { useState, useEffect } from 'react';
import { getFabrics } from '../../services/fabricService';
import { getWholesaleClients, checkoutConsignment } from '../../services/factoryService';
import { ShoppingBag, Truck, Check } from 'lucide-react';
import './DispatchInvoicing.css';

const DispatchInvoicing = () => {
  const [fabrics, setFabrics] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  
  const [selectedClient, setSelectedClient] = useState({ companyName: '', phone: '' });
  const [transportLRNumber, setTransportLRNumber] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('CREDIT_30_DAYS');

  useEffect(() => {
    getFabrics().then(res => setFabrics(res.data || []));
    getWholesaleClients().then(res => setClients(res.data || []));
  }, []);

  const handleClientSelect = (clientId) => {
    const matched = clients.find(c => String(c.id) === String(clientId));
    if (matched) {
      setSelectedClient({ companyName: matched.companyName, phone: matched.contactPhone });
    }
  };

  const addToCart = (fabric) => {
    const existing = cart.find(item => item.fabricProductId === fabric.id);
    if (existing) return;

    setCart([...cart, {
      fabricProductId: fabric.id,
      fabricProductName: fabric.name,
      pricePerMeter: fabric.wholesalePricePerMeter || fabric.pricePerMeter,
      shippedMeters: 50.0, // Default bulk roll is 50m
      availableMeters: fabric.totalStockMeters || fabric.totalAvailableMeters,
      lineTotal: (fabric.wholesalePricePerMeter || fabric.pricePerMeter) * 50.0
    }]);
  };

  const updateMeters = (index, meters) => {
    const updated = [...cart];
    const item = updated[index];
    if (meters > item.availableMeters) {
      alert(`Insufficient finished stock in warehouse! Only ${item.availableMeters}m available.`);
      return;
    }
    item.shippedMeters = parseFloat(meters) || 0;
    item.lineTotal = item.shippedMeters * item.pricePerMeter;
    setCart(updated);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const taxableValue = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const gstAmount = taxableValue * 0.05; // Standard 5%
  const grandTotal = taxableValue + gstAmount;

  const handleDispatch = async () => {
    if (cart.length === 0) return alert('Select fabric rolls to dispatch!');
    if (!selectedClient.companyName) return alert('Select wholesale partner!');

    const payload = {
      clientCompanyName: selectedClient.companyName,
      clientPhone: selectedClient.phone,
      transportLRNumber,
      paymentTerms,
      items: cart
    };

    try {
      const res = await checkoutConsignment(payload);
      alert(`Consignment Dispatched successfully!\nInvoice: ${res.data.invoiceNumber}`);
      setCart([]);
      setSelectedClient({ companyName: '', phone: '' });
      setTransportLRNumber('');
      getFabrics().then(res => setFabrics(res.data || []));
    } catch (err) {
      alert(err.response?.data || 'Dispatch failure');
    }
  };

  return (
    <div className="dispatch-container">
      {/* Catalog Grid */}
      <div className="catalog-selection">
        <h2>Select Fabrics for Dispatch</h2>
        <div className="disp-grid">
          {fabrics.map((f) => (
            <div key={f.id} className="disp-card" onClick={() => addToCart(f)}>
              <span className="sku">{f.itemCode}</span>
              <h3>{f.name}</h3>
              <p>{f.fabricType} — Width: {f.standardWidthInches || 58}"</p>
              <div className="card-ft">
                <span>₹{f.wholesalePricePerMeter || f.pricePerMeter}/m</span>
                <strong>{f.totalStockMeters || f.totalAvailableMeters}m stock</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill & Dispatch Desk */}
      <div className="dispatch-bill-desk">
        <h2>Wholesale Invoicing Desk</h2>

        <div className="client-inputs">
          <label>Select Wholesale Buyer</label>
          <select onChange={(e) => handleClientSelect(e.target.value)}>
            <option value="">-- Choose Company --</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </select>

          <label>Lorry LR / Freight Waybill No</label>
          <input value={transportLRNumber} onChange={(e) => setTransportLRNumber(e.target.value)} placeholder="e.g. VRL-FREIGHT-8821" />

          <label>Payment Terms</label>
          <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
            <option value="CREDIT_30_DAYS">30 Days Net Credit</option>
            <option value="CREDIT_60_DAYS">60 Days Net Credit</option>
            <option value="ADVANCE">Prepaid / Advance</option>
          </select>
        </div>

        <div className="cart-roll-list">
          {cart.length === 0 ? (
            <p className="empty-msg">No fabric roll lots selected.</p>
          ) : (
            cart.map((item, index) => (
              <div key={item.fabricProductId} className="cart-roll-item">
                <div className="info">
                  <strong>{item.fabricProductName}</strong>
                  <small>₹{item.pricePerMeter}/m</small>
                </div>
                <div className="meters">
                  <input type="number" step="10" value={item.shippedMeters} onChange={(e) => updateMeters(index, e.target.value)} />
                  <span>m</span>
                </div>
                <div className="tot">
                  <span>₹{item.lineTotal.toFixed(2)}</span>
                  <button onClick={() => removeFromCart(index)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="summary-block">
          <div className="row"><span>Taxable Subtotal:</span> <span>₹{taxableValue.toFixed(2)}</span></div>
          <div className="row"><span>CGST / SGST (5%):</span> <span>₹{gstAmount.toFixed(2)}</span></div>
          <div className="row grand"><span>Consignment Total:</span> <span className="gold-text">₹{grandTotal.toFixed(2)}</span></div>

          <button className="btn-dispatch-freight" onClick={handleDispatch}>
            <Truck size={18} /> Approve Dispatch & Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default DispatchInvoicing;