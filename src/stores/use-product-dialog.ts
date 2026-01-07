import { create } from 'zustand';
import type { Product } from '@/lib/types';

interface ProductDialogState {
  isOpen: boolean;
  defaultValues?: Partial<Product>;
  onOpen: (defaultValues?: Partial<Product>) => void;
  onClose: () => void;
}

export const useProductDialog = create<ProductDialogState>((set) => ({
  isOpen: false,
  defaultValues: undefined,
  onOpen: (defaultValues) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false, defaultValues: undefined }),
}));
