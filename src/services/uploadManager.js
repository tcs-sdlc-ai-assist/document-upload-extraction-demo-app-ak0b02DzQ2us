import {
  MAX_FILE_SIZE,
  SUPPORTED_MIME_TYPES,
  ERROR_MESSAGES,
  DOCUMENT_STATUS,
} from '../constants';
import Extractor from './extractor';
import StorageManager from './storageManager';

/**
 * UploadManager - Upload orchestration module
 * Validates files (type and size), manages upload progress state,
 * invokes extraction, and saves results via StorageManager.
 */

let currentProgress = {
  status: DOCUMENT_STATUS.PENDING,
  percent: 0,
  fileName: '',
  error: null,
};

let progressListeners = [];

/**
 * Notifies all registered progress listeners of the current progress state.
 */
const notifyListeners = () => {
  const snapshot = { ...currentProgress };
  progressListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      // Silently ignore listener errors
    }
  });
};

/**
 * Updates the internal progress state and notifies listeners.
 * @param {Object} updates - Partial progress state to merge.
 */
const updateProgress = (updates) => {
  currentProgress = { ...currentProgress, ...updates };
  notifyListeners();
};

/**
 * Resets progress state to initial values.
 */
const resetProgress = () => {
  currentProgress = {
    status: DOCUMENT_STATUS.PENDING,
    percent: 0,
    fileName: '',
    error: null,
  };
};

/**
 * Returns the current progress state.
 * @returns {Object} The current progress state.
 */
export const getProgress = () => {
  return { ...currentProgress };
};

/**
 * Registers a listener for progress updates.
 * @param {Function} listener - Callback invoked with progress state on each update.
 * @returns {Function} Unsubscribe function to remove the listener.
 */
export const onProgress = (listener) => {
  if (typeof listener !== 'function') {
    return () => {};
  }
  progressListeners.push(listener);
  return () => {
    progressListeners = progressListeners.filter((l) => l !== listener);
  };
};

/**
 * Validates the selected file for type and size constraints.
 * @param {File} file - The file to validate.
 * @throws {Error} If the file is invalid.
 */
const validateFile = (file) => {
  if (!file) {
    throw new Error(ERROR_MESSAGES.NO_FILE_SELECTED);
  }

  if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
    throw new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }
};

/**
 * Validates and returns the file if it passes all checks.
 * Useful as a pre-check before initiating the full upload flow.
 * @param {File} file - The file to select and validate.
 * @returns {File} The validated file.
 * @throws {Error} If the file is invalid.
 */
export const selectFile = (file) => {
  validateFile(file);
  resetProgress();
  updateProgress({
    status: DOCUMENT_STATUS.PENDING,
    percent: 0,
    fileName: file.name,
    error: null,
  });
  return file;
};

/**
 * Main workflow function: validates file, extracts text, cleans it,
 * and saves the result via StorageManager.
 * @param {File} file - The file to upload and extract text from.
 * @returns {Promise<Object>} The saved document object with extracted text and metadata.
 * @throws {Error} If validation, extraction, or storage fails.
 */
export const uploadAndExtract = async (file) => {
  resetProgress();

  try {
    // Step 1: Validate
    validateFile(file);
    updateProgress({
      status: DOCUMENT_STATUS.UPLOADING,
      percent: 10,
      fileName: file.name,
      error: null,
    });

    // Step 2: Simulate upload progress
    updateProgress({
      status: DOCUMENT_STATUS.UPLOADING,
      percent: 30,
      fileName: file.name,
    });

    // Step 3: Mark as uploaded, begin extraction
    updateProgress({
      status: DOCUMENT_STATUS.UPLOADED,
      percent: 40,
      fileName: file.name,
    });

    updateProgress({
      status: DOCUMENT_STATUS.EXTRACTING,
      percent: 50,
      fileName: file.name,
    });

    let extractedText = '';
    let extractionStatus = 'success';
    let errorMessage;

    try {
      extractedText = await Extractor.extract(file, file.type);
      updateProgress({
        status: DOCUMENT_STATUS.EXTRACTING,
        percent: 80,
        fileName: file.name,
      });
    } catch (extractionError) {
      extractionStatus = 'failed';
      errorMessage = extractionError.message || ERROR_MESSAGES.EXTRACTION_FAILED;
      updateProgress({
        status: DOCUMENT_STATUS.ERROR,
        percent: 80,
        fileName: file.name,
        error: errorMessage,
      });
    }

    // Step 4: Save to storage
    updateProgress({
      status: extractionStatus === 'success' ? DOCUMENT_STATUS.EXTRACTING : DOCUMENT_STATUS.ERROR,
      percent: 90,
      fileName: file.name,
    });

    const doc = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      extractedText,
      extractionStatus,
      errorMessage,
    };

    const savedDocument = StorageManager.saveDocument(doc);

    // Step 5: Complete
    const finalStatus = extractionStatus === 'success'
      ? DOCUMENT_STATUS.EXTRACTED
      : DOCUMENT_STATUS.ERROR;

    updateProgress({
      status: finalStatus,
      percent: 100,
      fileName: file.name,
      error: errorMessage || null,
    });

    return savedDocument;
  } catch (error) {
    updateProgress({
      status: DOCUMENT_STATUS.ERROR,
      percent: 0,
      fileName: file ? file.name : '',
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    });
    throw error;
  }
};

const UploadManager = {
  uploadAndExtract,
  selectFile,
  getProgress,
  onProgress,
};

export default UploadManager;