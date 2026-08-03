import { NavLink } from 'react-router-dom';
import { BarChart3, ChevronLeft, ChevronRight, ClipboardList, FileSearch, LayoutDashboard, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { menuItems } from '../config/routes';
import { canViewModule } from '../config/permissions';
import { useAuth } from '../../features/auth/AuthProvider';

const icons = [LayoutDashboard, FileSearch, Stethoscope, ClipboardList, BarChart3, Users, ShieldCheck];

export function Sidebar({ collapsed, onToggleCollapsed, onNavigate }: { collapsed: boolean; onToggleCollapsed: () => void; onNavigate: () => void }) {
  const { user } = useAuth();
  const items = menuItems.filter((item) => canViewModule(user, item.module));
  return (
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="brand">
        <strong>SGUM</strong>
        <span>Instancia Municipal para el Desarrollo de la Mujer</span>
      </div>
      <button type="button" className="sidebar-toggle" onClick={onToggleCollapsed} aria-label={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}>{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}<span>{collapsed ? 'Expandir' : 'Contraer'}</span></button>
      <nav>
        {items.map((item) => {
          const Icon = icons[menuItems.findIndex((menuItem) => menuItem.to === item.to)] ?? LayoutDashboard;
          return (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined} aria-label={item.label} onClick={onNavigate}><Icon aria-hidden="true" size={18} /><span>{item.label}</span></NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
