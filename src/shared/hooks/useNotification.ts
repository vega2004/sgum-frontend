import { useNotificationContext } from '../components/NotificationProvider';

export function useNotification() {
  return useNotificationContext();
}
