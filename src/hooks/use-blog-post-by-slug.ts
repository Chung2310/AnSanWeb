'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { BlogPost } from '@/lib/types';

export function useBlogPostBySlug(slug: string | null) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    apiClient
      .get(`/blog-posts/slug/${slug}`)
      .then((res) => {
        if (active) {
          setPost(res.data || null);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
          setPost(null);
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
  }, [slug]);

  return { post, isLoading, error };
}
