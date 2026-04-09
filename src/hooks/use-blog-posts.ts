'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';

export function useBlogPosts() {
  const firestore = useFirestore();

  const blogPostsCollection = useMemoFirebase(
    () => collection(firestore, 'blogPosts'),
    [firestore]
  );
  
  const blogPostsQuery = useMemoFirebase(
    () => blogPostsCollection && query(blogPostsCollection, orderBy('updatedAt', 'desc')),
    [blogPostsCollection]
  );

  const { data: blogPosts, isLoading, error } = useCollection<BlogPost>(blogPostsQuery);

  return { blogPosts, isLoading, error };
}
