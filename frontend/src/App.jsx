import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketsList from './pages/TicketsList';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import AssetsList from './pages/AssetsList';
import CreateAsset from './pages/CreateAsset';
import AssetDetail from './pages/AssetDetail';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import './App.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Always land on Login page first */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages wrapped in Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><Layout><TicketsList /></Layout></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute><Layout><CreateTicket /></Layout></ProtectedRoute>} />
          <Route path="/tickets/:ticketId" element={<ProtectedRoute><Layout><TicketDetail /></Layout></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><Layout><AssetsList /></Layout></ProtectedRoute>} />
          <Route path="/assets/new" element={<ProtectedRoute><Layout><CreateAsset /></Layout></ProtectedRoute>} />
          <Route path="/assets/:assetId" element={<ProtectedRoute><Layout><AssetDetail /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}