import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Auth/Login';
import Landing from './pages/Landing/Landing';
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
import './App.css';

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-view">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fabrics" element={<FabricList />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/remnant-clearance" element={<RemnantClearance />} />
            <Route path="/cad-studio" element={<CadDesignStudioMaster />} />
            <Route path="/planning" element={<ProductionPlanningMaster />} />
            <Route path="/dye-house" element={<DyeHouseLab />} />
            <Route path="/beam-preparation" element={<WarpingSizingBeamMaster />} />
            <Route path="/loom-matrix" element={<LoomFloorMatrix />} />
            <Route path="/production" element={<LoomDashboard />} />
            <Route path="/shift-oee" element={<ShiftOeeMaster />} />
            <Route path="/costing" element={<FabricCostingMaster />} />
            <Route path="/boiler-energy" element={<BoilerEnergyMaster />} />
            <Route path="/finishing" element={<FinishingMaster />} />
            <Route path="/quality-lab" element={<QualityInspectionList />} />
            <Route path="/etp-sustainability" element={<EtpSustainabilityMaster />} />
            <Route path="/roll-packing" element={<RollPackingMaster />} />
            <Route path="/maintenance" element={<MachineMaintenanceMaster />} />
            <Route path="/attendance-muster" element={<MillAttendanceMaster />} />
            <Route path="/biometric" element={<BiometricKiosk />} />
            <Route path="/gate-pass" element={<GatePassMaster />} />
            <Route path="/exports" element={<ExportContractMaster />} />
            <Route path="/clients" element={<ClientDirectory />} />
            <Route path="/dispatch" element={<DispatchInvoicing />} />
            <Route path="/wages" element={<WeaverPayroll />} />
            <Route path="/day-end-settlement" element={<DayEndSettlement />} />
            <Route path="/stock-ledger" element={<StockReport />} />
            <Route path="/purchase-orders" element={<PurchaseOrderList />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/reports" element={<FinancialReport />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;