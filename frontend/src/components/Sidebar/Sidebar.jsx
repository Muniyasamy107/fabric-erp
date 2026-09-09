import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Scissors,
  Truck,
  LogOut,
  Shield,
  ScrollText,
  Settings,
  Sparkles,
  Users,
  Send,
  Coins,
  Award,
  FlaskConical,
  Flame,
  PackageCheck,
  Disc,
  Wrench,
  Calculator,
  Gauge,
  Globe,
  DoorClosed,
  Compass,
  Grid,
  Droplets,
  Zap,
  Palette,
  UserCheck,
  ClipboardList,
  ClipboardCheck,
  FileText,
  Boxes,
  Percent
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const role = user?.role || 'ADMIN';

  const allItems = [
    { name: 'Mill Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Fabric Catalog', path: '/fabrics', icon: <Scissors size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Swatch Gallery', path: '/lookbook', icon: <Sparkles size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Remnant Clearance', path: '/remnant-clearance', icon: <Percent size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'CAD Weave Studio', path: '/cad-studio', icon: <Palette size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Production Planning', path: '/planning', icon: <Compass size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Yarn & Dye House', path: '/dye-house', icon: <FlaskConical size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Warping & Sizing', path: '/beam-preparation', icon: <Disc size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Loom 2D Floor Matrix', path: '/loom-matrix', icon: <Grid size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Loom Control Room', path: '/production', icon: <Settings size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Shift Yield & OEE', path: '/shift-oee', icon: <Gauge size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Fabric Costing & BOM', path: '/costing', icon: <Calculator size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Boiler & Steam Power', path: '/boiler-energy', icon: <Flame size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Stenter & Finishing', path: '/finishing', icon: <Zap size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'QC & Lab Test', path: '/quality-lab', icon: <Award size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'ETP & Water Recycling', path: '/etp-sustainability', icon: <Droplets size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Roll Packing & Bales', path: '/roll-packing', icon: <PackageCheck size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Plant Maintenance', path: '/maintenance', icon: <Wrench size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Worker Attendance & OT', path: '/attendance-muster', icon: <ClipboardList size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Security Gate Pass', path: '/gate-pass', icon: <DoorClosed size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Global B2B Exports', path: '/exports', icon: <Globe size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'B2B Wholesale Clients', path: '/clients', icon: <Users size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Wholesale Dispatch', path: '/dispatch', icon: <Send size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Weaver Payroll', path: '/wages', icon: <Coins size={20} />, roles: ['ADMIN'] },
    { name: 'Day-End Settlement', path: '/day-end-settlement', icon: <ClipboardCheck size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Stock Movement Ledger', path: '/stock-ledger', icon: <Boxes size={20} />, roles: ['ADMIN', 'CASHIER'] },
    { name: 'Purchase Orders', path: '/purchase-orders', icon: <FileText size={20} />, roles: ['ADMIN'] },
    { name: 'Yarn Suppliers', path: '/suppliers', icon: <Truck size={20} />, roles: ['ADMIN'] },
    { name: 'Shift Staff', path: '/staff', icon: <UserCheck size={20} />, roles: ['ADMIN'] },
    { name: 'Production Reports', path: '/reports', icon: <ScrollText size={20} />, roles: ['ADMIN'] }
  ];

  const menuItems = allItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="luxury-sidebar">
      <div className="sidebar-brand">
        <h2 className="brand-gold">KAK TEXTILE PROCESSING</h2>
        <span className="brand-sub">Textile Processing ERP</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>
          <small>{user?.fullName || 'Shift Mgr'}</small>
          <div className="footer-role">{role}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;