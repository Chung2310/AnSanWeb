'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { getSdks } from '@/firebase';
import { initializeFirebase } from '@/firebase';


type User = Pick<FirebaseUser, 'uid' | 'email' | 'displayName' | 'photoURL'>;

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (user: FirebaseUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  _isHydrated: boolean;
};

// This function initializes a listener to Firebase Auth state changes
// and updates the Zustand store accordingly.
// It's defined outside the store to be called once.
let authListenerUnsubscribe: (() => void) | null = null;

function subscribeToAuthChanges(set: (fn: (state: AuthState) => Partial<AuthState>) => void) {
  if (typeof window !== 'undefined' && !authListenerUnsubscribe) {
    const { auth } = initializeFirebase();
    authListenerUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        set(state => ({ user: { uid, email, displayName, photoURL }, loading: false }));
      } else {
        set(state => ({ user: null, loading: false }));
      }
    });
  }
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Call this on store creation
      subscribeToAuthChanges(set);

      return {
        user: null,
        loading: true,
        _isHydrated: false, // Flag to check if rehydration is done

        login: (user) => {
          const { uid, email, displayName, photoURL } = user;
          set({ user: { uid, email, displayName, photoURL }, loading: false })
        },
        
        logout: () => {
          const { auth } = initializeFirebase();
          auth.signOut(); // This will trigger onAuthStateChanged, which updates the state.
        },
        
        setLoading: (loading) => set({ loading }),
      };
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state._isHydrated = true;
            // The onAuthStateChanged listener will manage the loading state,
            // so we don't need to set loading to false here explicitly after hydration.
        }
      },
    }
  )
);
