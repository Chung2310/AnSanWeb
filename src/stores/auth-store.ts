'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';

interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: IUser | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isAuthLoading: true,

  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const user = response.data;
      const accessToken = response.accessToken;
      
      localStorage.setItem('accessToken', accessToken);
      set({
        user,
        isAdmin: user.role === 'admin',
        isAuthLoading: false,
      });
    } catch (error) {
      set({ user: null, isAdmin: false, isAuthLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAdmin: false, isAuthLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isAuthLoading: true });
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      set({ user: null, isAdmin: false, isAuthLoading: false });
      return;
    }

    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data;
      set({
        user,
        isAdmin: user.role === 'admin',
        isAuthLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAdmin: false, isAuthLoading: false });
    }
  },
}));

