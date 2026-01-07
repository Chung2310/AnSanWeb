'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  _isHydrated: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setHydrated: (isHydrated: boolean) => void;
  logout: () => void;
  initializeAuthListener: () => () => void;
}

const { auth, firestore } = initializeFirebase();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      _isHydrated: false,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setHydrated: (isHydrated) => set({ _isHydrated: isHydrated }),
      logout: () => {
        auth.signOut();
        set({ user: null, isAdmin: false });
      },
      initializeAuthListener: () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          set({ user });
          if (user) {
            const roleDocRef = doc(firestore, 'roles_admin', user.uid);
            const roleDoc = await getDoc(roleDocRef);
            set({ isAdmin: roleDoc.exists() && roleDoc.data()?.role === 'admin' });
          } else {
            set({ isAdmin: false });
          }
        });
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

useAuthStore.getState().initializeAuthListener();
