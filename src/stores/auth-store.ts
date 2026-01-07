'use client';

import { create } from 'zustand';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, Firestore } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  logout: () => void;
  initializeAuthListener: (auth: Auth, firestore: Firestore) => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  isAuthLoading: true,
  logout: () => {
    const { auth } = get()._internal;
    if (auth) {
      auth.signOut();
    }
  },
  initializeAuthListener: (auth: Auth, firestore: Firestore) => {
    set({ _internal: { auth, firestore } });
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Since firestore.rules now checks email, we can do the same on the client
        const isAdmin = user.email === 'admin@ansan.com';
        set({ user, isAdmin, isAuthLoading: false });
      } else {
        set({ user: null, isAdmin: false, isAuthLoading: false });
      }
    });

    return unsubscribe;
  },
  _internal: {
    auth: null,
    firestore: null,
  },
}));
