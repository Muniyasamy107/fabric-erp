import React, { useEffect, useState, useRef } from 'react';
import { getUnreadNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  UserCircle,
  AlertTriangle,
  Wrench,
  Droplets,
  Package,
  Globe,
  CheckCheck,
  Check
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const dropdownRef = useRef(null);

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      navigate(`/fabrics?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await getUnreadNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    try {
      await markNotificationRead(notif.id);
      loadNotifications();
      setShowDropdown(false);
      if (notif.actionUrl) {
        navigate(notif.actionUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'BREAKDOWN':
        return <Wrench size={16} color="#f85149" />;
      case 'LOW_STOCK':
        return <AlertTriangle size={16} color="#e3b341" />;
      case 'ETP_ALERT':
        return <Droplets size={16} color="#3fb950" />;
      case 'DISPATCH':
        return <Globe size={16} color="#58a6ff" />;
      default:
        return <Package size={16} color="#d4af37" />;
    }
  };

  return (
    <header className="luxury-navbar">
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Quick search fabric qualities — press Enter..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          onKeyDown={handleQuickSearch}
        />
      </div>

      <div className="navbar-profile">
        {/* Notification Bell Container */}
        <div className="notification-bell-container" ref={dropdownRef}>
          <button
            type="button"
            className={`icon-btn ${notifications.length > 0 ? 'has-unread' : ''}`}
            onClick={() => setShowDropdown(!showDropdown)}
            title="Mill Alerts & Telemetry Notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="bell-badge-count">
                {notifications.length > 99 ? '99+' : notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown Drawer */}
          {showDropdown && (
            <div className="notification-dropdown-menu">
              <div className="notif-menu-header">
                <div className="header-title-row">
                  <strong>Mill Alerts & Telemetry ({notifications.length})</strong>
                  {notifications.length > 0 && (
                    <button type="button" className="btn-mark-all" onClick={handleMarkAllRead}>
                      <CheckCheck size={14} /> Mark All Read
                    </button>
                  )}
                </div>
              </div>

              <div className="notif-list-container">
                {notifications.length === 0 ? (
                  <div className="empty-notif">
                    <Check size={20} color="#3fb950" />
                    <p>All plant systems normal. No active alerts.</p>
                  </div>
                ) : (
                  <>
                    {notifications.length > 25 && (
                      <div className="notif-limit-note">
                        Showing latest 25 of {notifications.length} alerts
                      </div>
                    )}
                    {notifications.slice(0, 25).map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item severity-${n.severity?.toLowerCase()}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="notif-icon-col">
                        {getCategoryIcon(n.alertCategory)}
                      </div>
                      <div className="notif-content-col">
                        <div className="notif-title-row">
                          <strong>{n.title}</strong>
                          <span className={`sev-badge ${n.severity?.toLowerCase()}`}>{n.severity}</span>
                        </div>
                        <p className="notif-msg">{n.message}</p>
                        <span className="notif-time">
                          {n.createdAt ? new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                    </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Badge */}
        <div className="user-badge">
          <UserCircle size={26} color="#d4af37" />
          <div>
            <span className="user-name">{user?.fullName || 'Shift General Manager'}</span>
            <span className="user-role">{user?.role || 'Plant Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;