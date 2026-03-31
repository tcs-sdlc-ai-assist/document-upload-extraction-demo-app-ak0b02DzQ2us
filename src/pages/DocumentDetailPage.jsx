import { Box } from '@mui/material';
import DocumentViewer from '../components/documents/DocumentViewer';

const DocumentDetailPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <DocumentViewer />
    </Box>
  );
};

export default DocumentDetailPage;