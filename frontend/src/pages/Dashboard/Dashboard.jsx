import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Activity,
  Layers,
  Gauge,
  Zap,
  TrendingUp,
  Droplets,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="dash-loading">Loading Mill Executive Analytics & SCADA Graphs...</div>;
  }

  const oeeData = stats?.weeklyOeeTrends || [
    { day: 'Mon', oee: 86.4 },
    { day: 'Tue', oee: 88.2 },
    { day: 'Wed', oee: 84.7 },
    { day: 'Thu', oee: 89.6 },
    { day: 'Fri', oee: 91.3 },
    { day: 'Sat', oee: 87.8 },
    { day: 'Sun', oee: 90.1 }
  ];

  const prodData = stats?.monthlyProduction || [
    { month: 'Apr', wovenMeters: 24500, yarnConsumedKg: 2200 },
    { month: 'May', wovenMeters: 28900, yarnConsumedKg: 2600 },
    { month: 'Jun', wovenMeters: 31200, yarnConsumedKg: 2800 },
    { month: 'Jul', wovenMeters: 35600, yarnConsumedKg: 3200 },
    { month: 'Aug', wovenMeters: 38400, yarnConsumedKg: 3450 },
    { month: 'Sep', wovenMeters: 42000, yarnConsumedKg: 3780 }
  ];

  const energyData = stats?.energyDistribution || [
    { name: 'Dye House Jet Vessels', value: 65, color: '#D4AF37' },
    { name: 'Stenter Calendering Line', value: 20, color: '#58A6FF' },
    { name: 'Sizing Cylinder Drying', value: 15, color: '#3FB950' }
  ];

  // Maximum production value for responsive bar height calculation
  const maxWoven = Math.max(...prodData.map((d) => d.wovenMeters), 45000);

  return (
    <div className="dash-page">
      {/* Top Banner */}
      <div className="dash-hero">
        <div>
          <span className="dash-kicker"><Sparkles size={14} /> 24x7 INTEGRATED TEXTILE WEAVING PLANT</span>
          <h1 className="dash-title">Executive Plant Dashboard & Operations Telemetry</h1>
          <p className="dash-sub">Real-time surveillance of loom OEE efficiency, fabric output yardage, thermal steam metrics and B2B consignments</p>
        </div>
        <div className="live-status-pill">
          <div className="live-pulse"></div>
          <span>LIVE SCADA STREAM ON</span>
        </div>
      </div>

      {/* 4 Core Executive KPI Cards */}
      <div className="kpi-banner-grid">
        <div className="kpi-box gold">
          <div className="kpi-icon"><TrendingUp size={24} /></div>
          <div>
            <span className="kpi-lbl">CUMULATIVE EXPORT TURNOVER</span>
            <div className="kpi-val gold-txt">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <small>{stats?.totalOrdersCount || 0} Commercial B2B Invoices Dispatched</small>
          </div>
        </div>

        <div className="kpi-box green">
          <div className="kpi-icon"><Layers size={24} /></div>
          <div>
            <span className="kpi-lbl">TOTAL DISPATCHED YARDAGE</span>
            <div className="kpi-val green-txt">
              {Number(stats?.totalMetersSold || 0).toLocaleString()} m
            </div>
            <small>Export & Domestic Finished Goods</small>
          </div>
        </div>

        <div className="kpi-box blue">
          <div className="kpi-icon"><Gauge size={24} /></div>
          <div>
            <span className="kpi-lbl">AVERAGE WEAVING OEE</span>
            <div className="kpi-val blue-txt">88.4%</div>
            <small>★ World Class Benchmark (≥85%)</small>
          </div>
        </div>

        <div className="kpi-box purple">
          <div className="kpi-icon"><Droplets size={24} /></div>
          <div>
            <span className="kpi-lbl">ZLD WATER RECLAMATION</span>
            <div className="kpi-val purple-txt">93.5%</div>
            <small>Zero Liquid Discharge Recycled</small>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Interactive SVG Visual Curve + Energy Donut Gauge */}
      <div className="charts-main-grid">
        {/* Chart 1: Loom Shed OEE % Weekly Curve */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Loom Shed OEE % & Machine Availability Trend</h3>
              <p>Daily shift performance vs 85% World-Class benchmark</p>
            </div>
            <span className="chart-tag">Weekly SCADA</span>
          </div>

          <div className="custom-oee-chart-container">
            <div className="chart-y-axis">
              <span>100%</span>
              <span>85% (Target)</span>
              <span>70%</span>
            </div>
            <div className="chart-bars-horizontal-flex">
              {oeeData.map((d, idx) => {
                const heightPercent = Math.min(100, Math.max(20, ((d.oee - 60) / 40) * 100));
                const isTargetPass = d.oee >= 85;
                return (
                  <div key={idx} className="oee-bar-col">
                    <div className="bar-wrapper">
                      <div
                        className={`oee-fill-bar ${isTargetPass ? 'target-pass' : 'target-miss'}`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="bar-tooltip-val">{d.oee}%</span>
                      </div>
                    </div>
                    <span className="bar-x-lbl">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 2: Steam & Thermal Energy Donut */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Thermal Steam Energy Distribution</h3>
              <p>High-pressure 10.5 Bar steam allocation by department</p>
            </div>
            <span className="chart-tag">Boiler Flow</span>
          </div>

          <div className="donut-energy-container">
            <div className="donut-circle-visual">
              <div className="donut-center-metric">
                <strong>48.5 T</strong>
                <small>Total Steam / Day</small>
              </div>
            </div>

            <div className="donut-legend-stack">
              {energyData.map((e, idx) => (
                <div key={idx} className="d-legend-item">
                  <span className="d-dot" style={{ backgroundColor: e.color }}></span>
                  <span className="d-name">{e.name}</span>
                  <strong className="d-val">{e.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Monthly Production Yardage Output vs Stock Alert */}
      <div className="charts-secondary-grid">
        {/* Chart 3: Monthly Woven Yardage */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Monthly Woven Fabric Output (Meters)</h3>
              <p>Woven yardage growth across weaving loom halls</p>
            </div>
            <span className="chart-tag">PPC Output</span>
          </div>

          <div className="monthly-bars-container">
            {prodData.map((p, idx) => {
              const h = (p.wovenMeters / maxWoven) * 100;
              return (
                <div key={idx} className="m-prod-col">
                  <div className="m-prod-bar-track">
                    <div className="m-prod-fill" style={{ height: `${h}%` }}>
                      <span className="m-prod-tooltip">{p.wovenMeters.toLocaleString()}m</span>
                    </div>
                  </div>
                  <span className="m-lbl">{p.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Warehouse Inventory Alert Panel */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Warehouse Re-order Alerts</h3>
              <p>Fabric qualities nearing safety buffer stock</p>
            </div>
            <span className="chart-tag alert-tag"><AlertTriangle size={12} /> Stock Alert</span>
          </div>

          <div className="stock-alert-list">
            {!stats?.lowStockFabrics || stats.lowStockFabrics.length === 0 ? (
              <p className="empty-alert-txt">All finished fabric qualities are well above minimum re-order levels.</p>
            ) : (
              stats.lowStockFabrics.map((f) => (
                <div key={f.id} className="stock-alert-item">
                  <div>
                    <strong>{f.fabricName}</strong>
                    <div className="f-sku">{f.qualityCode} • {f.weaveType}</div>
                  </div>
                  <div className="stock-right">
                    <span className="red-stock">{f.totalStockMeters} m left</span>
                    <small>Alert at: {f.reorderAlertLevel} m</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;