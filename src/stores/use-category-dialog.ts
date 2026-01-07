import { create } from 'zustand';
import type { Category } from '@/lib/types';

interface CategoryDialogState {
  isOpen: boolean;
  defaultValues?: Partial<Category>;
  onOpen: (defaultValues?: Partial<Category>) => void;
  onClose: () => void;
}

export const useCategoryDialog = create<CategoryDialogState>((set) => ({
  isOpen: false,
  defaultValues: undefined,
  onOpen: (defaultValues) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false, defaultValues: undefined }),
}));
