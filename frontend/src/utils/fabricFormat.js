/**
 * Shared helpers for reading / formatting FabricProduct records.
 *
 * The canonical entity (backend: com.fabricerp.erp.entity.FabricProduct) exposes
 *   qualityCode, fabricName, fabricType, gsm, warehouseBinLocation, hsnCode,
 *   wholesalePricePerMeter, totalStockMeters, minStockAlert, gstRate, imageUrl
 *
 * Screens carried over from the boutique era still read the old aliases
 *   itemCode, name, pricePerMeter, totalAvailableMeters, rackLocation
 *
 * Every getter below reads the canonical field FIRST and only then falls back
 * to the legacy alias (the "FabricList.jsx pattern"), so dropdowns, cards and
 * tags never render blank whichever shape the API returns.
 *
 * Import these helpers instead of touching fabric fields directly.
 */

export const DEFAULT_FABRIC_IMAGE = '/fabrics/cotton-shirting.jpg';
export const DEFAULT_BIN_LOCATION = 'Rack A-01';
export const DEFAULT_HSN_CODE = '5007';
export const DEFAULT_GST_RATE = 5;

const isBlank = (value) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

/** Returns the first value that is not null / undefined / empty-string. */
export const pickText = (...values) => {
  for (const value of values) {
    if (!isBlank(value)) return String(value).trim();
  }
  return '';
};

/** Returns the first value that converts to a finite number (0 counts as valid). */
export const pickNumber = (values, fallback = 0) => {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

/** qualityCode (fallback: itemCode / sku) */
export const getFabricCode = (fabric) => pickText(fabric?.qualityCode, fabric?.itemCode, fabric?.sku);

/** fabricName (fallback: name / productName) */
export const getFabricName = (fabric) =>
  pickText(fabric?.fabricName, fabric?.name, fabric?.productName) || 'Unnamed Fabric';

export const getFabricType = (fabric) => pickText(fabric?.fabricType, fabric?.material, fabric?.weaveType);

export const getFabricGsm = (fabric) => pickNumber([fabric?.gsm, fabric?.grammage], 0);

/** wholesalePricePerMeter (fallback: pricePerMeter / costPricePerMeter) as a Number. */
export const getFabricPrice = (fabric, fallback = 0) =>
  pickNumber(
    [fabric?.wholesalePricePerMeter, fabric?.pricePerMeter, fabric?.costPricePerMeter],
    fallback
  );

/** totalStockMeters (fallback: totalAvailableMeters / availableMeters) as a Number. */
export const getFabricStock = (fabric, fallback = 0) =>
  pickNumber(
    [fabric?.totalStockMeters, fabric?.totalAvailableMeters, fabric?.availableMeters],
    fallback
  );

export const getFabricImage = (fabric) => {
  const image = pickText(fabric?.imageUrl, fabric?.image);
  return image || DEFAULT_FABRIC_IMAGE;
};

/** warehouseBinLocation (fallback: rackLocation / binLocation) */
export const getFabricLocation = (fabric) =>
  pickText(fabric?.warehouseBinLocation, fabric?.rackLocation, fabric?.binLocation) ||
  DEFAULT_BIN_LOCATION;

export const getFabricHsn = (fabric) => pickText(fabric?.hsnCode, fabric?.hsn) || DEFAULT_HSN_CODE;

export const getFabricGstRate = (fabric) => pickNumber([fabric?.gstRate], DEFAULT_GST_RATE);

export const getFabricMinStock = (fabric) => pickNumber([fabric?.minStockAlert, fabric?.reorderAlertLevel], 10);

export const getFabricWidth = (fabric) => pickNumber([fabric?.standardWidthInches, fabric?.widthInches], 58);

/** "CP-1001 - Cotton Poplin" — safe for <option> labels and card headings. */
export const getFabricLabel = (fabric) => {
  const code = getFabricCode(fabric);
  const name = getFabricName(fabric);
  if (code && name) return `${code} - ${name}`;
  return code || name;
};

/** "CP-1001 - Cotton Poplin (120.0 m available)" — used by stock pickers. */
export const getFabricStockLabel = (fabric) =>
  `${getFabricLabel(fabric)} (${formatMeters(getFabricStock(fabric))} available)`;

export const formatCurrency = (value, digits = 2) => `₹${pickNumber([value], 0).toFixed(digits)}`;

export const formatMeters = (value, digits = 1) => `${pickNumber([value], 0).toFixed(digits)} m`;

/** Flattens any fabric record into the canonical shape used across screens. */
export const normalizeFabric = (fabric) => ({
  ...(fabric || {}),
  id: fabric?.id,
  qualityCode: getFabricCode(fabric),
  fabricName: fabric?.fabricName || fabric?.name || '',
  fabricType: getFabricType(fabric),
  gsm: getFabricGsm(fabric),
  imageUrl: getFabricImage(fabric),
  warehouseBinLocation: getFabricLocation(fabric),
  hsnCode: getFabricHsn(fabric),
  gstRate: getFabricGstRate(fabric),
  minStockAlert: getFabricMinStock(fabric),
  standardWidthInches: getFabricWidth(fabric),
  wholesalePricePerMeter: getFabricPrice(fabric),
  totalStockMeters: getFabricStock(fabric),
});

/** Case-insensitive search across code, name and type. */
export const matchesFabricSearch = (fabric, query) => {
  const q = String(query || '').toLowerCase().trim();
  if (!q) return true;
  return (
    getFabricCode(fabric).toLowerCase().includes(q) ||
    getFabricName(fabric).toLowerCase().includes(q) ||
    getFabricType(fabric).toLowerCase().includes(q)
  );
};

export default {
  DEFAULT_FABRIC_IMAGE,
  getFabricCode,
  getFabricName,
  getFabricType,
  getFabricGsm,
  getFabricPrice,
  getFabricStock,
  getFabricImage,
  getFabricLocation,
  getFabricHsn,
  getFabricGstRate,
  getFabricMinStock,
  getFabricWidth,
  getFabricLabel,
  getFabricStockLabel,
  formatCurrency,
  formatMeters,
  normalizeFabric,
  matchesFabricSearch,
  pickText,
  pickNumber,
};
