'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { useAuthStore } from '@/stores/auth-store';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener);

  useEffect(() => {
    if (firebaseServices.auth && firebaseServices.firestore) {
      const unsubscribe = initializeAuthListener(firebaseServices.auth, firebaseServices.firestore);
      return () => unsubscribe(); // Cleanup listener on unmount
    }
  }, [firebaseServices, initializeAuthListener]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
