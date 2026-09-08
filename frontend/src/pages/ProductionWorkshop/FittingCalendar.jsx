import React, { useEffect, useState } from 'react';
import { getTailoringOrders } from '../../services/bespokeService';
import BookFittingModal from './BookFittingModal';
import { Calendar as CalIcon, Clock, Scissors, MessageCircle, CheckCircle2, User, Phone } from 'lucide-react';
import './FittingCalendar.css';

const FittingCalendar = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [tailorFilter, setTailorFilter] = useState('ALL');
  const [editOrder, setEditOrder] = useState(null);

  const load = async () => {
    try {
      const res = await getTailoringOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter orders matching trial date or delivery date
  const filtered = orders.filter((o) => {
    const matchesDate = !selectedDate || o.trialDate === selectedDate || o.deliveryDate === selectedDate;
    const matchesTailor = tailorFilter === 'ALL' || o.masterTailorName === tailorFilter;
    return matchesDate && matchesTailor;
  });

  const tailors = ['ALL', ...Array.from(new Set(orders.map((o) => o.masterTailorName).filter(Boolean)))];

  // Send WhatsApp Reminder Link Generator
  const sendWhatsAppReminder = (order) => {
    const text = encodeURIComponent(
      `Dear ${order.customerName},\n\nGreetings from Royal Fabrics Haute Couture Atelier.\n\nYour bespoke fitting session for your "${order.garmentType}" is scheduled on:\n📅 Date: ${order.trialDate || 'Today'}\n⏰ Time Slot: ${order.trialTimeSlot || '04:00 PM'}\n📍 Atelier Master: ${order.masterTailorName || 'Master Tailor'}\n\nWe look forward to welcoming you to the salon.`
    );
    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div>
          <h1 className="cal-title">Master Atelier Fitting & Trial Scheduler</h1>
          <p className="cal-sub">Manage VIP trial fittings, tailor time slots and automated WhatsApp appointment reminders</p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="cal-toolbar">
        <div className="tool-item">
          <label><CalIcon size={14} /> Select Appointment Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="tool-item">
          <label><User size={14} /> Master Tailor Filter:</label>
          <select value={tailorFilter} onChange={(e) => setTailorFilter(e.target.value)}>
            {tailors.map((t) => (
              <option key={t} value={t}>{t === 'ALL' ? 'All Master Tailors' : t}</option>
            ))}
          </select>
        </div>

        <button className="today-btn" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}>
          Jump to Today
        </button>

        <span className="slot-count">{filtered.length} Appointments on this date</span>
      </div>

      {/* Appointments Grid */}
      <div className="appointments-grid">
        {filtered.length === 0 ? (
          <div className="empty-calendar">
            <CalIcon size={36} color="#d4af37" />
            <p>No VIP fitting sessions or deliveries booked on this date ({selectedDate}).</p>
          </div>
        ) : (
          filtered.map((ord) => {
            const isDelivery = ord.deliveryDate === selectedDate;
            return (
              <div key={ord.id} className={`appointment-card ${isDelivery ? 'delivery-card' : 'trial-card'}`}>
                <div className="card-top-bar">
                  <span className="time-badge">
                    <Clock size={12} /> {ord.trialTimeSlot || '04:00 PM'}
                  </span>
                  <span className={`status-pill ${(ord.fittingStatus || '').toLowerCase()}`}>
                    {ord.fittingStatus || 'SCHEDULED'}
                  </span>
                </div>

                <div className="card-client-info">
                  <h3>{ord.customerName}</h3>
                  <div className="client-contact"><Phone size={12} /> {ord.customerPhone}</div>
                </div>

                <div className="garment-spec-box">
                  <span className="garment-title"><Scissors size={14} /> {ord.garmentType}</span>
                  <p className="fabric-desc">{ord.fabricDetails}</p>
                </div>

                <div className="dates-row">
                  <div>
                    <span className="d-lbl">Fitting / Trial:</span>
                    <strong className="gold-txt">{ord.trialDate || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="d-lbl">Final Handover:</span>
                    <strong className="green-txt">{ord.deliveryDate || 'N/A'}</strong>
                  </div>
                </div>

                <div className="tailor-tag">
                  In Attendance: <strong>{ord.masterTailorName || 'Unassigned'}</strong>
                </div>

                <div className="card-actions">
                  <button className="btn-reschedule" onClick={() => setEditOrder(ord)}>
                    Reschedule Slot
                  </button>
                  <button className="btn-whatsapp" onClick={() => sendWhatsAppReminder(ord)}>
                    <MessageCircle size={14} /> WhatsApp Reminder
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editOrder && (
        <BookFittingModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onSuccess={() => {
            setEditOrder(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default FittingCalendar;