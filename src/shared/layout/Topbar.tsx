import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider';
import { roleLabels } from '../config/roles';

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="topbar">
      <button type="button" className="mobile-menu-button" onClick={onMenuClick} aria-label="Abrir menú de navegación"><Menu size={22} /></button>
      <div className="topbar-title">
        <span>SISTEMA DE GESTIÓN DE USUARIAS MUNICIPAL</span>
        <p>Uso restringido a personal autorizado.</p>
      </div>
      {user ? (
        <div className="user-menu" ref={menuRef}>
          <button type="button" className="user-menu-button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
            <span className="avatar" aria-hidden="true">{initials(user.name)}</span>
            <span className="user-menu-summary"><strong>{user.name}</strong><small>{roleLabels[user.role]}</small></span>
          </button>
          {open ? (
            <div className="user-menu-panel" role="menu">
              <strong>{user.name}</strong>
              <span>{roleLabels[user.role]}</span>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); logout(); }}>Cerrar sesión</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
