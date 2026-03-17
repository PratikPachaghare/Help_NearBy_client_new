import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiCallAuth, verifyToken } from './ApiCalls';
import { Endpoints } from './Endpiont';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  const refreshUser = async () => {
    const resp = await verifyToken(Endpoints.Auth.VerifyToken);
    setUser(resp?.data?.user || null);
    return resp?.data?.user || null;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    verifyToken(Endpoints.Auth.VerifyToken)
      .then((resp) => {
        setUser(resp?.data?.user || null);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const resp = await apiCallAuth('POST', Endpoints.Auth.Login, { email, password });
    const accessToken = resp?.data?.accessToken;
    const loggedInUser = resp?.data?.user;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    setUser(loggedInUser || null);
    return loggedInUser;
  };

  const register = async (payload) => {
    const resp = await apiCallAuth('POST', Endpoints.Auth.Register, payload);
    const accessToken = resp?.data?.accessToken;
    const newUser = resp?.data?.user;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    setUser(newUser || null);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);