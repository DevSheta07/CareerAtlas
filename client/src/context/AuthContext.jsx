/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { loginUser as loginAPI, getMe } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await getMe();
          setUser(data.data);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data.data);
    } catch {
      logout();
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
