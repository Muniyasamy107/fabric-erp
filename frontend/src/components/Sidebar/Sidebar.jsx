import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Scissors,
  Truck,
  LogOut,
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
  Fingerprint,
  ClipboardCheck,
  FileText,
  Boxes,
  Percent
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { canAccessPath, normalizeRole } from '../../utils/roleAccess';
import './Sidebar.css';

// Menu definition — which roles may open a page is owned by utils/roleAccess.js
// (ROLE_PAGES / PAGE_ROLES), so the menu can never drift from the route guard.
const allItems = [
  { name: 'Mill Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Fabric Catalog', path: '/fabrics', icon: <Scissors size={20} /> },
  { name: 'Swatch Gallery', path: '/lookbook', icon: <Sparkles size={20} /> },
  { name: 'Remnant Clearance', path: '/remnant-clearance', icon: <Percent size={20} /> },
  { name: 'CAD Weave Studio', path: '/cad-studio', icon: <Palette size={20} /> },
  { name: 'Production Planning', path: '/planning', icon: <Compass size={20} /> },
  { name: 'Yarn & Dye House', path: '/dye-house', icon: <FlaskConical size={20} /> },
  { name: 'Warping & Sizing', path: '/beam-preparation', icon: <Disc size={20} /> },
  { name: 'Loom 2D Floor Matrix', path: '/loom-matrix', icon: <Grid size={20} /> },
  { name: 'Loom Control Room', path: '/production', icon: <Settings size={20} /> },
  { name: 'Shift Yield & OEE', path: '/shift-oee', icon: <Gauge size={20} /> },
  { name: 'Fabric Costing & BOM', path: '/costing', icon: <Calculator size={20} /> },
  { name: 'Boiler & Steam Power', path: '/boiler-energy', icon: <Flame size={20} /> },
  { name: 'Stenter & Finishing', path: '/finishing', icon: <Zap size={20} /> },
  { name: 'QC & Lab Test', path: '/quality-lab', icon: <Award size={20} /> },
  { name: 'ETP & Water Recycling', path: '/etp-sustainability', icon: <Droplets size={20} /> },
  { name: 'Roll Packing & Bales', path: '/roll-packing', icon: <PackageCheck size={20} /> },
  { name: 'Plant Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
  { name: 'Attendance Register & OT', path: '/attendance-muster', icon: <ClipboardList size={20} /> },
  { name: 'Biometric Punch Kiosk', path: '/biometric', icon: <Fingerprint size={20} /> },
  { name: 'Security Gate Pass', path: '/gate-pass', icon: <DoorClosed size={20} /> },
  { name: 'Global B2B Exports', path: '/exports', icon: <Globe size={20} /> },
  { name: 'B2B Wholesale Clients', path: '/clients', icon: <Users size={20} /> },
  { name: 'Wholesale Dispatch', path: '/dispatch', icon: <Send size={20} /> },
  { name: 'Weaver Payroll', path: '/wages', icon: <Coins size={20} /> },
  { name: 'Day-End Settlement', path: '/day-end-settlement', icon: <ClipboardCheck size={20} /> },
  { name: 'Stock Movement Ledger', path: '/stock-ledger', icon: <Boxes size={20} /> },
  { name: 'Purchase Orders', path: '/purchase-orders', icon: <FileText size={20} /> },
  { name: 'Yarn Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
  { name: 'Shift Staff', path: '/staff', icon: <UserCheck size={20} /> },
  { name: 'Production Reports', path: '/reports', icon: <ScrollText size={20} /> }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const role = normalizeRole(user?.role);
  const roleLabel = role || 'NO ROLE';

  const menuItems = allItems.filter((item) => canAccessPath(role, item.path));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="luxury-sidebar">
      <div className="sidebar-brand">
        <h2 className="brand-gold">KAK TEXTILE PROCESSING</h2>
        <span className="brand-sub">Textile Processing ERP</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.length === 0 && (
          <p className="sidebar-empty-msg">
            No menu is assigned to your role. Contact the plant admin.
          </p>
        )}
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
          <small>{user?.fullName || 'Mill Employee'}</small>
          <div className="footer-role">{roleLabel}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
