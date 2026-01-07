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
        if (slug === 'all') return products.length;
        return products.filter(p => p.tags?.includes(slug)).length;
    };

    const navItems = categories?.map(cat => ({
        label: cat.name,
        slug: cat.slug,
        count: getProductCountForCategory(cat.slug)
    })) || [];
    
    // Manually add 'all' category
    const allProductsCount = products?.length || 0;


    return (
        <div className="border-b border-t">
            <div className="container py-4 flex items-center gap-8 text-sm uppercase font-semibold text-gray-500">
                <h2 className="font-bold text-black whitespace-nowrap">Danh mục</h2>
                <div className="flex-grow flex items-center gap-6 overflow-x-auto">
                    <Link
                        href="/danh-muc-san-pham"
                        className={cn(
                            "hover:text-black transition-colors whitespace-nowrap",
                            selectedCategory === null && "text-black"
                        )}
                        onClick={(e) => { e.preventDefault(); onCategorySelect(null); }}
                    >
                        Tất cả ({allProductsCount})
                    </Link>
                    {navItems.map(item => (
                         <Link
                            key={item.slug}
                            href={`/danh-muc-san-pham?category=${item.slug}`}
                            className={cn(
                                "hover:text-black transition-colors whitespace-nowrap",
                                selectedCategory === item.slug && "text-black"
                            )}
                            onClick={(e) => { e.preventDefault(); onCategorySelect(item.slug); }}
                        >
                            {item.label} ({item.count})
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
