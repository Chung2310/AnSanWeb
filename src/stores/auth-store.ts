'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      login: (user) => set({ user, loading: false }),
      logout: () => set({ user: null, loading: false }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.setLoading(false);
        }
      },
    }
  )
);
