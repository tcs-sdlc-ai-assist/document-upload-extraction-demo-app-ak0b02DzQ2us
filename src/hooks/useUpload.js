import { useState, useCallback, useEffect, useRef } from 'react';
import UploadManager, { uploadAndExtract, selectFile, getProgress, onProgress } from '../services/uploadManager';
import { DOCUMENT_STATUS, ERROR_MESSAGES } from '../constants';

const useUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({
    status: DOCUMENT_STATUS.PENDING,
    percent: 0,
    fileName: '',
    error: null,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    unsubscribeRef.current = onProgress((progressUpdate) => {
      setProgress(progressUpdate);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  const handleSelectFile = useCallback((selectedFile) => {
    setError(null);
    setResult(null);
    setProgress({
      status: DOCUMENT_STATUS.PENDING,
      percent: 0,
      fileName: '',
      error: null,
    });

    try {
      const validatedFile = selectFile(selectedFile);
      setFile(validatedFile);
      return validatedFile;
    } catch (err) {
      setFile(null);
      setError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
      throw err;
    }
  }, []);

  const handleUpload = useCallback(async (fileToUpload) => {
    const targetFile = fileToUpload || file;

    if (!targetFile) {
      const errMsg = ERROR_MESSAGES.NO_FILE_SELECTED;
      setError(errMsg);
      throw new Error(errMsg);
    }

    setError(null);
    setResult(null);
    setIsUploading(true);

    try {
      const savedDocument = await uploadAndExtract(targetFile);
      setResult(savedDocument);
      setIsUploading(false);

      if (savedDocument.extractionStatus === 'failed') {
        setError(savedDocument.errorMessage || ERROR_MESSAGES.EXTRACTION_FAILED);
      }

      return savedDocument;
    } catch (err) {
      const errMsg = err.message || ERROR_MESSAGES.GENERIC_ERROR;
      setError(errMsg);
      setIsUploading(false);
      throw err;
    }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsUploading(false);
    setProgress({
      status: DOCUMENT_STATUS.PENDING,
      percent: 0,
      fileName: '',
      error: null,
    });
  }, []);

  const isComplete = progress.status === DOCUMENT_STATUS.EXTRACTED ||
    (progress.status === DOCUMENT_STATUS.ERROR && progress.percent === 100);

  const isExtracting = progress.status === DOCUMENT_STATUS.EXTRACTING;

  const hasError = !!error || progress.status === DOCUMENT_STATUS.ERROR;

  return {
    file,
    progress,
    result,
    error,
    isUploading,
    isComplete,
    isExtracting,
    hasError,
    selectFile: handleSelectFile,
    upload: handleUpload,
    reset,
  };
};

export default useUpload;