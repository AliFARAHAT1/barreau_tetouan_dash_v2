
import { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_CONFIG } from '../constants';

const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {

        const loggedIn = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
        setIsLoggedIn(loggedIn === 'true');
      } catch (error) {
        console.error('خطأ في التحقق من حالة المصادقة:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    setIsLoggedIn(false);
  };


  const value = {
    isLoggedIn,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  }
  
  return context;
};