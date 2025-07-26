//This field contains the main authentication context for the application

import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/api';
import { io } from "socket.io-client";

export const AuthContext = createContext();

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket;

    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data.user);
        const namespace = res.data.user.isAdmin ? '/admin' : '/user';
        newSocket = io("http://localhost:8080" + namespace);
        setSocket(newSocket);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    return () => {
      if (newSocket) newSocket.disconnect();
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const login = async ({ email, password }) => {
    const res = await axios.post('/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);

    if (socket) socket.disconnect();
    const namespace = res.data.user.isAdmin ? '/admin' : '/user';
    const newSocket = io("http://localhost:8080" + namespace);
    setSocket(newSocket);

    return res.data.user; // Let caller handle navigation
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
    localStorage.removeItem("token");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const register = async (userData) => {
    const res = await axios.post('/auth/register', userData);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, register, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
