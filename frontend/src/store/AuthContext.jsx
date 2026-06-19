import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ইউজার অথেনটিকেশন চেক করার মেইন ফাংশন
  const checkAuth = async () => {
  setIsLoading(true); // আগে লোডিং চালু করুন
  try {
    const res = await api.get('/auth/profile');
    if (res.data?.user) {
      setUser(res.data.user);
      setIsLogin(true);
    }
  } catch (error) {
    // 401 আসা মানেই ইউজার লগড আউট
    setUser(null);
    setIsLogin(false);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    checkAuth();
  }, []);

  // রেজিস্ট্রেশন ফাংশন
  const register = async (formData) => {
    return await api.post('/auth/register', formData);
  };

  // লগইন ফাংশন
  const login = async (formData) => {
    const res = await api.post('/auth/login', formData);
    if (res.data?.user) {
      setUser(res.data.user);
      setIsLogin(true);
    }
    return res.data.user;
  };

  // লগআউট ফাংশন
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      // সার্ভারে যাই হোক, ফ্রন্টেন্ড স্টেট ক্লিয়ার করে দেওয়া ভালো
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

// কাস্টম হুক ব্যবহারের জন্য
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;