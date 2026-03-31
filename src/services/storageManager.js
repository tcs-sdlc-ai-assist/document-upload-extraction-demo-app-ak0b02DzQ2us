import { LOCAL_STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import { getSession } from './sessionService';

const STORAGE_KEY = LOCAL_STORAGE_KEYS.DOCUMENTS;

/**
 * Generates a UUID v4 string.
 * @returns {string} A UUID string.
 */
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Retrieves all documents from localStorage (raw, all users).
 * @returns {Array} Array of all stored document objects.
 */
const getAllDocuments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Writes the full documents array to localStorage.
 * @param {Array} documents - The documents array to persist.
 */
const saveAllDocuments = (documents) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch {
    throw new Error(ERROR_MESSAGES.STORAGE_FULL);
  }
};

/**
 * Returns the current session username, or null if not logged in.
 * @returns {string|null}
 */
const getCurrentUsername = () => {
  const session = getSession();
  return session ? session.username : null;
};

/**
 * Validates and normalizes a document object to enforce the required schema.
 * @param {Object} doc - The document object to validate.
 * @returns {Object} The validated document object.
 */
const validateDocumentSchema = (doc) => {
  if (!doc || typeof doc !== 'object') {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
  }

  if (!doc.fileName || typeof doc.fileName !== 'string') {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
  }

  if (!doc.fileType || typeof doc.fileType !== 'string') {
    throw new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE);
  }

  if (typeof doc.fileSize !== 'number' || doc.fileSize < 0) {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
  }

  const username = getCurrentUsername();

  return {
    id: doc.id || generateId(),
    fileName: doc.fileName,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    uploadedAt: doc.uploadedAt || new Date().toISOString(),
    extractedText: doc.extractedText || '',
    extractionStatus: doc.extractionStatus || 'success',
    errorMessage: doc.errorMessage || undefined,
    username: doc.username || username || 'anonymous',
  };
};

/**
 * Saves a document to localStorage.
 * Enforces document schema with fileName, fileType, fileSize, timestamp, and text fields.
 * @param {Object} doc - The document object to save.
 * @returns {Object} The saved document with generated id and timestamp.
 */
export const saveDocument = (doc) => {
  const validatedDoc = validateDocumentSchema(doc);
  const documents = getAllDocuments();
  documents.push(validatedDoc);
  saveAllDocuments(documents);
  return validatedDoc;
};

/**
 * Retrieves all documents for the current user from localStorage.
 * @returns {Array} Array of extracted document objects for the current user.
 */
export const getDocuments = () => {
  const username = getCurrentUsername();
  const documents = getAllDocuments();

  if (!username) {
    return [];
  }

  return documents.filter(
    (doc) => doc.username && doc.username.toLowerCase() === username.toLowerCase()
  );
};

/**
 * Retrieves a single document by ID for the current user.
 * @param {string} id - The document ID.
 * @returns {Object|null} The document object, or null if not found.
 */
export const getDocumentById = (id) => {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const username = getCurrentUsername();
  const documents = getAllDocuments();

  const doc = documents.find(
    (d) =>
      d.id === id &&
      d.username &&
      username &&
      d.username.toLowerCase() === username.toLowerCase()
  );

  return doc || null;
};

/**
 * Deletes a document by ID for the current user from localStorage.
 * @param {string} id - The document ID to delete.
 * @returns {boolean} True if the document was found and deleted, false otherwise.
 */
export const deleteDocument = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }

  const username = getCurrentUsername();
  const documents = getAllDocuments();

  const index = documents.findIndex(
    (d) =>
      d.id === id &&
      d.username &&
      username &&
      d.username.toLowerCase() === username.toLowerCase()
  );

  if (index === -1) {
    return false;
  }

  documents.splice(index, 1);
  saveAllDocuments(documents);
  return true;
};

const StorageManager = {
  saveDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};

export default StorageManager;