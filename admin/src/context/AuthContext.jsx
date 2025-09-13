import { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/api';

const AuthContext = createContext();

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token, userData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    try {
      // Get user from state or localStorage as fallback
      const currentUser = user || JSON.parse(localStorage.getItem('adminUser') || 'null');
      
      // Debug log
      console.log('Current user in isAdmin:', currentUser);
      
      if (!currentUser) {
        console.log('No user found in isAdmin check');
        return false;
      }
      
      // Check for admin or superadmin role (case insensitive)
      const userRole = String(currentUser.role).toLowerCase();
      const isAuthorized = ['admin'].includes(userRole);
      
      if (!isAuthorized) {
        console.log('User does not have admin privileges. Current role:', currentUser.role);
      }
      
      return isAuthorized;
    } catch (error) {
      console.error('Error in isAdmin check:', error);
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('adminUser');
      
      if (!token || !storedUser) {
        console.log('No token or user found in localStorage');
        setLoading(false);
        return;
      }

      // Set user from localStorage immediately for better UX
      const parsedUser = JSON.parse(storedUser);
      console.log('Stored user data:', parsedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      
      // Then verify with the server
      console.log('Verifying token with server...');
      const response = await adminApi.auth.getProfile();
      console.log('Profile API response:', response.data);
      
      if (response.data.success) {
        console.log('User verified, setting user data:', response.data.data.user);
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        console.log('Token verification failed');
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
