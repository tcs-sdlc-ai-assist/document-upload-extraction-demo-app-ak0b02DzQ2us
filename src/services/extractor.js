import { SUPPORTED_MIME_TYPES, ERROR_MESSAGES } from '../constants';
import TextCleaner from './textCleaner';

/**
 * Extractor - Text extraction engine
 * Supports PDF (via pdfjs-dist), DOCX (via mammoth.js), and TXT files.
 * Delegates to appropriate parser based on file type, applies text cleaning,
 * and implements one automatic retry on extraction failure.
 */

/**
 * Reads a File object as an ArrayBuffer.
 * @param {File} file - The file to read.
 * @returns {Promise<ArrayBuffer>} The file contents as an ArrayBuffer.
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Reads a File object as text.
 * @param {File} file - The file to read.
 * @returns {Promise<string>} The file contents as a string.
 */
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
    reader.readAsText(file);
  });
};

/**
 * Extracts text from a PDF file using pdfjs-dist.
 * @param {File} file - The PDF file.
 * @returns {Promise<string>} The extracted text.
 */
const extractFromPdf = async (file) => {
  const pdfjsLib = await import('pdfjs-dist');

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const textParts = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str)
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n');
};

/**
 * Extracts text from a DOCX file using mammoth.js.
 * @param {File} file - The DOCX file.
 * @returns {Promise<string>} The extracted text.
 */
const extractFromDocx = async (file) => {
  const mammoth = await import('mammoth');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Extracts text from a TXT file using FileReader.
 * @param {File} file - The TXT file.
 * @returns {Promise<string>} The extracted text.
 */
const extractFromTxt = async (file) => {
  const text = await readFileAsText(file);
  return text;
};

/**
 * Returns the appropriate extraction function based on MIME type.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Function} The extraction function.
 */
const getExtractorForType = (mimeType) => {
  switch (mimeType) {
    case 'application/pdf':
      return extractFromPdf;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractFromDocx;
    case 'text/plain':
      return extractFromTxt;
    default:
      return null;
  }
};

/**
 * Extracts text from a file based on its MIME type.
 * Applies text cleaning to the extracted content.
 * Implements one automatic retry on extraction failure.
 * @param {File} file - The file to extract text from.
 * @param {string} fileType - The MIME type of the file.
 * @returns {Promise<string>} The cleaned extracted text.
 * @throws {Error} If extraction fails after retry.
 */
export const extract = async (file, fileType) => {
  if (!file) {
    throw new Error(ERROR_MESSAGES.NO_FILE_SELECTED);
  }

  if (!fileType || !SUPPORTED_MIME_TYPES.includes(fileType)) {
    throw new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE);
  }

  const extractorFn = getExtractorForType(fileType);

  if (!extractorFn) {
    throw new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE);
  }

  let rawText;

  try {
    rawText = await extractorFn(file);
  } catch (firstError) {
    // Retry once on failure
    try {
      rawText = await extractorFn(file);
    } catch (retryError) {
      throw new Error(ERROR_MESSAGES.EXTRACTION_FAILED);
    }
  }

  const cleanedText = TextCleaner.clean(rawText);

  return cleanedText;
};

const Extractor = {
  extract,
};

export default Extractor;