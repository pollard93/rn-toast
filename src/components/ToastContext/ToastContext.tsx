import { createContext, useContext } from 'react';


export interface ToastProps {
  duration: number;
  component: JSX.Element;
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
