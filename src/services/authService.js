import { ERROR_MESSAGES } from '../constants';

const USERS_STORAGE_KEY = 'users';

const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    throw new Error(ERROR_MESSAGES.STORAGE_FULL);
  }
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 32) {
    return false;
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(trimmed);
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  if (password.length < 6 || password.length > 64) {
    return false;
  }
  return true;
};

export const signup = async (username, password) => {
  if (!validateUsername(username)) {
    throw new Error('Invalid username. Must be 3-32 characters, alphanumeric or underscore.');
  }
  if (!validatePassword(password)) {
    throw new Error('Invalid password. Must be 6-64 characters.');
  }

  const users = getUsers();
  const trimmedUsername = username.trim();
  const existingUser = users.find(
    (user) => user.username.toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (existingUser) {
    throw new Error('Username already exists. Please choose a different username.');
  }

  const newUser = {
    username: trimmedUsername,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
};

export const login = async (username, password) => {
  if (!username || !password) {
    throw new Error('Incorrect username or password. Please try again.');
  }

  const users = getUsers();
  const trimmedUsername = username.trim();
  const user = users.find(
    (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (!user) {
    throw new Error('Incorrect username or password. Please try again.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect username or password. Please try again.');
  }

  return { username: user.username };
};

const AuthModule = {
  signup,
  login,
  validateUsername,
  validatePassword,
};

export default AuthModule;