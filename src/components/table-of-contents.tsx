'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import Link from "next/link";
import { List } from "lucide-react";

type Heading = {
    id: string;
    text: string;
    level: number;
};

export default function TableOfContents({ headings }: { headings: Heading[] }) {
    if (headings.length === 0) {
        return null;
    }

    return (
        <div className="border border-neutral-300 p-6 mb-10">
             <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-0 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <List className="h-5 w-5" style={{ color: '#8a7d6a' }}/>
                            <h2 className="font-headline text-xl font-black uppercase text-neutral-700">
                                Mục Lục Bài Viết
                            </h2>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pl-8">
                        <ul className="space-y-3">
                            {headings.map((heading, index) => (
                                <li key={heading.id} className="text-sm font-bold uppercase tracking-wider">
                                    <Link 
                                        href={`#${heading.id}`}
                                        className="flex items-start gap-3 text-neutral-600 hover:text-primary transition-colors"
                                    >
                                        <span>{index + 1}</span>
                                        <span className="flex-1">{heading.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
