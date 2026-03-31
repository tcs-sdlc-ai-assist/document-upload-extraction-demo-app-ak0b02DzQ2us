import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, severity = 'info', duration = 5000) => {
    setNotification({
      message,
      severity,
      duration,
      timestamp: Date.now(),
    });

    if (duration > 0) {
      setTimeout(() => {
        setNotification((current) => {
          if (current && current.timestamp === notification?.timestamp) {
            return null;
          }
          return current;
        });
      }, duration);
    }
  }, [notification?.timestamp]);

  const showSuccess = useCallback((message, duration = 5000) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration = 7000) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 5000) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 5000) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value = useMemo(
    () => ({
      notification,
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      clearNotification,
    }),
    [notification, showNotification, showSuccess, showError, showWarning, showInfo, clearNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;