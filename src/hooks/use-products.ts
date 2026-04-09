'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';

export function useProducts() {
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(
    () => collection(firestore, 'products'),
    [firestore]
  );
  
  const productsQuery = useMemoFirebase(
    () => productsCollection && query(productsCollection, orderBy('updatedAt', 'desc')),
    [productsCollection]
  );

  const { data: products, isLoading, error } = useCollection<Product>(productsQuery);

  return { products, isLoading, error };
}
