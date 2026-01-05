'use client';
import { useState } from "react";
import type { ProductDetails } from "@/lib/types";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailDescription({ details }: { details: ProductDetails }) {
    const { title, paragraphs, details: detailList, tastingNote, conclusion } = details;
    const [isExpanded, setIsExpanded] = useState(false);

    const previewParagraphs = paragraphs.slice(0, 2);
    const remainingParagraphs = paragraphs.slice(2);

    return (
        <section className="py-20" style={{backgroundColor: '#fdfaf5'}}>
            <div className="container max-w-4xl mx-auto">
                <h2 className="text-center font-headline text-4xl font-black uppercase mb-10" style={{color: '#5a5a5a'}}>
                    Chi Tiết Sản Phẩm
                </h2>
                
                <div className="text-left text-base leading-relaxed" style={{color: '#5a5a5a'}}>
                    <h3 className="font-bold text-lg mb-6">{title}</h3>

                    {previewParagraphs.map((p, i) => (
                        <p key={`p1-${i}`} className="mb-4">{p}</p>
                    ))}

                    <AnimatePresence initial={false}>
                        {isExpanded && (
                            <motion.div
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                    open: { opacity: 1, height: "auto" },
                                    collapsed: { opacity: 0, height: 0 }
                                }}
                                transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                className="overflow-hidden"
                            >
                                {remainingParagraphs.map((p, i) => (
                                    <p key={`p2-${i}`} className="mb-4">{p}</p>
                                ))}

                                <h4 className="font-bold text-md mt-8 mb-4">Chi Tiết Về {title} – Dấu Ấn Của Thời Gian và Sự Tuyển Chọn:</h4>
                                <ul className="mb-4 space-y-2">
                                    {detailList.map(item => (
                                        <li key={item.label}>
                                            <span className="font-semibold">{item.label}:</span> {item.value}
                                        </li>
                                    ))}
                                </ul>
                                
                                {paragraphs.length > 2 && (
                                  <>
                                    <h4 className="font-bold text-md mt-8 mb-4">Ý Nghĩa Của {detailList.find(d => d.label === "Tuổi Rượu")?.value} Trưởng Thành Nhiệt Đới và Sự Ảnh Hưởng Của Thùng {detailList.find(d => d.label === "Loại Thùng Ủ")?.value}:</h4>
                                    {paragraphs.slice(3).map((p, i) => (
                                        <p key={`p3-${i}`} className="mb-4 leading-relaxed">{p}</p>
                                    ))}
                                  </>
                                )}
                                
                                <h3 className="font-bold text-lg mt-10 mb-4">Tasting Note</h3>
                                <div className="space-y-4">
                                    <p><span className="font-semibold">Mùi hương:</span> {tastingNote.nose}</p>
                                    <p><span className="font-semibold">Hương vị:</span> {tastingNote.palate}</p>
                                    <p><span className="font-semibold">Hậu vị:</span> {tastingNote.finish}</p>
                                </div>

                                <h3 className="font-bold text-lg mt-10 mb-4">Kết Luận:</h3>
                                <p className="leading-relaxed">{conclusion}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="text-center mt-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="font-bold text-sm tracking-widest hover:bg-transparent"
                        style={{color: '#5a5a5a'}}
                    >
                        {isExpanded ? 'THU GỌN' : 'XEM THÊM'}
                        {isExpanded ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
                    </Button>
                </div>
            </div>
        </section>
    );
}
