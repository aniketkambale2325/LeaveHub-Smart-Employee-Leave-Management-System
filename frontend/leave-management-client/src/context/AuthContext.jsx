import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, setToken, setUser, clearAuth } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUserState]  = useState(getUser());
  const [token,   setTokenState] = useState(getToken());
  const [loading, setLoading]    = useState(false);

  const login = (authResponse) => {
    setToken(authResponse.token);
    setUser(authResponse);
    setTokenState(authResponse.token);
    setUserState(authResponse);
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  const isAuthenticated = !!token;
  const role = user?.role || '';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);