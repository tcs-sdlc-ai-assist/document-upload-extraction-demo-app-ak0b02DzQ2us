import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { login as authLogin, signup as authSignup } from '../services/authService';
import { getSession, setSession, clearSession } from '../services/sessionService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = getSession();
      if (session && session.username) {
        setUser({ username: session.username });
      }
    } catch {
      // Silently fail if session retrieval errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await authLogin(username, password);
    setSession(result.username);
    setUser({ username: result.username });
    return result;
  }, []);

  const signup = useCallback(async (username, password) => {
    await authSignup(username, password);
    const result = await authLogin(username, password);
    setSession(result.username);
    setUser({ username: result.username });
    return result;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;