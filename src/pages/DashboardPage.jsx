import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../contexts/AuthContext';
import useDocuments from '../hooks/useDocuments';
import { ROUTES, FILE_TYPE_LABELS } from '../constants';

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

const RECENT_UPLOADS_COUNT = 5;

const DashboardPage = () => {
  const { user } = useAuth();
  const { documents, loading } = useDocuments();
  const navigate = useNavigate();

  const totalDocuments = documents.length;
  const successfulExtractions = documents.filter(
    (doc) => doc.extractionStatus === 'success'
  ).length;
  const failedExtractions = documents.filter(
    (doc) => doc.extractionStatus === 'failed'
  ).length;
  const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

  const recentUploads = [...documents]
    .sort((a, b) => {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, RECENT_UPLOADS_COUNT);

  const handleNavigateUpload = useCallback(() => {
    navigate(ROUTES.UPLOAD);
  }, [navigate]);

  const handleNavigateDocuments = useCallback(() => {
    navigate(ROUTES.DOCUMENTS);
  }, [navigate]);

  const handleViewDocument = useCallback(
    (id) => {
      if (id) {
        const path = ROUTES.DOCUMENT_DETAIL.replace(':id', id);
        navigate(path);
      }
    },
    [navigate]
  );

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 1, fontWeight: 700 }}
      >
        Welcome{user ? `, ${user.username}` : ''}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Here&apos;s an overview of your documents and quick actions.
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              textAlign: 'center',
            }}
          >
            <DescriptionIcon
              sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
              aria-hidden="true"
            />
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 700 }}
            >
              {totalDocuments}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Documents
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              textAlign: 'center',
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 32, color: 'success.main', mb: 1 }}
              aria-hidden="true"
            />
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 700 }}
            >
              {successfulExtractions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Successful
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 32, color: 'error.main', mb: 1 }}
              aria-hidden="true"
            />
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 700 }}
            >
              {failedExtractions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Failed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              textAlign: 'center',
            }}
          >
            <TrendingUpIcon
              sx={{ fontSize: 32, color: 'info.main', mb: 1 }}
              aria-hidden="true"
            />
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 700 }}
            >
              {formatFileSize(totalSize)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Size
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <CloudUploadIcon
                sx={{ fontSize: 40, color: 'primary.main', mb: 1.5 }}
                aria-hidden="true"
              />
              <Typography
                variant="body1"
                component="h3"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Upload Document
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload a PDF, DOCX, or TXT file to extract text content automatically.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={handleNavigateUpload}
                aria-label="Go to upload page"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Upload
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <DescriptionIcon
                sx={{ fontSize: 40, color: 'primary.main', mb: 1.5 }}
                aria-hidden="true"
              />
              <Typography
                variant="body1"
                component="h3"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                View Documents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse all your uploaded documents and view extracted text content.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DescriptionIcon />}
                onClick={handleNavigateDocuments}
                aria-label="Go to documents page"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Uploads */}
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        Recent Uploads
      </Typography>
      {recentUploads.length === 0 ? (
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
        <Paper elevation={1} sx={{ overflow: 'hidden' }}>
          {recentUploads.map((doc, index) => {
            const typeLabel = FILE_TYPE_LABELS[doc.fileType] || 'Unknown';
            const isSuccess = doc.extractionStatus === 'success';
            const isFailed = doc.extractionStatus === 'failed';

            return (
              <Box
                key={doc.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2.5,
                  py: 2,
                  borderBottom:
                    index < recentUploads.length - 1
                      ? '1px solid'
                      : 'none',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(21, 101, 192, 0.04)',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #0D47A1',
                    outlineOffset: -2,
                  },
                }}
                onClick={() => handleViewDocument(doc.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleViewDocument(doc.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${doc.fileName}`}
              >
                <InsertDriveFileIcon
                  sx={{ color: 'primary.main', fontSize: 28, flexShrink: 0 }}
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
                    title={doc.fileName}
                  >
                    {doc.fileName}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 0.25,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Chip
                      label={typeLabel}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                      aria-label={`File type: ${typeLabel}`}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(doc.fileSize)}
                    </Typography>
                    {doc.uploadedAt && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(doc.uploadedAt)}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  {isSuccess && (
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 20, color: 'success.main' }}
                      aria-label="Extraction successful"
                    />
                  )}
                  {isFailed && (
                    <ErrorOutlineIcon
                      sx={{ fontSize: 20, color: 'error.main' }}
                      aria-label="Extraction failed"
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

export default DashboardPage;