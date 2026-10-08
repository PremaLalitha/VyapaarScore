import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth token header for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load user session on initial mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Session load error:', error);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Signup
  const signup = async (formData) => {
    const res = await axios.post('/api/auth/signup', formData);
    return res.data;
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { email, otp });
    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // Resend OTP
  const resendOTP = async (email) => {
    const res = await axios.post('/api/auth/resend-otp', { email });
    return res.data;
  };

  // Login
  const login = async (email, password, loginMode = 'user', targetRole = '') => {
    const res = await axios.post('/api/auth/login', { email, password, loginMode, targetRole });
    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return res.data;
  };

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
    return res.data;
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    const res = await axios.post('/api/auth/update-profile', profileData);
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
    }
    return res.data;
  };

  // Change Password
  const changePassword = async (passwords) => {
    const res = await axios.post('/api/auth/change-password', passwords);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        verifyOTP,
        resendOTP,
        login,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
