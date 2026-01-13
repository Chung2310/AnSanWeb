import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
const faqItems = [
    {
        question: "RƯỢU VANG ĐỎ VÀ RƯỢU VANG TRẮNG KHÁC NHAU NHƯ THẾ NÀO?",
        answer: "Sự khác biệt chính nằm ở giống nho và quy trình sản xuất. Rượu vang đỏ được làm từ nho đỏ (cả vỏ), quá trình lên men tiếp xúc với vỏ nho tạo ra màu sắc và tannin. Vang trắng chủ yếu làm từ nho trắng (hoặc nho đỏ bỏ vỏ), lên men chỉ từ nước ép nho nên có màu sáng và ít tannin hơn."
    },
    {
        question: "TANNIN TRONG RƯỢU VANG LÀ GÌ?",
        answer: "Tannin là một hợp chất polyphenol tự nhiên có trong vỏ, hạt và cuống nho. Nó tạo ra cảm giác khô, chát nhẹ trong miệng khi uống rượu vang đỏ. Tannin là một thành phần quan trọng tạo nên cấu trúc, sự phức hợp và khả năng lưu giữ lâu năm của rượu vang."
    },
    {
        question: "CÁCH KẾT HỢP RƯỢU VANG VỚI MÓN ĂN?",
        answer: "Quy tắc cổ điển là 'vang trắng với thịt trắng (gà, cá), vang đỏ với thịt đỏ (bò, cừu)'. Tuy nhiên, bạn hoàn toàn có thể sáng tạo. Một nguyên tắc hữu ích là kết hợp rượu vang và món ăn có cùng cường độ hương vị. Vang nhẹ đi với món nhẹ, và vang đậm đà hợp với món ăn đậm vị."
    },
    {
        question: "LÀM THẾ NÀO ĐỂ BẢO QUẢN RƯỢU VANG SAU KHI MỞ NÚT?",
        answer: "Sau khi mở, rượu vang sẽ bắt đầu bị oxy hóa. Để bảo quản, bạn nên đậy kín nút chai và để trong tủ lạnh (kể cả vang đỏ). Vang trắng và vang hồng có thể giữ được 2-3 ngày, trong khi vang đỏ có thể giữ được 3-5 ngày. Sử dụng dụng cụ hút chân không sẽ giúp kéo dài thời gian bảo quản hơn."
    },
    {
        question: "ANSAN CAM KẾT CHẤT LƯỢNG SẢN PHẨM NHƯ THẾ NÀO?",
        answer: "Chúng tôi cam kết 100% sản phẩm là hàng chính hãng, nhập khẩu trực tiếp hoặc thông qua các nhà phân phối uy tín tại Việt Nam. Mỗi chai rượu đều có nguồn gốc xuất xứ rõ ràng và được bảo quản trong điều kiện tiêu chuẩn quốc tế để đảm bảo chất lượng tốt nhất khi đến tay khách hàng."
    }
]

export default function FaqSection() {
    return (
        <section className="py-20" style={{backgroundColor: '#fdfaf5'}}>
            <div className="container max-w-4xl mx-auto">
                <h2 className="text-center font-headline text-4xl font-black uppercase mb-10" style={{color: '#5a5a5a'}}>
                    Câu Hỏi Thường Gặp
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index + 1}`} key={index}>
                            <AccordionTrigger className="text-left font-bold text-sm tracking-wider hover:no-underline" style={{color: '#5a5a5a'}}>
                                {index + 1}. {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base leading-relaxed" style={{color: '#5a5a5a'}}>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
