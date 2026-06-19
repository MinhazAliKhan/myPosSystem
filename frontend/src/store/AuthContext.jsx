import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    // যদি অলরেডি লোডিং থাকে, তবে রিকোয়েস্ট পাঠাবে না (লুপ আটকানোর জন্য)
    if (!isLoading) setIsLoading(true); 

    try {
      const res = await api.get('/auth/profile');
      if (res.data?.user) {
        setUser(res.data.user);
        setIsLogin(true);
      } else {
        setUser(null);
        setIsLogin(false);
      }
    } catch (error) {
      setUser(null);
      setIsLogin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // শুধুমাত্র মাউন্ট হওয়ার সময় একবার কল হবে
    checkAuth();
  }, []);

  const register = async (formData) => {
    return await api.post('/auth/register', formData);
  };

  const login = async (formData) => {
    const res = await api.post('/auth/login', formData);
    if (res.data?.user) {
      setUser(res.data.user);
      setIsLogin(true);
    }
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setIsLogin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogin,
        isLoading,
        register,
        login,
        logout,
        checkAuth,
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

export default AuthProvider;