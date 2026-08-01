import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Toast = { id: number; message: string; tone: 'success' | 'error' | 'info' };
type ToastContextValue = { showToast: (message: string, tone?: Toast['tone']) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const value = useMemo(
    () => ({
      showToast(message: string, tone: Toast['tone'] = 'info') {
        const id = Date.now();
        setToasts((items) => [...items, { id, message, tone }]);
        window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3800);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-label="Mensajes del sistema">
        {toasts.map((toast) => <div className={`toast toast-${toast.tone}`} key={toast.id}>{toast.message}</div>)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
  return context;
}
