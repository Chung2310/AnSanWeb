'use client';
import { useCategories } from '@/hooks/use-categories';
import { useProducts } from '@/hooks/use-products';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CategoryNavProps {
    onCategorySelect: (slug: string | null) => void;
    selectedCategory: string | null;
}

export default function CategoryNav({ onCategorySelect, selectedCategory }: CategoryNavProps) {
    const { categories, isLoading: isLoadingCategories } = useCategories();
    const { products, isLoading: isLoadingProducts } = useProducts();

    const getProductCountForCategory = (slug: string) => {
        if (isLoadingProducts || !products) return 0;
        return products.filter(p => p.tags?.includes(slug)).length;
    };

    const navItems = categories
        ?.map(cat => ({
            label: cat.name,
            slug: cat.slug,
            count: getProductCountForCategory(cat.slug)
        }))
        .filter(item => item.count > 0) // Only show categories with products
        .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically
        || [];
    
    const allProductsCount = products?.length || 0;

    return (
        <div className="border-b border-t">
            <div className="container py-4 flex items-center gap-8 text-sm uppercase font-semibold text-gray-500">
                <h2 className="font-bold text-black whitespace-nowrap">Danh mục</h2>
                <div className="flex-grow flex items-center gap-6 overflow-x-auto">
                    <button
                        className={cn(
                            "hover:text-black transition-colors whitespace-nowrap",
                            selectedCategory === null ? "text-black font-bold" : ""
                        )}
                        onClick={() => onCategorySelect(null)}
                    >
                        Tất cả ({allProductsCount})
                    </button>
                    {navItems.map(item => (
                         <button
                            key={item.slug}
                            className={cn(
                                "hover:text-black transition-colors whitespace-nowrap",
                                selectedCategory === item.slug ? "text-black font-bold" : ""
                            )}
                            onClick={() => onCategorySelect(item.slug)}
                        >
                            {item.label} ({item.count})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
