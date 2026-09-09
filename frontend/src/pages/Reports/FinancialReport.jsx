import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { exportToCsv } from '../../utils/excelExporter';
import {
  Download,
  Building2,
  Layers,
  Award,
  Coins,
  Package,
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import './FinancialReport.css';

const FinancialReport = () => {
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('INVOICES');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => {
      API.get('/reports/financial-summary')
        .then((res) => {
          setReportData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    refresh();
    // Live refresh
    const interval = setInterval(refresh, 45000);
    return () => clearInterval(interval);
  }, []);

  // --- 1. Export B2B Wholesale Invoices ---
  const handleExportInvoices = () => {
    const invoices = reportData?.invoicesList || [];
    const headers = ['Invoice Number', 'Buyer Company', 'Phone', 'Transport LR No', 'Taxable Value (INR)', 'GST Amount (INR)', 'Grand Total (INR)', 'Payment Terms', 'Dispatch Date'];
    const rows = invoices.map((i) => [
      i.invoiceNumber,
      i.clientCompanyName,
      i.clientPhone,
      i.transportLRNumber || 'Direct Freight',
      i.totalTaxableValue,
      i.gstAmount,
      i.grandTotalValue,
      i.paymentTerms,
      i.dispatchDate ? new Date(i.dispatchDate).toLocaleString('en-IN') : 'N/A'
    ]);
    exportToCsv('Mill_B2B_Wholesale_Invoices', headers, rows);
  };

  // --- 2. Export Production Lots ---
  const handleExportProduction = () => {
    const jobs = reportData?.productionJobsList || [];
    const headers = ['Batch Lot No', 'Fabric Quality', 'Loom Number', 'Target Meters', 'Produced Meters', 'Scrap Meters', 'Quality Grade', 'Status', 'Start Date'];
    const rows = jobs.map((j) => [
      j.batchNumber,
      j.fabricProductName,
      j.assignedLoomNumber || 'Loom Hall',
      j.targetMeters,
      j.producedMeters,
      j.defectWastageMeters,
      j.fabricQualityGrade,
      j.jobStatus,
      j.startDate || 'N/A'
    ]);
    exportToCsv('Mill_Loom_Production_Lots', headers, rows);
  };

  // --- 3. Export QC Lab Test Reports ---
  const handleExportQc = () => {
    const qc = reportData?.qcReportsList || [];
    const headers = ['Certificate No', 'Batch Lot', 'Fabric Name', 'Inspected Meters', '4-Point Score', 'Tested GSM', 'Shrinkage %', 'Tensile N', 'Color Fastness', 'Final Verdict', 'Inspector'];
    const rows = qc.map((q) => [
      q.certificateNumber,
      q.batchLotNumber,
      q.fabricProductName,
      q.totalInspectedMeters,
      q.fourPointScore,
      q.testedGsm,
      q.shrinkagePercentage,
      q.tensileStrengthNewton,
      q.colorFastnessRating,
      q.finalVerdict,
      q.qcInspectorName
    ]);
    exportToCsv('Mill_Quality_4Point_Audit', headers, rows);
  };

  // --- 4. Export Weaver Wages ---
  const handleExportWages = () => {
    const wages = reportData?.weaverWagesList || [];
    const headers = ['Voucher Ref', 'Weaver Name', 'Batch Lot', 'Fabric Quality', 'Woven Meters', 'Rate / m (INR)', 'Total Wage (INR)', 'Payment Status', 'Disbursement Date'];
    const rows = wages.map((w) => [
      w.voucherNumber || 'VOUCH-PENDING',
      w.weaverName,
      w.batchNumber,
      w.fabricProductName,
      w.totalWovenMeters,
      w.ratePerMeter,
      w.totalPayableWage,
      w.paymentStatus,
      w.disbursementDate || 'Pending'
    ]);
    exportToCsv('Mill_Weaver_Wage_Disbursements', headers, rows);
  };

  // --- 5. Export Yarn Inventory ---
  const handleExportYarn = () => {
    const yarn = reportData?.yarnStockList || [];
    const headers = ['Yarn Lot No', 'Count Specification', 'Fiber Class', 'Origin Spinning Mill', 'Stock Weight (KG)', 'Cartons / Bags', 'Rate / KG (INR)', 'Storage Bay', 'Status'];
    const rows = yarn.map((y) => [
      y.yarnLotNumber,
      y.yarnCountSpecification,
      y.fiberType,
      y.yarnOriginMill,
      y.totalWeightKg,
      y.totalBagsOrBoxes,
      y.purchasePricePerKg,
      y.warehouseRackBay,
      y.yarnStatus
    ]);
    exportToCsv('Mill_Raw_Yarn_Inventory', headers, rows);
  };

  if (loading) {
    return <div className="report-loading">Generating Mill Statutory Audit Datasets...</div>;
  }

  const invoices = reportData?.invoicesList || [];
  const jobs = reportData?.productionJobsList || [];
  const qcList = reportData?.qcReportsList || [];
  const wages = reportData?.weaverWagesList || [];
  const yarn = reportData?.yarnStockList || [];

  return (
    <div className="report-page">
      {/* Header */}
      <div className="report-header">
        <div>
          <span className="report-kicker"><Sparkles size={14} /> MILL AUDITING & EXCEL INTELLIGENCE</span>
          <h1 className="report-title">Statutory Factory Audit & Excel Reports</h1>
          <p className="report-sub">Export itemized datasets for B2B dispatches, loom yardage, raw yarn, QC certificates and weaver payroll</p>
        </div>
      </div>

      {/* Top Turnover Metrics */}
      <div className="report-kpi-grid">
        <div className="r-card gold-border">
          <div className="r-icon"><TrendingUp size={24} /></div>
          <div>
            <span className="r-lbl">TOTAL CUMULATIVE SALES</span>
            <div className="r-val gold-val">
              ₹{Number(reportData?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <small>{reportData?.totalInvoicesCount || 0} Invoices Billed</small>
          </div>
        </div>

        <div className="r-card">
          <div className="r-icon"><Layers size={24} /></div>
          <div>
            <span className="r-lbl">TOTAL DISPATCHED YARDAGE</span>
            <div className="r-val">{Number(reportData?.totalMetersSold || 0).toLocaleString()} m</div>
            <small>Direct Shipped Woven Goods</small>
          </div>
        </div>

        <div className="r-card">
          <div className="r-icon"><ShieldCheck size={24} /></div>
          <div>
            <span className="r-lbl">AUDITED PROCESS LOTS</span>
            <div className="r-val">{jobs.length} Lots</div>
            <small>100% Traceable Mill Records</small>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="report-tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'INVOICES' ? 'active' : ''}`}
          onClick={() => setActiveTab('INVOICES')}
        >
          <Building2 size={16} /> B2B Invoices ({invoices.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PRODUCTION' ? 'active' : ''}`}
          onClick={() => setActiveTab('PRODUCTION')}
        >
          <Layers size={16} /> Woven Lots ({jobs.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'QC' ? 'active' : ''}`}
          onClick={() => setActiveTab('QC')}
        >
          <Award size={16} /> QC 4-Point Lab ({qcList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'WAGES' ? 'active' : ''}`}
          onClick={() => setActiveTab('WAGES')}
        >
          <Coins size={16} /> Weaver Wages ({wages.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'YARN' ? 'active' : ''}`}
          onClick={() => setActiveTab('YARN')}
        >
          <Package size={16} /> Raw Yarn ({yarn.length})
        </button>
      </div>

      {/* View 1: B2B Invoices Table */}
      {activeTab === 'INVOICES' && (
        <div className="report-table-card">
          <div className="table-card-top">
            <h3>B2B Wholesale Invoices & Tax Audit Register</h3>
            <button className="btn-export-excel" onClick={handleExportInvoices}>
              <Download size={14} /> Export Invoices to Excel (.CSV)
            </button>
          </div>
          <table className="rep-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Client Company</th>
                <th>Transport LR No</th>
                <th>Payment Terms</th>
                <th>Taxable Subtotal</th>
                <th>GST (5%)</th>
                <th className="text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan="7" className="empty-txt">No invoices dispatched.</td></tr>
              ) : (
                invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="gold-code">{i.invoiceNumber}</td>
                    <td><strong>{i.clientCompanyName}</strong></td>
                    <td>{i.transportLRNumber || 'Direct Freight'}</td>
                    <td><span className="tag-pill">{i.paymentTerms}</span></td>
                    <td>₹{Number(i.totalTaxableValue || 0).toFixed(2)}</td>
                    <td>₹{Number(i.gstAmount || 0).toFixed(2)}</td>
                    <td className="text-right bold-amt">₹{Number(i.grandTotalValue || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: Production Lots Table */}
      {activeTab === 'PRODUCTION' && (
        <div className="report-table-card">
          <div className="table-card-top">
            <h3>Loom Production Lots & Yardage Audit</h3>
            <button className="btn-export-excel" onClick={handleExportProduction}>
              <Download size={14} /> Export Production to Excel (.CSV)
            </button>
          </div>
          <table className="rep-table">
            <thead>
              <tr>
                <th>Lot / Batch No</th>
                <th>Fabric Quality</th>
                <th>Loom No</th>
                <th>Target (m)</th>
                <th>Produced (m)</th>
                <th>Scrap (m)</th>
                <th>Quality Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr><td colSpan="8" className="empty-txt">No production lots found.</td></tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id}>
                    <td className="gold-code">{j.batchNumber}</td>
                    <td><strong>{j.fabricProductName}</strong></td>
                    <td>{j.assignedLoomNumber}</td>
                    <td>{j.targetMeters} m</td>
                    <td className="green-txt">{j.producedMeters} m</td>
                    <td className="red-txt">{j.defectWastageMeters} m</td>
                    <td><span className="grade-tag">{j.fabricQualityGrade}</span></td>
                    <td><span className="status-tag">{j.jobStatus}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View 3: QC 4-Point Lab Table */}
      {activeTab === 'QC' && (
        <div className="report-table-card">
          <div className="table-card-top">
            <h3>ASTM 4-Point Quality Inspection Audit Certificates</h3>
            <button className="btn-export-excel" onClick={handleExportQc}>
              <Download size={14} /> Export QC Audit to Excel (.CSV)
            </button>
          </div>
          <table className="rep-table">
            <thead>
              <tr>
                <th>Cert No</th>
                <th>Batch Lot</th>
                <th>Fabric Name</th>
                <th>Inspected (m)</th>
                <th>4-Point Score</th>
                <th>Tested GSM</th>
                <th>Audit Verdict</th>
              </tr>
            </thead>
            <tbody>
              {qcList.length === 0 ? (
                <tr><td colSpan="7" className="empty-txt">No QC inspection certificates.</td></tr>
              ) : (
                qcList.map((q) => (
                  <tr key={q.id}>
                    <td className="gold-code">{q.certificateNumber}</td>
                    <td><strong>{q.batchLotNumber}</strong></td>
                    <td>{q.fabricProductName}</td>
                    <td>{q.totalInspectedMeters} m</td>
                    <td className="score-txt">{q.fourPointScore} pts</td>
                    <td>{q.testedGsm} GSM</td>
                    <td><span className="verdict-tag">{q.finalVerdict}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View 4: Weaver Wages Table */}
      {activeTab === 'WAGES' && (
        <div className="report-table-card">
          <div className="table-card-top">
            <h3>Weaver Labour Wage & Piece-Rate Disbursement Register</h3>
            <button className="btn-export-excel" onClick={handleExportWages}>
              <Download size={14} /> Export Wages to Excel (.CSV)
            </button>
          </div>
          <table className="rep-table">
            <thead>
              <tr>
                <th>Voucher Ref</th>
                <th>Weaver Name</th>
                <th>Lot No</th>
                <th>Woven Meters</th>
                <th>Rate / m</th>
                <th>Total Wage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {wages.length === 0 ? (
                <tr><td colSpan="7" className="empty-txt">No weaver wage entries.</td></tr>
              ) : (
                wages.map((w) => (
                  <tr key={w.id}>
                    <td className="gold-code">{w.voucherNumber || 'PENDING'}</td>
                    <td><strong>{w.weaverName}</strong></td>
                    <td>{w.batchNumber}</td>
                    <td>{w.totalWovenMeters} m</td>
                    <td>₹{w.ratePerMeter}</td>
                    <td className="green-txt">₹{Number(w.totalPayableWage).toFixed(2)}</td>
                    <td><span className="status-tag">{w.paymentStatus}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View 5: Raw Yarn Stock Table */}
      {activeTab === 'YARN' && (
        <div className="report-table-card">
          <div className="table-card-top">
            <h3>Raw Yarn Cone Inventory & Warehouse Balance</h3>
            <button className="btn-export-excel" onClick={handleExportYarn}>
              <Download size={14} /> Export Yarn Stock to Excel (.CSV)
            </button>
          </div>
          <table className="rep-table">
            <thead>
              <tr>
                <th>Yarn Lot No</th>
                <th>Count Specification</th>
                <th>Fiber Type</th>
                <th>Spinning Mill Origin</th>
                <th>Stock Weight</th>
                <th>Boxes</th>
                <th>Bay</th>
              </tr>
            </thead>
            <tbody>
              {yarn.length === 0 ? (
                <tr><td colSpan="7" className="empty-txt">No yarn stock available.</td></tr>
              ) : (
                yarn.map((y) => (
                  <tr key={y.id}>
                    <td className="gold-code">{y.yarnLotNumber}</td>
                    <td><strong>{y.yarnCountSpecification}</strong></td>
                    <td>{y.fiberType}</td>
                    <td>{y.yarnOriginMill}</td>
                    <td className="green-txt">{y.totalWeightKg} KG</td>
                    <td>{y.totalBagsOrBoxes} boxes</td>
                    <td>{y.warehouseRackBay}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinancialReport;