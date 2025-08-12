import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('brain_dash_token');
    const username = localStorage.getItem('brain_dash_username');
    
    if (token && username) {
      setUser({ token, username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('brain_dash_token', data.token);
      localStorage.setItem('brain_dash_username', data.username);
      setUser({ token: data.token, username: data.username });
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const register = async (username, password) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('brain_dash_token', data.token);
      localStorage.setItem('brain_dash_username', data.username);
      setUser({ token: data.token, username: data.username });
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const logout = () => {
    localStorage.removeItem('brain_dash_token');
    localStorage.removeItem('brain_dash_username');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}