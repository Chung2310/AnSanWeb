'use client';

import { useMemo } from 'react';
import { collection, query, where, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';

export function useBlogPostBySlug(slug: string | null) {
  const firestore = useFirestore();

  const blogPostsCollection = useMemoFirebase(
    () => collection(firestore, 'blogPosts'),
    [firestore]
  );
  
  const blogPostQuery = useMemoFirebase(
    () => {
      if (!blogPostsCollection || !slug) {
        return null;
      }
      return query(
        blogPostsCollection, 
        where('slug', '==', slug), 
        limit(1)
      );
    },
    [blogPostsCollection, slug]
  );

  const { data, isLoading, error } = useCollection<BlogPost>(blogPostQuery);

  const post = useMemo(() => (data && data.length > 0 ? data[0] : null), [data]);

  return { post, isLoading, error };
}
