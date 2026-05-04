import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Wallet, LogOut, Plus } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(var(--glass-blur))',
        borderRight: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wallet size={28} color="var(--accent-primary)" />
            FinancaIme
          </h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Përmbledhja" active={location.pathname === '/'} />
          <NavItem to="/expenses" icon={<Receipt size={20} />} label="Shpenzimet" active={location.pathname === '/expenses'} />
          <NavItem to="/categories" icon={<PieChart size={20} />} label="Kategoritë" active={location.pathname === '/categories'} />
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-secondary)', background: 'transparent' }}>
            <LogOut size={20} /> Dil nga llogaria
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/categories" element={<div className="glass-panel"><h2>Kategoritë (Në Zhvillim)</h2><p>Këtu do të menaxhohen kategoritë.</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      color: active ? 'white' : 'var(--text-secondary)',
      background: active ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'all 0.2s',
      boxShadow: active ? '0 4px 15px rgba(59, 130, 246, 0.2)' : 'none'
    }}>
      {icon}
      {label}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
