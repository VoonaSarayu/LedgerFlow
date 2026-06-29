import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { type AxiosInstance } from 'axios';

interface Company {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; // 'ADMIN' | 'BILLING_MANAGER' | 'VIEWER'
  company: Company;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  api: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend Base URL
const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial to send httpOnly cookies automatically!
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('lf_token'));
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('lf_token');
    setToken(null);
    setUser(null);
  };

  // Configure axios interceptors for token injection and refresh
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('lf_token');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If unauthorized and not retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Call refresh-token endpoint (credentials cookie is sent automatically)
            const refreshRes = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
              withCredentials: true,
            });
            const { token: newAccessToken, user: newUser } = refreshRes.data;
            
            localStorage.setItem('lf_token', newAccessToken);
            setToken(newAccessToken);
            setUser(newUser);

            // Retry original request with new access token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshErr) {
            console.error('Session expired, logging out:', refreshErr);
            handleLogout();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Fetch profile on startup
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to load profile on mount, letting interceptor handle it or logging out.');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('lf_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.response?.data?.error || 'Login failed.');
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('lf_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.response?.data?.error || 'Registration failed.');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
