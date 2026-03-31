import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  Tooltip,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNotification } from '../../contexts/NotificationContext';
import useDocuments from '../../hooks/useDocuments';
import {
  FILE_TYPE_LABELS,
  ROUTES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../../constants';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const DocumentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = useDocuments();
  const { showSuccess, showError } = useNotification();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const doc = getById(id);
      if (doc) {
        setDocument(doc);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, getById]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.DOCUMENTS);
  }, [navigate]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!document || !document.extractedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      showSuccess(SUCCESS_MESSAGES.COPIED_TO_CLIPBOARD);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      showError('Failed to copy text to clipboard.');
    }
  }, [document, showSuccess, showError]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress aria-label="Loading document" />
      </Box>
    );
  }

  if (notFound || !document) {
    return (
      <Box sx={{ px: 2, py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3, textTransform: 'none', fontWeight: 500 }}
          aria-label="Back to documents"
        >
          Back to Documents
        </Button>
        <Alert severity="error" role="alert">
          {ERROR_MESSAGES.DOCUMENT_NOT_FOUND}
        </Alert>
      </Box>
    );
  }

  const {
    fileName = 'Untitled',
    fileType = '',
    fileSize = 0,
    uploadedAt = '',
    extractedText = '',
    extractionStatus = 'success',
    errorMessage,
  } = document;

  const isSuccess = extractionStatus === 'success';
  const isFailed = extractionStatus === 'failed';
  const typeLabel = FILE_TYPE_LABELS[fileType] || 'Unknown';

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 900, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 500 }}
        aria-label="Back to documents"
      >
        Back to Documents
      </Button>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Document Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 3,
          }}
        >
          <InsertDriveFileIcon
            sx={{ color: 'primary.main', fontSize: 40, flexShrink: 0, mt: 0.25 }}
            aria-hidden="true"
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={fileName}
            >
              {fileName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 1,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                label={typeLabel}
                size="small"
                variant="outlined"
                color="primary"
                aria-label={`File type: ${typeLabel}`}
              />
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(fileSize)}
              </Typography>
              {isSuccess && (
                <Tooltip title="Extraction successful">
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 18, color: 'success.main' }}
                    aria-label="Extraction successful"
                  />
                </Tooltip>
              )}
              {isFailed && (
                <Tooltip title={errorMessage || 'Extraction failed'}>
                  <ErrorOutlineIcon
                    sx={{ fontSize: 18, color: 'error.main' }}
                    aria-label="Extraction failed"
                  />
                </Tooltip>
              )}
            </Box>
            {uploadedAt && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                Uploaded: {formatDate(uploadedAt)}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Extracted Text Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Extracted Text
          </Typography>
          {isSuccess && extractedText && (
            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
              <IconButton
                onClick={handleCopyToClipboard}
                color={copied ? 'success' : 'primary'}
                aria-label="Copy extracted text to clipboard"
                size="small"
              >
                {copied ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {isSuccess && extractedText ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'rgba(21, 101, 192, 0.02)',
              border: '1px solid',
              borderColor: 'divider',
              maxHeight: 500,
              overflow: 'auto',
            }}
            className="custom-scrollbar"
          >
            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                lineHeight: 1.6,
                m: 0,
              }}
            >
              {extractedText}
            </Typography>
          </Paper>
        ) : isFailed ? (
          <Alert severity="error" role="alert">
            {errorMessage || 'Text extraction failed.'}
          </Alert>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            No extracted text available.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentViewer;