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
      // Query for the specific post using its slug
      return query(
        blogPostsCollection, 
        where('slug', '==', slug),
        limit(1) // Since slug should be unique, we only need 1 document
      );
    },
    [blogPostsCollection, slug] // IMPORTANT: slug is now a dependency
  );

  const { data, isLoading, error } = useCollection<BlogPost>(blogPostQuery);

  // The hook returns an array, so we extract the first (and only) element
  const post = useMemo(() => (data && data.length > 0 ? data[0] : null), [data]);

  return { post, isLoading, error };
}
