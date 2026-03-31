import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  SUPPORTED_FILE_EXTENSIONS,
  ACCEPT_FILE_STRING,
  MAX_FILE_SIZE,
  FILE_TYPE_LABELS,
  ERROR_MESSAGES,
} from '../../constants';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DropZone = ({ onFileSelect, disabled = false, error: externalError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const displayError = externalError || validationError;

  const validateFile = useCallback((file) => {
    if (!file) {
      return ERROR_MESSAGES.NO_FILE_SELECTED;
    }

    const supportedMimeTypes = Object.keys(FILE_TYPE_LABELS);
    if (!supportedMimeTypes.includes(file.type) && !file.type) {
      return ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE;
    }

    if (!supportedMimeTypes.includes(file.type)) {
      return ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE;
    }

    if (file.size > MAX_FILE_SIZE) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }

    return null;
  }, []);

  const handleFile = useCallback((file) => {
    setValidationError('');

    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    if (onFileSelect) {
      try {
        onFileSelect(file);
      } catch (err) {
        setValidationError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
        setSelectedFile(null);
      }
    }
  }, [validateFile, onFileSelect]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounterRef.current = 0;

    if (disabled) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, handleFile]);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFile]);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleBrowseClick();
    }
  }, [disabled, handleBrowseClick]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={isDragOver ? 3 : 1}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Drop zone for file upload. Click or press Enter to browse files."
        aria-disabled={disabled}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          cursor: disabled ? 'default' : 'pointer',
          border: '2px dashed',
          borderColor: isDragOver
            ? 'primary.main'
            : displayError
              ? 'error.main'
              : 'divider',
          backgroundColor: isDragOver
            ? 'rgba(21, 101, 192, 0.04)'
            : disabled
              ? 'action.disabledBackground'
              : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          opacity: disabled ? 0.6 : 1,
          '&:hover': disabled
            ? {}
            : {
                borderColor: 'primary.light',
                backgroundColor: 'rgba(21, 101, 192, 0.02)',
              },
          '&:focus-visible': {
            outline: '2px solid #0D47A1',
            outlineOffset: 2,
          },
        }}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 48,
            color: isDragOver ? 'primary.main' : 'text.secondary',
            mb: 2,
            transition: 'color 0.2s ease-in-out',
          }}
          aria-hidden="true"
        />

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 1,
            textAlign: 'center',
            color: isDragOver ? 'primary.main' : 'text.primary',
          }}
        >
          {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: 'center' }}
        >
          or click to browse
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
          aria-label="Browse files to upload"
          sx={{ mb: 2 }}
        >
          Browse Files
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Supported formats: {SUPPORTED_FILE_EXTENSIONS.join(', ')} — Max size: {formatFileSize(MAX_FILE_SIZE)}
        </Typography>
      </Paper>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_FILE_STRING}
        onChange={handleFileInputChange}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />

      {displayError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          role="alert"
        >
          {displayError}
        </Alert>
      )}

      {selectedFile && !displayError && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'rgba(46, 125, 50, 0.04)',
          }}
        >
          <InsertDriveFileIcon
            sx={{ color: 'primary.main', fontSize: 32 }}
            aria-hidden="true"
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {FILE_TYPE_LABELS[selectedFile.type] || 'Unknown'} — {formatFileSize(selectedFile.size)}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DropZone;