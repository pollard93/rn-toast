import React, { useEffect, useState, useReducer, FC } from 'react';
import SafeArea, { SafeAreaInsets } from 'react-native-safe-area';
import { Toast } from '../Toast/Toast';
import { ToastProps, ToastContext } from '../ToastContext/ToastContext';


export interface ToastReducerAction {
  type: 'addToQueue' | 'removeFromQueue';
  toast?: ToastProps;
}


/**
 * Reduces the queue
 * Must be declared out of the scope of the provider so it is not recreated every render
 */
const toastReducer = (queue: ToastProps[], action: ToastReducerAction) => {
  switch (action.type) {
    case 'addToQueue':
      return queue.concat(action.toast);

    case 'removeFromQueue':
      const newQueue = [...queue];
      newQueue.splice(0, 1);
      return newQueue;

    default:
      return queue;
  }
};


export interface ToastProviderProps {
  position: 'top' | 'bottom'; // default bottom
}


/**
 * Provides ToastContext with initial values
 * Renders Toast component as child
 */
const ToastProvider: FC<ToastProviderProps> = (props) => {
  const [queue, dispatch] = useReducer(toastReducer, []);
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>(null);


  /**
   * Get safe area insets
   */
  useEffect(() => {
    SafeArea.getSafeAreaInsetsForRootView()
      .then((res) => setSafeAreaInsets(res.safeAreaInsets))
      .catch(() => setSafeAreaInsets({ top: 0, left: 0, bottom: 0, right: 0 }));
  }, []);


  /**
   * Only proceed when safearea view has been set
   */
  if (!safeAreaInsets) return null;


  return (
    <ToastContext.Provider
      value={{
        queue,
        push: (toast: ToastProps) => {
          dispatch({
            type: 'addToQueue',
            toast,
          });
        },
        destroy: () => {
          dispatch({
            type: 'removeFromQueue',
          });
        },
        position: props.position || 'bottom',
        timeoutId: null,
        safeAreaInsets,
      }}
    >
      {props.children}
      <Toast />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
