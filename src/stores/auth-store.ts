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
  _isHydrated: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setHydrated: (isHydrated: boolean) => void;
  logout: () => void;
  checkAdminStatus: (user: User | null) => Promise<void>;
  initializeAuthListener: () => () => void;
}

const { auth, firestore } = initializeFirebase();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      isAuthLoading: true,
      _isHydrated: false,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setHydrated: (isHydrated) => set({ _isHydrated: isHydrated }),
      logout: () => {
        auth.signOut();
        set({ user: null, isAdmin: false });
      },
      checkAdminStatus: async (user: User | null) => {
        if (user) {
          const roleDocRef = doc(firestore, 'roles_admin', user.uid);
          const roleDoc = await getDoc(roleDocRef);
          const isAdmin = roleDoc.exists() && roleDoc.data()?.role === 'admin';
          set({ isAdmin });
        } else {
          set({ isAdmin: false });
        }
      },
      initializeAuthListener: () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          set({ user, isAuthLoading: true });
          if (user) {
            const roleDocRef = doc(firestore, 'roles_admin', user.uid);
            const roleDoc = await getDoc(roleDocRef);
            set({ isAdmin: roleDoc.exists() && roleDoc.data()?.role === 'admin', isAuthLoading: false });
          } else {
            set({ isAdmin: false, isAuthLoading: false });
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

// Initialize the listener once the app loads
if (typeof window !== 'undefined') {
    useAuthStore.getState().initializeAuthListener();
}
