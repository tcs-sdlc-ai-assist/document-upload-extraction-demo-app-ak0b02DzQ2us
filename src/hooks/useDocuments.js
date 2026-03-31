import { useState, useCallback, useEffect } from 'react';
import { getDocuments, getDocumentById, deleteDocument } from '../services/storageManager';

const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const docs = getDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err.message || 'Failed to load documents.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const getById = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      return null;
    }
    try {
      return getDocumentById(id);
    } catch {
      return null;
    }
  }, []);

  const remove = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      return false;
    }
    try {
      const result = deleteDocument(id);
      if (result) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      }
      return result;
    } catch (err) {
      setError(err.message || 'Failed to delete document.');
      return false;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    getById,
    remove,
    refresh,
  };
};

export default useDocuments;