import { useMemo } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { DOCUMENT_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';

const getStatusConfig = (status) => {
  switch (status) {
    case DOCUMENT_STATUS.PENDING:
      return {
        label: 'Ready to upload',
        color: 'inherit',
        icon: null,
      };
    case DOCUMENT_STATUS.UPLOADING:
      return {
        label: 'Uploading...',
        color: 'primary',
        icon: <CloudUploadIcon sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} aria-hidden="true" />,
      };
    case DOCUMENT_STATUS.UPLOADED:
      return {
        label: 'Uploaded. Preparing extraction...',
        color: 'primary',
        icon: <CloudUploadIcon sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} aria-hidden="true" />,
      };
    case DOCUMENT_STATUS.EXTRACTING:
      return {
        label: 'Extracting text...',
        color: 'info',
        icon: <FindInPageIcon sx={{ fontSize: 20, color: 'info.main', mr: 1 }} aria-hidden="true" />,
      };
    case DOCUMENT_STATUS.EXTRACTED:
      return {
        label: 'Extraction complete',
        color: 'success',
        icon: <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main', mr: 1 }} aria-hidden="true" />,
      };
    case DOCUMENT_STATUS.ERROR:
      return {
        label: 'An error occurred',
        color: 'error',
        icon: <ErrorIcon sx={{ fontSize: 20, color: 'error.main', mr: 1 }} aria-hidden="true" />,
      };
    default:
      return {
        label: '',
        color: 'inherit',
        icon: null,
      };
  }
};

const UploadProgress = ({ progress }) => {
  const {
    status = DOCUMENT_STATUS.PENDING,
    percent = 0,
    fileName = '',
    error = null,
  } = progress || {};

  const statusConfig = useMemo(() => getStatusConfig(status), [status]);

  const isComplete = status === DOCUMENT_STATUS.EXTRACTED;
  const hasError = status === DOCUMENT_STATUS.ERROR;
  const isActive = status === DOCUMENT_STATUS.UPLOADING ||
    status === DOCUMENT_STATUS.UPLOADED ||
    status === DOCUMENT_STATUS.EXTRACTING;

  if (status === DOCUMENT_STATUS.PENDING && percent === 0 && !fileName) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: hasError
            ? 'error.light'
            : isComplete
              ? 'success.light'
              : 'divider',
          backgroundColor: hasError
            ? 'rgba(198, 40, 40, 0.02)'
            : isComplete
              ? 'rgba(46, 125, 50, 0.02)'
              : 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          {statusConfig.icon}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {statusConfig.label}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, ml: 1, flexShrink: 0 }}
          >
            {Math.round(percent)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={percent}
          color={statusConfig.color}
          sx={{ mb: 1.5 }}
          aria-label={`Upload progress: ${Math.round(percent)}%`}
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {fileName && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {fileName}
          </Typography>
        )}

        {isComplete && (
          <Alert
            severity="success"
            sx={{ mt: 2 }}
            role="alert"
            icon={<CheckCircleIcon fontSize="inherit" />}
          >
            {SUCCESS_MESSAGES.EXTRACTION_SUCCESS}
          </Alert>
        )}

        {hasError && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            role="alert"
            icon={<ErrorIcon fontSize="inherit" />}
          >
            {error || ERROR_MESSAGES.GENERIC_ERROR}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default UploadProgress;