'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
  initializeAuthListener: () => () => void;
}

const { auth, firestore } = initializeFirebase();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isAuthLoading: true,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      logout: () => {
        auth.signOut();
        set({ user: null, isAdmin: false });
      },
      initializeAuthListener: () => {
        set({ isAuthLoading: true });
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
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          state.initializeAuthListener();
        }
      },
    }
  )
);

// Initialize the listener when the app loads on the client
if (typeof window !== 'undefined') {
    useAuthStore.getState().initializeAuthListener();
}
