'use client';

import { create } from 'zustand';
import type { FullProduct } from '@/lib/types';

type ProductDetailDialogState = {
  id?: string;
  isOpen: boolean;
  defaultValues?: Partial<FullProduct>;
  onOpen: (id: string, defaultValues?: Partial<FullProduct>) => void;
  onClose: () => void;
};

export const useProductDetailDialog = create<ProductDetailDialogState>((set) => ({
  id: undefined,
  isOpen: false,
  defaultValues: undefined,
  onOpen: (id, defaultValues) => set({ isOpen: true, id, defaultValues }),
  onClose: () => set({ isOpen: false, id: undefined, defaultValues: undefined }),
}));
