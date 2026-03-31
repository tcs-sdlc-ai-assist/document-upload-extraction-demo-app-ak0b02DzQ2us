import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Divider,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DropZone from '../components/upload/DropZone';
import UploadProgress from '../components/upload/UploadProgress';
import useUpload from '../hooks/useUpload';
import { useNotification } from '../contexts/NotificationContext';
import {
  ROUTES,
  FILE_TYPE_LABELS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../constants';

const TEXT_PREVIEW_MAX_HEIGHT = 400;

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

const UploadPage = () => {
  const {
    file,
    progress,
    result,
    error,
    isUploading,
    isComplete,
    isExtracting,
    hasError,
    selectFile: handleSelectFile,
    upload,
    reset,
  } = useUpload();

  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [fileSelectError, setFileSelectError] = useState('');

  const handleFileSelect = useCallback((selectedFile) => {
    setFileSelectError('');
    try {
      handleSelectFile(selectedFile);
    } catch (err) {
      setFileSelectError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
  }, [handleSelectFile]);

  const handleUploadClick = useCallback(async () => {
    try {
      const savedDocument = await upload();
      if (savedDocument && savedDocument.extractionStatus === 'success') {
        showSuccess(SUCCESS_MESSAGES.UPLOAD_SUCCESS);
      }
    } catch (err) {
      showError(err.message || ERROR_MESSAGES.UPLOAD_FAILED);
    }
  }, [upload, showSuccess, showError]);

  const handleReset = useCallback(() => {
    reset();
    setFileSelectError('');
    setCopied(false);
  }, [reset]);

  const handleViewDocument = useCallback(() => {
    if (result && result.id) {
      const path = ROUTES.DOCUMENT_DETAIL.replace(':id', result.id);
      navigate(path);
    }
  }, [result, navigate]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!result || !result.extractedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.extractedText);
      setCopied(true);
      showSuccess(SUCCESS_MESSAGES.COPIED_TO_CLIPBOARD);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      showError('Failed to copy text to clipboard.');
    }
  }, [result, showSuccess, showError]);

  const showDropZone = !isUploading && !isExtracting && !isComplete;
  const showUploadButton = file && !isUploading && !isExtracting && !isComplete && !hasError;
  const showProgress = isUploading || isExtracting || isComplete || (hasError && progress.percent > 0);
  const showResult = isComplete && result;

  const isSuccess = result && result.extractionStatus === 'success';
  const isFailed = result && result.extractionStatus === 'failed';

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 1, fontWeight: 700 }}
      >
        Upload Document
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Upload a PDF, DOCX, or TXT file to automatically extract text content.
      </Typography>

      {/* Drop Zone */}
      {showDropZone && (
        <DropZone
          onFileSelect={handleFileSelect}
          disabled={isUploading || isExtracting}
          error={fileSelectError}
        />
      )}

      {/* Upload Button */}
      {showUploadButton && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            aria-label="Upload and extract text"
            sx={{ textTransform: 'none', fontWeight: 600, px: 4, py: 1.25 }}
          >
            Upload & Extract
          </Button>
        </Box>
      )}

      {/* Upload Progress */}
      {showProgress && (
        <UploadProgress progress={progress} />
      )}

      {/* Error Display */}
      {hasError && error && !showProgress && (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          role="alert"
        >
          {error}
        </Alert>
      )}

      {/* Extraction Result */}
      {showResult && (
        <Paper elevation={2} sx={{ mt: 4, p: { xs: 2, sm: 4 } }}>
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
              sx={{ color: 'primary.main', fontSize: 36, flexShrink: 0, mt: 0.25 }}
              aria-hidden="true"
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={result.fileName}
              >
                {result.fileName}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  label={FILE_TYPE_LABELS[result.fileType] || 'Unknown'}
                  size="small"
                  variant="outlined"
                  color="primary"
                  aria-label={`File type: ${FILE_TYPE_LABELS[result.fileType] || 'Unknown'}`}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(result.fileSize)}
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
                  <Tooltip title={result.errorMessage || 'Extraction failed'}>
                    <ErrorOutlineIcon
                      sx={{ fontSize: 18, color: 'error.main' }}
                      aria-label="Extraction failed"
                    />
                  </Tooltip>
                )}
              </Box>
              {result.uploadedAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  Uploaded: {formatDate(result.uploadedAt)}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Extracted Text */}
          {isSuccess && result.extractedText ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Extracted Text
                </Typography>
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
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(21, 101, 192, 0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: TEXT_PREVIEW_MAX_HEIGHT,
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
                  {result.extractedText}
                </Typography>
              </Paper>
            </>
          ) : isFailed ? (
            <Alert severity="error" role="alert">
              {result.errorMessage || 'Text extraction failed.'}
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

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<VisibilityIcon />}
              onClick={handleViewDocument}
              aria-label={`View details for ${result.fileName}`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              aria-label="Upload another document"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Upload Another
            </Button>
          </Box>
        </Paper>
      )}

      {/* Reset Button (when error or in progress) */}
      {(hasError || (isComplete && !result)) && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            aria-label="Start over"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Start Over
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UploadPage;