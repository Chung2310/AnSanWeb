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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isAuthLoading: true,
  logout: () => {
    // This will be replaced by the actual logout function in initializeAuthListener
  },
  initializeAuthListener: (auth: Auth, firestore: Firestore) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      set({ user });
      if (user) {
        try {
          const roleDocRef = doc(firestore, 'roles_admin', user.uid);
          const roleDoc = await getDoc(roleDocRef);
          set({ isAdmin: roleDoc.exists() && roleDoc.data()?.role === 'admin' });
        } catch (error) {
          console.error("Error checking admin status:", error);
          set({ isAdmin: false });
        }
      } else {
        set({ isAdmin: false });
      }
      set({ isAuthLoading: false });
    });

    set({ logout: () => auth.signOut() });
    
    return unsubscribe;
  },
}));
