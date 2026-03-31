import { useCallback } from 'react';
import {
  Snackbar,
  Alert,
} from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationSnackbar = () => {
  const { notification, clearNotification } = useNotification();

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    clearNotification();
  }, [clearNotification]);

  if (!notification) {
    return null;
  }

  const {
    message = '',
    severity = 'info',
    duration = 5000,
  } = notification;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={duration > 0 ? duration : null}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      aria-live="polite"
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', fontWeight: 500 }}
        role="alert"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;