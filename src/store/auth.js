import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock user — matches miniprogram app.js checkLogin() fallback
const MOCK_USER = {
  openid: 'mock_dev_openid',
  nickname: '演示用户',
  avatar: '',
  subscribeStars: [],
  memberSubscriptions: [],
  isRealVerified: false,
  under14: false,
  isMock: true,
};

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [autoOpenLastStar, setAutoOpenLastStar] = useState(false);
  const [lastStarId, setLastStarId] = useState('');

  const isLoggedIn = !!userInfo;

  // Mimics app.checkLogin() — auto mock on failure
  const checkLogin = useCallback(async () => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    const user = { ...MOCK_USER };
    setUserInfo(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    setUserInfo(null);
    setAutoOpenLastStar(false);
    setLastStarId('');
  }, []);

  const saveAutoOpenPreference = useCallback((enabled) => {
    setAutoOpenLastStar(!!enabled);
  }, []);

  const setLastStar = useCallback((starId) => {
    if (starId) setLastStarId(starId);
  }, []);

  return (
    <AuthContext.Provider value={{
      userInfo, isLoggedIn, autoOpenLastStar, lastStarId,
      checkLogin, logout, saveAutoOpenPreference, setLastStar,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
