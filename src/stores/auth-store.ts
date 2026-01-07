'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, Firestore } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
  initializeAuthListener: (auth: Auth, firestore: Firestore) => () => void;
}

// This function will be called by the provider, not here.
const initializeListener = (set: (fn: (state: AuthState) => Partial<AuthState>) => void, auth: Auth, firestore: Firestore) => {
    set(state => ({ ...state, isAuthLoading: true }));
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        set(state => ({ ...state, user }));
        if (user) {
            try {
                const roleDocRef = doc(firestore, 'roles_admin', user.uid);
                const roleDoc = await getDoc(roleDocRef);
                set(state => ({ ...state, isAdmin: roleDoc.exists() && roleDoc.data()?.role === 'admin' }));
            } catch (error) {
                console.error("Error checking admin status:", error);
                set(state => ({ ...state, isAdmin: false }));
            }
        } else {
            set(state => ({ ...state, isAdmin: false }));
        }
        set(state => ({ ...state, isAuthLoading: false }));
    });
    return unsubscribe;
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      isAuthLoading: true,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      logout: () => {
        // Auth instance will be available when this is called from the app
      },
      initializeAuthListener: (auth: Auth, firestore: Firestore) => {
        // Redefine logout with the auth instance
        set({
            logout: () => {
                auth.signOut();
                set({ user: null, isAdmin: false });
            }
        });
        return initializeListener(set, auth, firestore);
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
       // We don't need onRehydrateStorage as initialization is now handled by the provider.
       // We also exclude functions from being persisted.
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);
