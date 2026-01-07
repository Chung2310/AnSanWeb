'use client';

import { create } from 'zustand';
import type { BlogPost } from '@/lib/types';

type BlogDialogState = {
  id?: string;
  isOpen: boolean;
  defaultValues?: Partial<BlogPost>;
  onOpen: (id?: string, defaultValues?: Partial<BlogPost>) => void;
  onClose: () => void;
};

export const useBlogDialog = create<BlogDialogState>((set) => ({
  id: undefined,
  isOpen: false,
  defaultValues: undefined,
  onOpen: (id, defaultValues) => set({ isOpen: true, id, defaultValues }),
  onClose: () => set({ isOpen: false, id: undefined, defaultValues: undefined }),
}));
