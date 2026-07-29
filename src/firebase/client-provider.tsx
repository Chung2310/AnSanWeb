'use client';

import React, { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

