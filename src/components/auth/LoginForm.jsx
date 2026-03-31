import { useState, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Link,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { validateUsername, validatePassword } from '../../services/authService';
import { ROUTES } from '../../constants';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });

  const { login } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const validateFields = useCallback(() => {
    const errors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Username is required.';
      isValid = false;
    } else if (!validateUsername(username)) {
      errors.username = 'Username must be 3-32 characters, alphanumeric or underscore.';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required.';
      isValid = false;
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be 6-64 characters.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  }, [username, password]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      await login(username.trim(), password);
      showSuccess('Logged in successfully.');
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [username, password, validateFields, login, showSuccess, navigate]);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    if (fieldErrors.username) {
      setFieldErrors((prev) => ({ ...prev, username: '' }));
    }
    if (error) {
      setError('');
    }
  }, [fieldErrors.username, error]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
    if (error) {
      setError('');
    }
  }, [fieldErrors.password, error]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        px: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 1, textAlign: 'center' }}
        >
          Log In
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Sign in to access your documents
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            role="alert"
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="login-username"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            error={!!fieldErrors.username}
            helperText={fieldErrors.username}
            disabled={loading}
            autoFocus
            inputProps={{
              'aria-label': 'Username',
              'aria-required': 'true',
              autoComplete: 'username',
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            disabled={loading}
            inputProps={{
              'aria-label': 'Password',
              'aria-required': 'true',
              autoComplete: 'current-password',
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mb: 2, py: 1.25 }}
            aria-label="Log in"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Log In'
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: 'center' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              component={RouterLink}
              to={ROUTES.UPLOAD ? '/signup' : '/signup'}
              underline="hover"
              aria-label="Sign up for an account"
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;