'use client';

import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';

export function useBlogPosts() {
  const firestore = useFirestore();

  const blogPostsQuery = useMemoFirebase(
    () => collection(firestore, 'blogPosts'),
    [firestore]
  );

  const { data: blogPosts, isLoading, error } = useCollection<BlogPost>(blogPostsQuery);

  return { blogPosts, isLoading, error };
}
