import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { NotificationToast } from './NotificationToast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type NotificationInput = {
  title: string;
  description?: string;
  type: NotificationType;
  durationMs?: number;
};

export type Notification = NotificationInput & { id: number };

type NotificationContextValue = {
  showNotification: (input: NotificationInput) => void;
  showSuccess: (input: Omit<NotificationInput, 'type'>) => void;
  showError: (input: Omit<NotificationInput, 'type'>) => void;
  showWarning: (input: Omit<NotificationInput, 'type'>) => void;
  showInfo: (input: Omit<NotificationInput, 'type'>) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const close = useCallback((id: number) => {
    setNotifications((items) => items.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback((input: NotificationInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const notification: Notification = { ...input, id };
    setNotifications((items) => [...items, notification]);
    window.setTimeout(() => close(id), input.durationMs ?? 5000);
  }, [close]);

  const value = useMemo<NotificationContextValue>(() => ({
    showNotification,
    showSuccess(input) { showNotification({ ...input, type: 'success' }); },
    showError(input) { showNotification({ ...input, type: 'error' }); },
    showWarning(input) { showNotification({ ...input, type: 'warning' }); },
    showInfo(input) { showNotification({ ...input, type: 'info' }); },
  }), [showNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-region" aria-live="polite" aria-label="Mensajes del sistema">
        {notifications.map((notification) => <NotificationToast key={notification.id} notification={notification} onClose={close} />)}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification debe usarse dentro de NotificationProvider');
  return context;
}
