'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Category } from '@/lib/types';

export function useCategories() {
  const firestore = useFirestore();

  const categoriesCollection = useMemoFirebase(
    () => collection(firestore, 'categories'),
    [firestore]
  );
  
  const categoriesQuery = useMemoFirebase(
    () => categoriesCollection && query(categoriesCollection, orderBy('name', 'asc')),
    [categoriesCollection]
  );

  const { data: categories, isLoading, error } = useCollection<Category>(categoriesQuery);

  return { categories, isLoading, error };
}
