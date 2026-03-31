/**
 * TextCleaner - Text cleaning utility
 * Removes excessive whitespace, formatting artifacts, null characters,
 * and normalizes line breaks from extracted text content.
 */

/**
 * Removes null characters and other control characters from text.
 * @param {string} text - The raw text to clean.
 * @returns {string} Text with null/control characters removed.
 */
const removeNullCharacters = (text) => {
  if (!text) return '';
  // Remove null bytes and most control characters (keep \n, \r, \t)
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * Normalizes various line break formats to consistent \n.
 * @param {string} text - The text to normalize.
 * @returns {string} Text with normalized line breaks.
 */
const normalizeLineBreaks = (text) => {
  if (!text) return '';
  // Normalize \r\n and \r to \n
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};

/**
 * Removes excessive whitespace while preserving paragraph structure.
 * @param {string} text - The text to clean.
 * @returns {string} Text with excessive whitespace removed.
 */
const removeExcessiveWhitespace = (text) => {
  if (!text) return '';
  // Replace multiple spaces/tabs on the same line with a single space
  let cleaned = text.replace(/[^\S\n]+/g, ' ');
  // Remove trailing whitespace on each line
  cleaned = cleaned.replace(/ +\n/g, '\n');
  // Remove leading whitespace on each line
  cleaned = cleaned.replace(/\n +/g, '\n');
  // Collapse 3+ consecutive newlines into 2 (preserve paragraph breaks)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
};

/**
 * Removes common formatting artifacts from extracted text.
 * @param {string} text - The text to clean.
 * @returns {string} Text with formatting artifacts removed.
 */
const removeFormattingArtifacts = (text) => {
  if (!text) return '';
  // Remove soft hyphens
  let cleaned = text.replace(/\u00AD/g, '');
  // Remove zero-width spaces and joiners
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  // Remove non-breaking spaces and replace with regular spaces
  cleaned = cleaned.replace(/\u00A0/g, ' ');
  // Remove form feed characters
  cleaned = cleaned.replace(/\f/g, '\n');
  // Remove page break artifacts (common in PDF extraction)
  cleaned = cleaned.replace(/\x0C/g, '\n');
  return cleaned;
};

/**
 * Cleans extracted text by applying all cleaning steps in sequence.
 * @param {string} text - The raw extracted text to clean.
 * @returns {string} The cleaned text.
 */
export const clean = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text;
  cleaned = removeNullCharacters(cleaned);
  cleaned = removeFormattingArtifacts(cleaned);
  cleaned = normalizeLineBreaks(cleaned);
  cleaned = removeExcessiveWhitespace(cleaned);
  cleaned = cleaned.trim();

  return cleaned;
};

const TextCleaner = {
  clean,
  removeNullCharacters,
  normalizeLineBreaks,
  removeExcessiveWhitespace,
  removeFormattingArtifacts,
};

export default TextCleaner;