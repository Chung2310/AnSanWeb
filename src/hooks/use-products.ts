'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Wine } from '@/lib/types';

export function useProducts() {
  const firestore = useFirestore();

  const winesCollection = useMemoFirebase(
    () => collection(firestore, 'wines'),
    [firestore]
  );
  
  const winesQuery = useMemoFirebase(
    () => winesCollection && query(winesCollection, orderBy('createdAt', 'desc')),
    [winesCollection]
  );

  const { data: products, isLoading, error } = useCollection<Wine>(winesQuery);

  return { products, isLoading, error };
}
