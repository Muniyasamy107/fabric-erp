import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import FabricList from './pages/Inventory/FabricList';
import Lookbook from './pages/Inventory/Lookbook';
import RemnantClearance from './pages/Inventory/RemnantClearance';
import CadDesignStudioMaster from './pages/ProductionWorkshop/CadDesignStudioMaster';
import ProductionPlanningMaster from './pages/ProductionWorkshop/ProductionPlanningMaster';
import LoomFloorMatrix from './pages/ProductionWorkshop/LoomFloorMatrix';
import LoomDashboard from './pages/ProductionWorkshop/LoomDashboard';
import DyeHouseLab from './pages/ProductionWorkshop/DyeHouseLab';
import WarpingSizingBeamMaster from './pages/ProductionWorkshop/BeamPreparationMaster';
import ShiftOeeMaster from './pages/ProductionWorkshop/ShiftOeeMaster';
import FabricCostingMaster from './pages/ProductionWorkshop/FabricCostingMaster';
import BoilerEnergyMaster from './pages/ProductionWorkshop/BoilerEnergyMaster';
import FinishingMaster from './pages/ProductionWorkshop/FinishingMaster';
import QualityInspectionList from './pages/ProductionWorkshop/QualityInspectionList';
import EtpSustainabilityMaster from './pages/ProductionWorkshop/EtpSustainabilityMaster';
import RollPackingMaster from './pages/ProductionWorkshop/RollPackingMaster';
import MachineMaintenanceMaster from './pages/ProductionWorkshop/MachineMaintenanceMaster';
import BiometricKiosk from './pages/ProductionWorkshop/BiometricKiosk';
import MillAttendanceMaster from './pages/ProductionWorkshop/MillAttendanceMaster';
import ExportContractMaster from './pages/B2BClients/ExportContractMaster';
import GatePassMaster from './pages/WholesaleDispatch/GatePassMaster';
import ClientDirectory from './pages/B2BClients/ClientDirectory';
import DispatchInvoicing from './pages/WholesaleDispatch/DispatchInvoicing';
import WeaverPayroll from './pages/ProductionWorkshop/WeaverPayroll';
import DayEndSettlement from './pages/Reports/DayEndSettlement';
import StockReport from './pages/Reports/StockReport';
import PurchaseOrderList from './pages/Suppliers/PurchaseOrderList';
import SupplierList from './pages/Suppliers/SupplierList';
import StaffList from './pages/Staff/StaffList';
import FinancialReport from './pages/Reports/FinancialReport';
import { getRoleLanding } from './utils/roleAccess';
import './App.css';

// Every page is wrapped in a role-aware guard: an authenticated user who types
// a URL their role may not open is redirected to their own landing page.
// Allowed roles per path live in utils/roleAccess.js.
const guarded = (path, element) => (
  <ProtectedRoute requiredPath={path}>{element}</ProtectedRoute>
);

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-view">
          <Routes>
            <Route path="/dashboard" element={guarded('/dashboard', <Dashboard />)} />
            <Route path="/fabrics" element={guarded('/fabrics', <FabricList />)} />
            <Route path="/lookbook" element={guarded('/lookbook', <Lookbook />)} />
            <Route path="/remnant-clearance" element={guarded('/remnant-clearance', <RemnantClearance />)} />
            <Route path="/cad-studio" element={guarded('/cad-studio', <CadDesignStudioMaster />)} />
            <Route path="/planning" element={guarded('/planning', <ProductionPlanningMaster />)} />
            <Route path="/dye-house" element={guarded('/dye-house', <DyeHouseLab />)} />
            <Route path="/beam-preparation" element={guarded('/beam-preparation', <WarpingSizingBeamMaster />)} />
            <Route path="/loom-matrix" element={guarded('/loom-matrix', <LoomFloorMatrix />)} />
            <Route path="/production" element={guarded('/production', <LoomDashboard />)} />
            <Route path="/shift-oee" element={guarded('/shift-oee', <ShiftOeeMaster />)} />
            <Route path="/costing" element={guarded('/costing', <FabricCostingMaster />)} />
            <Route path="/boiler-energy" element={guarded('/boiler-energy', <BoilerEnergyMaster />)} />
            <Route path="/finishing" element={guarded('/finishing', <FinishingMaster />)} />
            <Route path="/quality-lab" element={guarded('/quality-lab', <QualityInspectionList />)} />
            <Route path="/etp-sustainability" element={guarded('/etp-sustainability', <EtpSustainabilityMaster />)} />
            <Route path="/roll-packing" element={guarded('/roll-packing', <RollPackingMaster />)} />
            <Route path="/maintenance" element={guarded('/maintenance', <MachineMaintenanceMaster />)} />
            <Route path="/attendance-muster" element={guarded('/attendance-muster', <MillAttendanceMaster />)} />
            <Route path="/biometric" element={guarded('/biometric', <BiometricKiosk />)} />
            <Route path="/gate-pass" element={guarded('/gate-pass', <GatePassMaster />)} />
            <Route path="/exports" element={guarded('/exports', <ExportContractMaster />)} />
            <Route path="/clients" element={guarded('/clients', <ClientDirectory />)} />
            <Route path="/dispatch" element={guarded('/dispatch', <DispatchInvoicing />)} />
            <Route path="/wages" element={guarded('/wages', <WeaverPayroll />)} />
            <Route path="/day-end-settlement" element={guarded('/day-end-settlement', <DayEndSettlement />)} />
            <Route path="/stock-ledger" element={guarded('/stock-ledger', <StockReport />)} />
            <Route path="/purchase-orders" element={guarded('/purchase-orders', <PurchaseOrderList />)} />
            <Route path="/suppliers" element={guarded('/suppliers', <SupplierList />)} />
            <Route path="/staff" element={guarded('/staff', <StaffList />)} />
            <Route path="/reports" element={guarded('/reports', <FinancialReport />)} />
            <Route path="*" element={<RoleHomeRedirect />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

/** Unknown / not-allowed URLs inside the app fall back to the role landing page. */
function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getRoleLanding(user?.role) || '/login'} replace />;
}

/** "/" → login when signed out, otherwise the first page the role may open. */
function RootRedirect() {
  const { token, user } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getRoleLanding(user?.role) || '/login'} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
            />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
