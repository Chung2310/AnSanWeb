'use client';

import { create } from 'zustand';
import type { Wine } from '@/lib/types';

type ProductDialogState = {
  id?: string;
  isOpen: boolean;
  defaultValues?: Partial<Wine>;
  onOpen: (id?: string, defaultValues?: Partial<Wine>) => void;
  onClose: () => void;
};

export const useProductDialog = create<ProductDialogState>((set) => ({
  id: undefined,
  isOpen: false,
  defaultValues: undefined,
  onOpen: (id, defaultValues) => set({ isOpen: true, id, defaultValues }),
  onClose: () => set({ isOpen: false, id: undefined, defaultValues: undefined }),
}));
