import { ERROR_MESSAGES } from '../constants';

const SESSION_STORAGE_KEY = 'session';

export const getSession = () => {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const setSession = (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
  }

  const session = {
    username: username.trim(),
    loginAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    throw new Error(ERROR_MESSAGES.STORAGE_FULL);
  }

  return session;
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Silently fail on removal errors
  }
};

const SessionManager = {
  getSession,
  setSession,
  clearSession,
};

export default SessionManager;