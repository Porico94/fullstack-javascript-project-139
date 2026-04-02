import {
  createContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');

    if (token) {
      setLoggedIn(true);
      setUser({ username: 'admin' });
      return true;
    }
    setLoggedIn(false);
    setUser(null);
    return false;
  };

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/v1/login', { username, password });

      const { token } = response.data;

      localStorage.setItem('token', token);
      setUser({ username });
      setLoggedIn(true);
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          errorCode: 'INVALID_CREDENTIALS',
        };
      }

      return {
        success: false,
        errorCode: 'CONNECTION_ERROR',
      };
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await axios.post('/api/v1/signup', { username, password });

      const { token } = response.data;

      localStorage.setItem('token', token);
      setUser({ username });
      setLoggedIn(true);
      return { success: true };
    } catch (error) {
      if (error.response?.status === 409) {
        return {
          success: false,
          errorCode: 'USER_EXISTS',
          username,
        };
      }

      return {
        success: false,
        errorCode: 'CONNECTION_ERROR',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    signup,
    loggedIn,
    checkAuth,
    loading,
  }), [user, loggedIn, loading]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
