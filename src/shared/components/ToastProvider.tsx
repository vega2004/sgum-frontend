import type { ReactNode } from 'react';
import { NotificationProvider } from './NotificationProvider';
import { useNotification } from '../hooks/useNotification';

type ToastTone = 'success' | 'error' | 'info' | 'warning';

export function ToastProvider({ children }: { children: ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}

export function useToast() {
  const { showNotification } = useNotification();
  return {
    showToast(message: string, tone: ToastTone = 'info') {
      showNotification({ title: message, type: tone });
    },
  };
}
