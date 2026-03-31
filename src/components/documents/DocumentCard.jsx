import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FILE_TYPE_LABELS, ROUTES } from '../../constants';

const TEXT_PREVIEW_LENGTH = 150;

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

const getTextPreview = (text) => {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (trimmed.length <= TEXT_PREVIEW_LENGTH) return trimmed;
  return `${trimmed.substring(0, TEXT_PREVIEW_LENGTH).trim()}…`;
};

const DocumentCard = ({ document, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    fileName = 'Untitled',
    fileType = '',
    fileSize = 0,
    uploadedAt = '',
    extractedText = '',
    extractionStatus = 'success',
    errorMessage,
  } = document || {};

  const isSuccess = extractionStatus === 'success';
  const isFailed = extractionStatus === 'failed';
  const typeLabel = FILE_TYPE_LABELS[fileType] || 'Unknown';
  const preview = getTextPreview(extractedText);

  const handleViewClick = useCallback(() => {
    if (id) {
      const path = ROUTES.DOCUMENT_DETAIL.replace(':id', id);
      navigate(path);
    }
  }, [id, navigate]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    setDeleteDialogOpen(false);
    if (onDelete && id) {
      onDelete(id);
    }
  }, [onDelete, id]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  if (!document || !id) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'box-shadow 0.2s ease-in-out',
        }}
      >
        <CardContent sx={{ flex: 1, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <InsertDriveFileIcon
              sx={{ color: 'primary.main', fontSize: 32, flexShrink: 0, mt: 0.25 }}
              aria-hidden="true"
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                component="h3"
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={typeLabel}
                  size="small"
                  variant="outlined"
                  color="primary"
                  aria-label={`File type: ${typeLabel}`}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(fileSize)}
                </Typography>
                {isSuccess && (
                  <Tooltip title="Extraction successful">
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 16, color: 'success.main' }}
                      aria-label="Extraction successful"
                    />
                  </Tooltip>
                )}
                {isFailed && (
                  <Tooltip title={errorMessage || 'Extraction failed'}>
                    <ErrorOutlineIcon
                      sx={{ fontSize: 16, color: 'error.main' }}
                      aria-label="Extraction failed"
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          {uploadedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 1.5 }}
            >
              Uploaded: {formatDate(uploadedAt)}
            </Typography>
          )}

          {isSuccess && preview ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
              }}
            >
              {preview}
            </Typography>
          ) : isFailed ? (
            <Typography
              variant="body2"
              color="error.main"
              sx={{ fontStyle: 'italic' }}
            >
              {errorMessage || 'Text extraction failed.'}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              No extracted text available.
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end', gap: 0.5 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={handleViewClick}
            aria-label={`View details for ${fileName}`}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            View
          </Button>
          <Tooltip title="Delete document">
            <IconButton
              size="small"
              color="error"
              onClick={handleDeleteClick}
              aria-label={`Delete ${fileName}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Document
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &quot;{fileName}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            aria-label="Confirm deletion"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentCard;