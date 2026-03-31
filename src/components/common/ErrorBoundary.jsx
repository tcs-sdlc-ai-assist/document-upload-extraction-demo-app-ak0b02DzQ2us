import { Component } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ERROR_MESSAGES } from '../../constants';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Console logging for errors (demo only)
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      if (fallback) {
        return fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            px: 2,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 520,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 56,
                color: 'error.main',
                mb: 2,
              }}
              aria-hidden="true"
            />

            <Typography
              variant="h5"
              component="h1"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Something went wrong
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {ERROR_MESSAGES.GENERIC_ERROR}
            </Typography>

            {this.state.error && (
              <Alert
                severity="error"
                sx={{ mb: 3, textAlign: 'left' }}
                role="alert"
              >
                {this.state.error.message || ERROR_MESSAGES.GENERIC_ERROR}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
              aria-label="Try again"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;