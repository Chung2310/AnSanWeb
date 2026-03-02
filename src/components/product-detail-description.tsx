
'use client';
import { useState, useCallback, useRef, useEffect } from "react";
import type { ProductStructuredDetails } from "@/lib/types";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DetailSection = ({ title, content }: { title: string, content?: string | null }) => {
    if (!content || content === 'Đang cập nhật') return null;
    return (
        <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="space-y-2">
                {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
        </div>
    );
}

export default function ProductDetailDescription({ details }: { details: ProductStructuredDetails }) {
    const { title, paragraphs, details: detailList, tastingNote, howToEnjoy, foodPairing, storage, conclusion } = details;
    const [isExpanded, setIsExpanded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isFirstRun = useRef(true);

    const hasContent = 
      (paragraphs && paragraphs.length > 0 && paragraphs.some(p => p.trim() !== '')) || 
      (detailList && detailList.length > 0) || 
      (tastingNote && (tastingNote.nose !== 'Đang cập nhật' || tastingNote.palate !== 'Đang cập nhật' || tastingNote.finish !== 'Đang cập nhật')) || 
      howToEnjoy || 
      foodPairing || 
      storage || 
      conclusion;

    // Improved fix for jump scroll after collapsing
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (!isExpanded && sectionRef.current) {
            setTimeout(() => {
                const rect = sectionRef.current!.getBoundingClientRect();
                if (rect.top < 0) {
                    const scrollTarget = window.scrollY + rect.top - 210;
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [isExpanded]);

    if (!hasContent) {
        return null;
    }
    
    const allParagraphs = paragraphs;
    const displayParagraphs = isExpanded ? allParagraphs : allParagraphs.slice(0, 2);

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <section className="py-20 seo-container" ref={sectionRef} style={{backgroundColor: '#fdfaf5'}}>
            <div className="container max-w-4xl mx-auto">
                <h2 className="text-center font-headline text-4xl font-black uppercase mb-10" style={{color: '#5a5a5a'}}>
                    Mô Tả Chi Tiết
                </h2>
                
                <div className="text-left text-base leading-relaxed" style={{color: '#5a5a5a'}}>
                    <h3 className="font-bold text-lg mb-6">{title}</h3>

                    {displayParagraphs.map((p, i) => (
                        <p key={`p1-${i}`} className="mb-4" dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br />') }}></p>
                    ))}

                    <AnimatePresence initial={false}>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                className="overflow-hidden"
                            >
                                {allParagraphs.slice(2).map((p, i) => (
                                    <p key={`p2-${i}`} className="mb-4" dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br />') }}></p>
                                ))}

                                {detailList && detailList.length > 0 && (
                                    <>
                                        <h4 className="font-bold text-md mt-8 mb-4">Chi Tiết Về {title}:</h4>
                                        <ul className="mb-4 space-y-2">
                                            {detailList.map(item => (
                                                <li key={item.label}>
                                                    <span className="font-semibold">{item.label}:</span> {item.value}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                
                                {tastingNote && (tastingNote.nose !== 'Đang cập nhật' || tastingNote.palate !== 'Đang cập nhật' || tastingNote.finish !== 'Đang cập nhật') && (
                                    <>
                                        <h3 className="font-bold text-lg mt-10 mb-4">Tasting Note Chi Tiết</h3>
                                        <div className="space-y-4">
                                            {tastingNote.nose && tastingNote.nose !== 'Đang cập nhật' && <p><span className="font-semibold">Mùi hương:</span> {tastingNote.nose}</p>}
                                            {tastingNote.palate && tastingNote.palate !== 'Đang cập nhật' && <p><span className="font-semibold">Hương vị:</span> {tastingNote.palate}</p>}
                                            {tastingNote.finish && tastingNote.finish !== 'Đang cập nhật' && <p><span className="font-semibold">Hậu vị:</span> {tastingNote.finish}</p>}
                                        </div>
                                    </>
                                )}

                                <div className="mt-10">
                                    <DetailSection title="Cách Thưởng Thức" content={howToEnjoy} />
                                    <DetailSection title="Kết Hợp Món Ăn" content={foodPairing} />
                                    <DetailSection title="Bảo Quản" content={storage} />
                                </div>


                                {conclusion && (
                                    <>
                                        <h3 className="font-bold text-lg mt-10 mb-4">Kết Luận:</h3>
                                        <p className="leading-relaxed">{conclusion}</p>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {allParagraphs.length > 2 && (
                    <div className="text-center mt-8">
                        <Button 
                            variant="link" 
                            type="button"
                            onClick={handleToggle}
                            className="text-primary hover:text-primary/80 no-underline hover:no-underline font-bold"
                        >
                            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            {isExpanded ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
