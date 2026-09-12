import React, { useEffect, useState } from "react";
import { stockInward } from "../../services/supplierService";
import { formatMeters, getFabricLabel, getFabricName, getFabricStock } from "../../utils/fabricFormat";
import "./StockInwardModal.css";

const StockInwardModal = ({
  fabrics = [],
  suppliers = [],
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fabricId: "",
    supplierId: "",
    addedMeters: "",
    purchaseCostPerMeter: "",
    consignmentNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const selectedFabric = fabrics.find(
    (fabric) => String(fabric.id) === String(formData.fabricId)
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fabricId: prev.fabricId || fabrics[0]?.id || "",
      supplierId: prev.supplierId || suppliers[0]?.id || "",
    }));
  }, [fabrics, suppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fabricId) {
      alert("Please select a fabric.");
      return;
    }

    if (!formData.supplierId) {
      alert("Please select a supplier.");
      return;
    }

    if (!formData.addedMeters || Number(formData.addedMeters) <= 0) {
      alert("Please enter a valid received length.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fabricId: Number(formData.fabricId),
        supplierId: Number(formData.supplierId),
        addedMeters: Number(formData.addedMeters),
        purchaseCostPerMeter: formData.purchaseCostPerMeter
          ? Number(formData.purchaseCostPerMeter)
          : null,
        consignmentNumber: formData.consignmentNumber.trim(),
      };

      await stockInward(payload);

      alert(
        "Fabric Roll Stock Successfully Inwarded & Meter Balance Updated!"
      );

      if (onSuccess) {
        onSuccess();
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Stock inward error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Stock Inward failed. Please check inputs.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inward-overlay">
      <div className="inward-modal">

        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              📦 Consignment Stock Inward
            </h2>

            <p className="modal-sub">
              Receive new fabric bolts / rolls from supplier mills
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">

          {/* Fabric Selection */}
          <div className="form-group">
            <label htmlFor="fabricId">
              Target Fabric Roll
            </label>

            <select
              id="fabricId"
              name="fabricId"
              value={formData.fabricId}
              onChange={handleChange}
              required
              disabled={loading || fabrics.length === 0}
            >
              <option value="">
                Select Fabric
              </option>

              {fabrics.map((fabric) => (
                <option key={fabric.id} value={fabric.id}>
                  {getFabricLabel(fabric)} -{" "}
                  Current: {formatMeters(getFabricStock(fabric))}
                </option>
              ))}
            </select>

            {fabrics.length === 0 && (
              <small className="form-hint">
                No fabrics available.
              </small>
            )}

            {selectedFabric && (
              <small className="form-hint">
                Selected: <strong>{getFabricName(selectedFabric)}</strong> —{" "}
                {formatMeters(getFabricStock(selectedFabric))} in stock now.
              </small>
            )}
          </div>

          {/* Supplier Selection */}
          <div className="form-group">
            <label htmlFor="supplierId">
              Source Mill / Supplier
            </label>

            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
              disabled={loading || suppliers.length === 0}
            >
              <option value="">
                Select Supplier
              </option>

              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.millName || "Unnamed Supplier"}
                  {supplier.city ? ` (${supplier.city})` : ""}
                </option>
              ))}
            </select>

            {suppliers.length === 0 && (
              <small className="form-hint">
                No suppliers available.
              </small>
            )}
          </div>

          {/* Meters and Cost */}
          <div className="form-row">

            <div className="form-group">
              <label htmlFor="addedMeters">
                Received Length (Meters)
              </label>

              <input
                id="addedMeters"
                type="number"
                step="0.1"
                min="0.1"
                name="addedMeters"
                value={formData.addedMeters}
                placeholder="e.g. 50.0"
                required
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchaseCostPerMeter">
                Mill Cost / Meter (₹)
              </label>

              <input
                id="purchaseCostPerMeter"
                type="number"
                step="0.01"
                min="0"
                name="purchaseCostPerMeter"
                value={formData.purchaseCostPerMeter}
                placeholder="e.g. 1200.00"
                disabled={loading}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Consignment Number */}
          <div className="form-group">
            <label htmlFor="consignmentNumber">
              Consignment / Invoice Ref Number
            </label>

            <input
              id="consignmentNumber"
              type="text"
              name="consignmentNumber"
              value={formData.consignmentNumber}
              placeholder="e.g. LOT-MILAN-2024-88"
              disabled={loading}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="modal-actions">

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
              className="btn-gold-save"
              disabled={
                loading ||
                fabrics.length === 0 ||
                suppliers.length === 0
              }
            >
              {loading ? "Processing..." : "Inward Meters"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default StockInwardModal;

