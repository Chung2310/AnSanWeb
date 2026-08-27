'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Product } from '@/lib/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    apiClient
      .get('/products?limit=1000') // fetch a large limit of products for client-side list/filter
      .then((res) => {
        if (active) {
          setProducts(res.data || []);
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

  return { products, isLoading, error };
}
