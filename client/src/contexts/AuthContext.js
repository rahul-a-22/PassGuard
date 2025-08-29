import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch user profile
        const response = await axios.get(`${API_URL}/auth/profile`);
        
        if (response.data.success) {
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [API_URL]);

  // Register user
  const register = async (userData) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Process Google OAuth callback
  const handleGoogleCallback = (token) => {
    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user profile
      axios.get(`${API_URL}/auth/profile`)
        .then(response => {
          if (response.data.success) {
            setCurrentUser(response.data.user);
            setIsAuthenticated(true);
          }
        })
        .catch(error => {
          console.error('Google callback error:', error);
          setError('Failed to get user profile');
          // Clear invalid token
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        });
      
      return true;
    }
    
    return false;
  };

  // Logout user
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    handleGoogleCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};