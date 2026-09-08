import React, { useState } from "react";
import { createTailoringOrder } from "../../services/bespokeService";


const CreateOrderModal = ({ customer, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    customerId: customer?.id || null,
    customerName: customer?.fullName || "",
    customerPhone: customer?.phone || "",
    garmentType: "3-Piece Suit",
    fabricDetails: "",
    masterTailorName: "",
    trialDate: "",
    deliveryDate: "",
    stitchingCost: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim()) {
      setError("Please enter client name.");
      return;
    }

    if (!form.customerPhone.trim()) {
      setError("Please enter client phone number.");
      return;
    }

    if (!form.fabricDetails.trim()) {
      setError("Please enter fabric details.");
      return;
    }

    if (
      form.trialDate &&
      form.deliveryDate &&
      form.deliveryDate < form.trialDate
    ) {
      setError("Delivery date cannot be before trial date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerId: form.customerId ? Number(form.customerId) : null,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        garmentType: form.garmentType,
        fabricDetails: form.fabricDetails.trim(),
        masterTailorName: form.masterTailorName.trim(),
        trialDate: form.trialDate || null,
        deliveryDate: form.deliveryDate || null,
        stitchingCost: form.stitchingCost
          ? Number(form.stitchingCost)
          : 0,
      };

      await createTailoringOrder(payload);

      alert("Bespoke order sent to workshop.");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Create bespoke order error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to create bespoke order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bespoke-overlay">
      <div className="bespoke-modal">

        <div className="modal-header">
          <div>
            <h2>New Bespoke Commission</h2>

            <p className="client-line">
              Client:{" "}
              <strong>{form.customerName || "Walk-in Client"}</strong>
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {!customer?.id && (
            <>
              <label htmlFor="customerName">
                VIP Client Name
              </label>

              <input
                id="customerName"
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />

              <label htmlFor="customerPhone">
                Phone
              </label>

              <input
                id="customerPhone"
                type="tel"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </>
          )}

          <label htmlFor="garmentType">
            Garment
          </label>

          <select
            id="garmentType"
            name="garmentType"
            value={form.garmentType}
            onChange={handleChange}
          >
            <option value="3-Piece Suit">
              3-Piece Suit
            </option>

            <option value="Bespoke Blazer">
              Bespoke Blazer
            </option>

            <option value="Luxury Shirt">
              Luxury Shirt
            </option>

            <option value="Bandhgala / Sherwani">
              Bandhgala / Sherwani
            </option>

            <option value="Bridal / Couture">
              Bridal / Couture
            </option>

            <option value="Trouser">
              Trouser
            </option>
          </select>

          <label htmlFor="fabricDetails">
            Fabric Details
          </label>

          <input
            id="fabricDetails"
            type="text"
            name="fabricDetails"
            value={form.fabricDetails}
            onChange={handleChange}
            placeholder="Example: Italian wool, Navy blue"
            required
          />

          <label htmlFor="masterTailorName">
            Master Tailor
          </label>

          <input
            id="masterTailorName"
            type="text"
            name="masterTailorName"
            value={form.masterTailorName}
            onChange={handleChange}
            placeholder="Enter master tailor name"
          />

          <div className="two-col">

            <div>
              <label htmlFor="trialDate">
                Trial Date
              </label>

              <input
                id="trialDate"
                type="date"
                name="trialDate"
                value={form.trialDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="deliveryDate">
                Delivery Date
              </label>

              <input
                id="deliveryDate"
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
              />
            </div>

          </div>

          <label htmlFor="stitchingCost">
            Stitching Cost (₹)
          </label>

          <input
            id="stitchingCost"
            type="number"
            name="stitchingCost"
            value={form.stitchingCost}
            onChange={handleChange}
            placeholder="Enter stitching cost"
            min="0"
            step="0.01"
          />

          {error && (
            <div className="vip-error">
              {error}
            </div>
          )}

          <div className="vip-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send to Workshop"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;