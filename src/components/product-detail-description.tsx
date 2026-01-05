'use client';
import type { ProductDetails } from "@/lib/types";

export default function ProductDetailDescription({ details }: { details: ProductDetails }) {
    const { title, paragraphs, details: detailList, tastingNote, conclusion } = details;

    // Split paragraphs for layout
    const para1 = paragraphs.slice(0, 3);
    const para2 = paragraphs.slice(3);

    return (
        <section className="py-20" style={{backgroundColor: '#fdfaf5'}}>
            <div className="container max-w-4xl mx-auto">
                <h2 className="text-center font-headline text-4xl font-black uppercase mb-10" style={{color: '#5a5a5a'}}>
                    Chi Tiết Sản Phẩm
                </h2>
                
                <div className="text-left" style={{color: '#5a5a5a'}}>
                    <h3 className="font-bold text-lg mb-6">{title}</h3>

                    {para1.map((p, i) => (
                        <p key={`p1-${i}`} className="mb-4 leading-relaxed">{p}</p>
                    ))}

                    <h4 className="font-bold text-md mt-8 mb-4">Chi Tiết Về {title} – Dấu Ấn Của Thời Gian và Sự Tuyển Chọn:</h4>
                    <ul className="mb-4 space-y-2">
                        {detailList.map(item => (
                            <li key={item.label}>
                                <span className="font-semibold">{item.label}:</span> {item.value}
                            </li>
                        ))}
                    </ul>
                    
                    <h4 className="font-bold text-md mt-8 mb-4">Ý Nghĩa Của {detailList.find(d => d.label === "Tuổi Rượu")?.value} Trưởng Thành Nhiệt Đới và Sự Ảnh Hưởng Của Thùng {detailList.find(d => d.label === "Loại Thùng Ủ")?.value}:</h4>

                    {para2.map((p, i) => (
                        <p key={`p2-${i}`} className="mb-4 leading-relaxed">{p}</p>
                    ))}
                    
                    <h3 className="font-bold text-lg mt-10 mb-4">Tasting Note</h3>
                    <div className="space-y-4">
                        <p><span className="font-semibold">Mùi hương:</span> {tastingNote.nose}</p>
                        <p><span className="font-semibold">Hương vị:</span> {tastingNote.palate}</p>
                        <p><span className="font-semibold">Hậu vị:</span> {tastingNote.finish}</p>
                    </div>

                    <h3 className="font-bold text-lg mt-10 mb-4">Kết Luận:</h3>
                    <p className="leading-relaxed">{conclusion}</p>
                </div>
            </div>
        </section>
    );
}
