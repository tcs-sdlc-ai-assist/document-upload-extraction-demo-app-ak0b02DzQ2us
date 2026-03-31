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

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '', confirmPassword: '' });

  const { signup } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const validateFields = useCallback(() => {
    const errors = { username: '', password: '', confirmPassword: '' };
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

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  }, [username, password, confirmPassword]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      await signup(username.trim(), password);
      showSuccess('Account created successfully.');
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [username, password, validateFields, signup, showSuccess, navigate]);

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

  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value);
    if (fieldErrors.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
    if (error) {
      setError('');
    }
  }, [fieldErrors.confirmPassword, error]);

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
          Sign Up
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Create an account to get started
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
            id="signup-username"
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
            id="signup-password"
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
              autoComplete: 'new-password',
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            id="signup-confirm-password"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
            disabled={loading}
            inputProps={{
              'aria-label': 'Confirm Password',
              'aria-required': 'true',
              autoComplete: 'new-password',
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
            aria-label="Sign up"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: 'center' }}
          >
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to={ROUTES.HOME ? '/login' : '/login'}
              underline="hover"
              aria-label="Log in to your account"
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupForm;