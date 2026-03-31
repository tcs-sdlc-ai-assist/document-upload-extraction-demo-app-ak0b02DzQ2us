import { useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '../components/documents/DocumentCard';
import useDocuments from '../hooks/useDocuments';
import { useNotification } from '../contexts/NotificationContext';
import { ROUTES, SUCCESS_MESSAGES } from '../constants';

const HistoryPage = () => {
  const { documents, loading, error, remove, refresh } = useDocuments();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleDelete = useCallback((id) => {
    const result = remove(id);
    if (result) {
      showSuccess(SUCCESS_MESSAGES.DOCUMENT_DELETED);
    } else {
      showError('Failed to delete document. Please try again.');
    }
  }, [remove, showSuccess, showError]);

  const handleNavigateUpload = useCallback(() => {
    navigate(ROUTES.UPLOAD);
  }, [navigate]);

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
        <CircularProgress aria-label="Loading documents" />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 1, fontWeight: 700 }}
      >
        Documents
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Browse all your uploaded documents and view extracted text content.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          role="alert"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={refresh}
              aria-label="Retry loading documents"
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {documents.length === 0 && !error ? (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: 'center',
          }}
        >
          <DescriptionIcon
            sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
            aria-hidden="true"
          />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            No documents uploaded yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleNavigateUpload}
            aria-label="Upload your first document"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Upload Your First Document
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {documents
            .sort((a, b) => {
              const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
              const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
              return dateB - dateA;
            })
            .map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <DocumentCard
                  document={doc}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default HistoryPage;