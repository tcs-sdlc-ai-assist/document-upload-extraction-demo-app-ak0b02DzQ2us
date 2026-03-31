export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const SUPPORTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
};

export const SUPPORTED_FILE_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export const SUPPORTED_MIME_TYPES = Object.keys(SUPPORTED_FILE_TYPES);

export const ACCEPT_FILE_STRING = SUPPORTED_MIME_TYPES.join(',');

export const LOCAL_STORAGE_KEYS = {
  DOCUMENTS: 'doc-upload-extract-documents',
  EXTRACTED_TEXT: 'doc-upload-extract-extracted-text',
  UPLOAD_HISTORY: 'doc-upload-extract-upload-history',
};

export const ROUTES = {
  HOME: '/',
  UPLOAD: '/upload',
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: '/documents/:id',
  EXTRACT: '/extract/:id',
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
  UNSUPPORTED_FILE_TYPE: `Unsupported file type. Please upload one of the following: ${SUPPORTED_FILE_EXTENSIONS.join(', ')}.`,
  UPLOAD_FAILED: 'Failed to upload the document. Please try again.',
  EXTRACTION_FAILED: 'Failed to extract text from the document. Please try again.',
  FILE_READ_ERROR: 'An error occurred while reading the file. Please try again.',
  NO_FILE_SELECTED: 'No file selected. Please choose a file to upload.',
  DOCUMENT_NOT_FOUND: 'The requested document could not be found.',
  STORAGE_FULL: 'Local storage is full. Please remove some documents and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};

export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Document uploaded successfully.',
  EXTRACTION_SUCCESS: 'Text extracted successfully.',
  DOCUMENT_DELETED: 'Document deleted successfully.',
  COPIED_TO_CLIPBOARD: 'Text copied to clipboard.',
};

export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  EXTRACTING: 'extracting',
  EXTRACTED: 'extracted',
  ERROR: 'error',
};

export const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'text/plain': 'Text File',
};