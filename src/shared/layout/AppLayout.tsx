import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-sidebar-open' : ''}`}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((current) => !current)} onNavigate={() => setMobileOpen(false)} />
      <button type="button" className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />
      <main className="main-content" tabIndex={-1}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
}
