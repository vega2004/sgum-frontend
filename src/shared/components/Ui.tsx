import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export function Button({ className = '', children, disabled, variant = 'primary', loading = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  return <button className={`button button-${variant} ${className}`} disabled={disabled || loading} aria-busy={loading} {...props}>{loading ? 'Procesando...' : children}</button>;
}

export function LoadingState({ message = 'Cargando información...' }: { message?: string }) {
  return <div className="state" aria-live="polite">{message}</div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state-error" role="alert">
      <p>{message}</p>
      {onRetry ? <Button type="button" onClick={onRetry}>Reintentar</Button> : null}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="state">{message}</div>;
}

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

export function Alert({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warning' | 'error' | 'success' }) {
  return <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function PageHeader({ title, description, action, breadcrumbs }: { title: string; description: string; action?: ReactNode; breadcrumbs?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="page-title-group">
        {breadcrumbs ? <div className="breadcrumbs">{breadcrumbs}</div> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="page-header-action">{action}</div> : null}
    </header>
  );
}

export function StatCard({ icon, label, value, description, action }: { icon: ReactNode; label: string; value: string; description: string; action?: ReactNode }) {
  return <article className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><p>{description}</p></div>{action ? <div className="stat-action">{action}</div> : null}</article>;
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: Array<{ value: T; label: string; count?: number }>; value: T; onChange: (value: T) => void }) {
  return <div className="tabs" role="tablist">{tabs.map((tab) => <button key={tab.value} type="button" role="tab" aria-selected={value === tab.value} className={value === tab.value ? 'active' : ''} onClick={() => onChange(tab.value)}>{tab.label}{typeof tab.count === 'number' ? <span>{tab.count}</span> : null}</button>)}</div>;
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  getKey,
}: {
  caption: string;
  columns: Array<{ header: string; render: (row: T) => ReactNode }>;
  rows: T[];
  getKey: (row: T) => string;
}) {
  return (
    <div className="table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>{columns.map((column) => <th key={column.header} scope="col">{column.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)}>{columns.map((column) => <td key={column.header} data-label={column.header}>{column.render(row)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <Button type="button" className="button-ghost" onClick={onClose}>Cerrar</Button>
        </div>
        {children}
      </div>
    </div>
  );
}
