'use client';

import Image from "next/image";
import Link from "next/link";
import { type ImagePlaceholder } from "@/lib/placeholder-images";
import { ChevronRight } from "lucide-react";

export type Breadcrumb = {
    label: string;
    href: string;
};

export type CategoryBannerProps = {
    breadcrumbs: Breadcrumb[];
    title: string;
    description: string;
    image: ImagePlaceholder;
    slug: string;
};

export default function CategoryBanner({ breadcrumbs, title, description, image }: CategoryBannerProps) {
    return (
        <section className="bg-primary text-white">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center justify-center p-8 md:p-16">
                    <div className="max-w-md">
                        <div className="flex items-center text-xs uppercase font-medium text-white/80 tracking-widest mb-4">
                            {breadcrumbs.map((crumb, index) => (
                                <div key={crumb.href} className="flex items-center">
                                    <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
                                    {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
                                </div>
                            ))}
                        </div>
                        <h1 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-wide">
                            {title}
                        </h1>
                        <p className="mt-4 text-white/90 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="relative h-64 md:h-auto min-h-[300px]">
                    <Image
                        src={image.imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </section>
    );
}
