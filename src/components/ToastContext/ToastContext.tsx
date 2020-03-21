import { createContext, useContext, ReactNode } from 'react';


export interface ToastProps {
  duration: number;
  component: ReactNode;
  dismissible?: boolean;
}


export interface ToastContextProps {
  queue: ToastProps[];
  push: (toast: ToastProps) => void;
  destroy: () => void; // Destroys the first element in the queue
  position: 'top' | 'bottom'; // default bottom
  timeoutId: any;
}


export const ToastContext = createContext<ToastContextProps>(null);

export const useToast = () => useContext(ToastContext);
