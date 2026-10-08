import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VikasPayApp from './VikasPayApp';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import LenderDashboard from './pages/LenderDashboard';
import LenderMessages from './pages/LenderMessages';
import SharedReports from './pages/SharedReports';
import AdminPanel from './pages/AdminPanel';
import AdminFlow from './pages/AdminFlow';
import AdminMerchants from './pages/AdminMerchants';
import AdminLenders from './pages/AdminLenders';

import LenderMarketplace from './pages/LenderMarketplace';

function App() {
  return (
    <Routes>
      {/* Public Landing & Auth Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/vikaspay" element={<VikasPayApp />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Merchant Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lenders-marketplace"
        element={
          <ProtectedRoute>
            <LenderMarketplace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Lender Role Pages */}
      <Route
        path="/lender"
        element={
          <ProtectedRoute>
            <LenderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lender/reports"
        element={
          <ProtectedRoute>
            <SharedReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lender/messages"
        element={
          <ProtectedRoute>
            <LenderMessages />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Role Pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/merchants"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminMerchants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lenders"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLenders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/flow"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminFlow />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
