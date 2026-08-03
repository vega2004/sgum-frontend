import type { Notification } from './NotificationProvider';

export function NotificationToast({ notification, onClose }: { notification: Notification; onClose: (id: number) => void }) {
  return (
    <div className={`notification-toast notification-${notification.type}`} role={notification.type === 'error' ? 'alert' : 'status'}>
      <div>
        <strong>{notification.title}</strong>
        {notification.description ? <p>{notification.description}</p> : null}
      </div>
      <button type="button" aria-label="Cerrar mensaje" onClick={() => onClose(notification.id)}>×</button>
    </div>
  );
}
