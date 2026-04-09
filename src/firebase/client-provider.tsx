'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { useAuthStore } from '@/stores/auth-store';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { initializeAuthListener } = useAuthStore();
  
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []); 

  useEffect(() => {
    const unsubscribe = initializeAuthListener(firebaseServices.auth, firebaseServices.firestore);
    return () => unsubscribe();
  }, [firebaseServices, initializeAuthListener]);


  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
      storage={firebaseServices.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
