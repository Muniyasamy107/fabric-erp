import React, { useState } from 'react';
import { rescheduleFitting } from '../../services/bespokeService';
import './BookFittingModal.css';

const BookFittingModal = ({ order, onClose, onSuccess }) => {
  const [trialDate, setTrialDate] = useState(order.trialDate || '');
  const [timeSlot, setTimeSlot] = useState(order.trialTimeSlot || '04:00 PM - 05:00 PM');
  const [fittingStatus, setFittingStatus] = useState(order.fittingStatus || 'SCHEDULED');
  const [masterTailorName, setMasterTailorName] = useState(order.masterTailorName || 'Master Rajan');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await rescheduleFitting(order.id, {
        trialDate,
        timeSlot,
        fittingStatus,
        masterTailorName
      });
      alert('Fitting Appointment Updated Successfully!');
      onSuccess();
    } catch (err) {
      alert('Failed to update fitting slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fitting-modal-overlay">
      <div className="fitting-modal-content">
        <h2>Schedule Trial Session</h2>
        <p className="sub-line">
          VIP Client: <strong>{order.customerName}</strong> ({order.garmentType})
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Fitting / Trial Date</label>
            <input
              type="date"
              value={trialDate}
              onChange={(e) => setTrialDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Master Fitting Time Slot</label>
            <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM (Morning)</option>
              <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM (Noon)</option>
              <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM (Afternoon)</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM (Evening Prime)</option>
              <option value="05:30 PM - 06:30 PM">05:30 PM - 06:30 PM (Late Evening)</option>
              <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM (VIP Exclusive)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assign Master Tailor in Attendance</label>
            <input
              type="text"
              value={masterTailorName}
              onChange={(e) => setMasterTailorName(e.target.value)}
              placeholder="e.g. Master Rajan / Master Antonio"
              required
            />
          </div>

          <div className="form-group">
            <label>Trial Session Status</label>
            <select value={fittingStatus} onChange={(e) => setFittingStatus(e.target.value)}>
              <option value="SCHEDULED">Scheduled / Awaiting Client</option>
              <option value="TRIAL_DONE">Trial Done (Alteration Required)</option>
              <option value="APPROVED_FOR_DELIVERY">Fitting Approved (Ready for Final Pressing)</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-gold" disabled={loading}>
              {loading ? 'Updating...' : 'Save Fitting Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFittingModal;