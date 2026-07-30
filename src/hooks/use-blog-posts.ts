'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { BlogPost } from '@/lib/types';

export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    apiClient
      .get('/blog-posts?limit=100')
      .then((res) => {
        if (active) {
          setBlogPosts(res.data || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { blogPosts, isLoading, error };
}
