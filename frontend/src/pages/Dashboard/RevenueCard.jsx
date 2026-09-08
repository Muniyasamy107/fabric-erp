import React from 'react';
import './RevenueCard.css';

const RevenueCard = ({ title, value, subtitle, icon, isAlert }) => {
  return (
    <div className={`metric-card ${isAlert ? 'metric-alert' : ''}`}>
      <div className="card-top">
        <span className="card-title">{title}</span>
        <div className="card-icon">{icon}</div>
      </div>
      <div className="card-value">{value}</div>
      {subtitle && <span className="card-sub">{subtitle}</span>}
    </div>
  );
};

export default RevenueCard;